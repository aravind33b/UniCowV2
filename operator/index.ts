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
  walletClient,
} from "./utils";
import { Mathb } from "./math";

let latestBatchNumber: bigint = BigInt(0);
const MAX_BLOCKS_PER_BATCH = 10;
const batches: Record<string, Task[]> = {};

interface TransferBalance {
  amount: bigint;
  currency: `0x${string}`;
  sender: `0x${string}`;
}

interface SwapBalance {
  amountSpecified: bigint;
  zeroForOne: boolean;
  sqrtPriceLimitX96: bigint;
}

interface Result {
  matchings: {
    tasks: Task[];
    feasibility: "CIRCULAR" | "AMM";
    isCircular: boolean;
  }[];
  feasible: boolean;
  transferBalances: TransferBalance[];
  swapBalances: SwapBalance[];
}

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
for (let i = 0; i < tasks.length; i++) {
  for (let j = i + 1; j < tasks.length; j++) {
    for (let k = j + 1; k < tasks.length; k++) {
      const taskA = tasks[i];
      const taskB = tasks[j];
      const taskC = tasks[k];
      
      // Get output and input tokens for each task
      const taskAOutput = taskA.zeroForOne ? taskA.poolKey.currency1 : taskA.poolKey.currency0;
      const taskBInput = taskB.zeroForOne ? taskB.poolKey.currency0 : taskB.poolKey.currency1;
      const taskBOutput = taskB.zeroForOne ? taskB.poolKey.currency1 : taskB.poolKey.currency0;
      const taskCInput = taskC.zeroForOne ? taskC.poolKey.currency0 : taskC.poolKey.currency1;
      const taskCOutput = taskC.zeroForOne ? taskC.poolKey.currency1 : taskC.poolKey.currency0;
      const taskAInput = taskA.zeroForOne ? taskA.poolKey.currency0 : taskA.poolKey.currency1;

      if (
        taskAOutput === taskBInput &&
        taskBOutput === taskCInput &&
        taskCOutput === taskAInput
      ) {
        cowMatchingGroups.push([i, j, k]);
        continue;
      }
    }
  }
}

    // Then check for direct matches (2 tasks) for remaining unmatched tasks
    const directMatchedTasks = new Set(cowMatchingGroups.flat());
    for (let i = 0; i < tasks.length; i++) {
      if (directMatchedTasks.has(i)) continue; // Skip already matched tasks
      
      for (let j = i + 1; j < tasks.length; j++) {
        if (directMatchedTasks.has(j)) continue; // Skip already matched tasks
        
        if (tasks[i].zeroForOne !== tasks[j].zeroForOne && tasks[i].poolId === tasks[j].poolId) {
          cowMatchingGroups.push([i, j]);
          directMatchedTasks.add(i);
          directMatchedTasks.add(j);
        }
      }
    }

    console.log("CoW matching groups:", cowMatchingGroups);

    // Process all tasks through AMM if no CoW matches found
    const result: Result = {
      matchings: [],
      feasible: true,
      transferBalances: [],
      swapBalances: []
    };

    // Add each CoW matching group as a single matching
    for (const group of cowMatchingGroups) {
      result.matchings.push({
        tasks: group.map(i => tasks[i]),
        feasibility: group.length === 3 ? "CIRCULAR" : "AMM",
        isCircular: group.length === 3
      });
    }

    // Add remaining tasks as AMM matchings
    const matchedTasks = new Set(cowMatchingGroups.flat());
    for (let i = 0; i < tasks.length; i++) {
      if (!matchedTasks.has(i)) {
        result.matchings.push({
          tasks: [tasks[i]],
          feasibility: "AMM",
          isCircular: false
        });
      }
    }

    // Log matching info
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const matching = result.matchings.find(m => m.tasks.some(t => t.taskId === task.taskId));
      console.log(`Task ${task.taskId} will be processed via: ${matching?.feasibility}`);
      if (matching && matching.tasks.length > 1) {
        const matchedTasks = matching.tasks
          .filter(t => t.taskId !== task.taskId)
          .map(t => t.taskId)
          .join(', ');
        console.log(`  Matched with task(s): ${matchedTasks}`);
        if (matching.isCircular) {
          console.log('  This is part of a circular swap!');
        }
      }
    }

    // Compute transfer and swap balances
    for (const matching of result.matchings) {
      if (matching.isCircular) {
        // For circular matches, compute transfer balances once
        const circularTasks = matching.tasks;
        for (let i = 0; i < circularTasks.length; i++) {
          const task = circularTasks[i];
          const nextTask = circularTasks[(i + 1) % circularTasks.length];
          
          // Add transfer balance for current task's output to next task
          result.transferBalances.push({
            amount: task.poolOutputAmount!,
            currency: task.zeroForOne ? task.poolKey.currency1 : task.poolKey.currency0,
            sender: nextTask.sender
          });
        }
      } else {
        // For AMM matches, handle normally
        const task = matching.tasks[0];
        result.transferBalances.push({
          amount: Mathb.abs(task.amountSpecified),
          currency: task.zeroForOne ? task.poolKey.currency0 : task.poolKey.currency1,
          sender: task.sender
        });
        result.swapBalances.push({
          amountSpecified: task.amountSpecified,
          zeroForOne: task.zeroForOne,
          sqrtPriceLimitX96: task.sqrtPriceLimitX96
        });
      }
    }

    console.log("Transfer balances:", result.transferBalances);
    console.log("Swap balances:", result.swapBalances);

    // Get message hash and sign
    const messageHash = await serviceManager.read.getMessageHash([
      tasks[0].poolId,  // Use first task's poolId consistently
      result.transferBalances,
      result.swapBalances,
    ]);

    // Sign the message hash directly without prefixing, matching the MVP approach
    const signature = await walletClient.signTypedData({
      account,
      domain: {},
      types: {
        Message: [{ name: 'hash', type: 'bytes32' }]
      },
      primaryType: 'Message',
      message: {
        hash: messageHash
      }
    });

    console.log("Message hash:", messageHash);
    console.log("Sending response with signature:", signature);

    // Fix: Send the response with the correct task format
    const tx = await serviceManager.write.respondToBatch([
      tasks.map(task => ({
        taskId: Number(task.taskId), // Convert bigint to number
        zeroForOne: task.zeroForOne,
        amountSpecified: task.amountSpecified,
        sqrtPriceLimitX96: task.sqrtPriceLimitX96,
        sender: task.sender as `0x${string}`,
        poolId: task.poolId as `0x${string}`,
        taskCreatedBlock: task.taskCreatedBlock,
      })),
      tasks.map(task => Number(task.taskId)), // Convert bigint to number
      result.transferBalances.map(tb => ({
        amount: tb.amount,
        currency: tb.currency as `0x${string}`,
        sender: tb.sender as `0x${string}`,
      })),
      result.swapBalances,
      signature,
    ]);

    await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

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
