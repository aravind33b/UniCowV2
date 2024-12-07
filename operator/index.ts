import { parseEventLogs } from "viem";
import { ServiceManagerABI } from "./abis/ServiceManager";
import { computeBalances } from "./matching";
import { registerOperator } from "./register";
import {
  Task,
  account,
  hook,
  publicClient,
  quoterContract,
  serviceManager,
} from "./utils";
import { Mathb } from "./math";

let latestBatchNumber: bigint = BigInt(0);
const MAX_BLOCKS_PER_BATCH = 10;
const batches: Record<string, Task[]> = {};

const startMonitoring = async () => {
  const unwatchTasks = serviceManager.watchEvent.NewTaskCreated(
    {},
    {
      onLogs: async (logs) => {
        const parsedLogs = parseEventLogs({
          logs: logs,
          abi: ServiceManagerABI,
          eventName: "NewTaskCreated",
        });

        const event = parsedLogs[0];
        const poolKey = await hook.read.poolKeys([event.args.task.poolId]);

        const task = {
          ...event.args.task as Task,
          poolKey: {
            currency0: poolKey[0],
            currency1: poolKey[1],
            fee: poolKey[2],
            tickSpacing: poolKey[3],
            hooks: poolKey[4],
          },
          acceptedPools: [
            {
              currency0: poolKey[0],
              currency1: poolKey[1],
              fee: poolKey[2],
              tickSpacing: poolKey[3],
              hooks: poolKey[4],
            }
          ],
          poolOutputAmount: null,
          poolInputAmount: null,
        };

        if (!batches[latestBatchNumber.toString()]) {
          batches[latestBatchNumber.toString()] = [];
        }
        batches[latestBatchNumber.toString()].push(task);
        console.log("Task added to batch:", task);
      },
    }
  );

  const unwatchBlocks = publicClient.watchBlockNumber({
    onBlockNumber: (blockNumber) => {
      console.log("blockNumber", blockNumber);
      if (latestBatchNumber === BigInt(0)) {
        console.log("first batch created", blockNumber);
        latestBatchNumber = blockNumber;
      } else if (blockNumber - latestBatchNumber >= MAX_BLOCKS_PER_BATCH) {
        processBatch(latestBatchNumber);
        latestBatchNumber = blockNumber;
        console.log("new batch created", latestBatchNumber);
      }
    },
  });

  return { unwatchTasks, unwatchBlocks };
};

const processBatch = async (batchNumber: bigint) => {
  try {
    const tasks = batches[batchNumber.toString()];
    if (!tasks || tasks.length === 0) {
      console.log("No tasks in batch", batchNumber);
      return;
    }

    console.log("Processing batch with tasks:", tasks);

    // Get AMM quotes for each task
    const promises = [];
    for (let i = 0; i < tasks.length; i++) {
      promises.push(
        quoterContract.simulate
          .quoteExactInputSingle([
            {
              poolKey: tasks[i].poolKey,
              zeroForOne: tasks[i].zeroForOne,
              exactAmount: -tasks[i].amountSpecified,
              sqrtPriceLimitX96: BigInt(0),
              hookData: "0x",
            },
          ])
          .then((res) => {
            console.log("Quote result for task", i, ":", res.result);
            if (tasks[i].zeroForOne) {
              tasks[i].poolInputAmount = Mathb.abs(res.result[0][0]);
              tasks[i].poolOutputAmount = Mathb.abs(res.result[0][1]);
            } else {
              tasks[i].poolInputAmount = Mathb.abs(res.result[0][1]);
              tasks[i].poolOutputAmount = Mathb.abs(res.result[0][0]);
            }
          })
          .catch((err) => {
            console.error("Error getting quote for task", i, ":", err);
            throw err;
          })
      );
    }
    await Promise.all(promises);

    console.log("Tasks after quotes:", tasks);

    // Check for CoW matching opportunities
    type MatchGroup = number[];
    const cowMatchingGroups: MatchGroup[] = [];
    
    // First check for circular matches (3 tasks)
    // A->B->C->A pattern
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        for (let k = j + 1; k < tasks.length; k++) {
          const taskA = tasks[i];
          const taskB = tasks[j];
          const taskC = tasks[k];
          
          // Check if we have A->B->C->A circular pattern
          if (
            // A sells to B
            taskA.zeroForOne !== taskB.zeroForOne &&
            taskA.poolId === taskB.poolId &&
            // B sells to C
            taskB.zeroForOne !== taskC.zeroForOne &&
            taskB.poolId === taskC.poolId &&
            // C sells to A (completing the circle)
            taskC.zeroForOne !== taskA.zeroForOne &&
            taskC.poolId === taskA.poolId
          ) {
            cowMatchingGroups.push([i, j, k]);
            // Once we find a circular match, don't look for direct matches for these tasks
            continue;
          }
        }
      }
    }

    // Then check for direct matches (2 tasks) for remaining unmatched tasks
    const matchedTasks = new Set(cowMatchingGroups.flat());
    for (let i = 0; i < tasks.length; i++) {
      if (matchedTasks.has(i)) continue; // Skip already matched tasks
      
      for (let j = i + 1; j < tasks.length; j++) {
        if (matchedTasks.has(j)) continue; // Skip already matched tasks
        
        if (tasks[i].zeroForOne !== tasks[j].zeroForOne && tasks[i].poolId === tasks[j].poolId) {
          cowMatchingGroups.push([i, j]);
          matchedTasks.add(i);
          matchedTasks.add(j);
        }
      }
    }

    console.log("CoW matching groups:", cowMatchingGroups);

    // Process all tasks through AMM if no CoW matches found
    const result = {
      matchings: tasks.map((task, index) => {
        // Check if task is part of a CoW match
        const cowGroup = cowMatchingGroups.find(group => group.includes(index));
        const isCow = cowGroup !== undefined;
        
        console.log(`Task ${task.taskId} will be processed via: ${isCow ? 'CoW Matching' : 'AMM'}`);
        if (isCow) {
          const matchedTasks = cowGroup!.filter(i => i !== index)
            .map(i => tasks[i].taskId)
            .join(', ');
          console.log(`  Matched with task(s): ${matchedTasks}`);
          if (cowGroup!.length === 3) {
            console.log('  This is part of a circular swap!');
          }
        }
        
        return {
          tasks: [task],
          feasibility: isCow ? "CIRCULAR" as const : "AMM" as const,
          isCircular: cowGroup !== undefined && cowGroup.length === 3
        };
      }),
      feasible: true,
      transferBalances: tasks.map(task => ({
        amount: Mathb.abs(task.amountSpecified),
        currency: task.zeroForOne ? task.poolKey.currency0 : task.poolKey.currency1,
        sender: task.sender
      })),
      swapBalances: tasks.map(task => ({
        amountSpecified: task.amountSpecified,
        zeroForOne: task.zeroForOne,
        sqrtPriceLimitX96: task.sqrtPriceLimitX96
      }))
    };

    console.log("Transfer balances:", result.transferBalances);
    console.log("Swap balances:", result.swapBalances);

    // Get message hash and sign
    const messageHash = await serviceManager.read.getMessageHash([
      tasks[0].poolId,
      result.transferBalances,
      result.swapBalances,
    ]);

    const signature = await account.sign({
      hash: messageHash
    });

    console.log("Sending response with signature:", signature);

    // Send response
    const tx = await serviceManager.write.respondToBatch([
      tasks,
      tasks.map(t => t.taskId),
      result.transferBalances,
      result.swapBalances,
      signature
    ]);

    console.log("Transaction sent:", tx);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });
    console.log("Transaction receipt:", receipt);

    if (receipt.status === "success") {
      console.log("Transaction succeeded");
      // Remove processed tasks from batch
      delete batches[batchNumber.toString()];
    } else {
      console.log("Transaction failed");
    }
  } catch (error) {
    console.error("Error processing batch:", error);
  }
};

const main = async () => {
  await registerOperator();
  await startMonitoring();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
