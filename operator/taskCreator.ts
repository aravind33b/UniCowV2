import * as dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  getContract,
  http,
  parseAbiParameters,
  toHex,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil, holesky } from "viem/chains";
import { SwapRouterABI } from "./abis/SwapRouter";
import { waitForTransactionReceipt } from "viem/actions";
import { deploymentAddresses } from "./deployment_addresses";
import { PoolKey, encodePoolKeys } from "./utils";
dotenv.config();

// Add pool configurations
const POOL_CONFIGS = {
  defaultPool: {
    currency0: deploymentAddresses.hook.token0,
    currency1: deploymentAddresses.hook.token1,
    fee: 3000,
    tickSpacing: 120,
    hooks: deploymentAddresses.hook.hook,
  } as const,
  // For demo, using same tokens but different fee tier
  alternatePool: {
    currency0: deploymentAddresses.hook.token0,
    currency1: deploymentAddresses.hook.token1,
    fee: 500,  // Different fee tier
    tickSpacing: 120,
    hooks: deploymentAddresses.hook.hook,
  } as const,
} as const;

type PoolConfig = typeof POOL_CONFIGS[keyof typeof POOL_CONFIGS];

const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);

const walletClient = createWalletClient({
  chain: process.env.IS_DEV === "true" ? anvil : holesky,
  transport: http(),
  account,
});

const publicClient = createPublicClient({
  chain: process.env.IS_DEV === "true" ? anvil : holesky,
  transport: http(),
});

const swapRouter = getContract({
  address: deploymentAddresses.hook.swapRouter,
  abi: SwapRouterABI,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

// Different test scenarios
const TEST_SCENARIOS = {
  // Scenario 1: Simple CoW match (2 tasks that can match)
  cowMatch: [
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // Sell 10 token0 for token1
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: false,
      amountSpecified: -parseEther("40"), // Sell 40 token1 for token0
      sqrtPriceLimitX96: BigInt("162369000000000000000000000000"),
    }
  ],

  // Scenario 2: Circular CoW (3 tasks that form a circle)
  circularCow: [
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // A sells 10 token0
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: false,
      amountSpecified: -parseEther("40"), // B sells 40 token1
      sqrtPriceLimitX96: BigInt("162369000000000000000000000000"),
    },
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // C sells 10 token0
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    }
  ],

  // Scenario 3: AMM Fallback (tasks that can't be matched)
  ammFallback: [
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // Both selling token0
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // Both selling token0
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    }
  ],

  // Scenario 4: Mixed (some CoW, some AMM)
  mixed: [
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // Can match with task 2
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: false,
      amountSpecified: -parseEther("40"), // Can match with task 1
      sqrtPriceLimitX96: BigInt("162369000000000000000000000000"),
    },
    {
      zeroForOne: true,
      amountSpecified: -parseEther("10"), // No match, goes to AMM
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    }
  ]
};

async function createTask(numTasks: number, scenario: keyof typeof TEST_SCENARIOS = "cowMatch") {
  console.log(`Creating ${numTasks} tasks for scenario: ${scenario}`);
  
  const swapParams = TEST_SCENARIOS[scenario];
  const pools = [POOL_CONFIGS.defaultPool];

  // Create each task in sequence
  for (let i = 0; i < numTasks && i < swapParams.length; i++) {
    console.log(`Creating task ${i + 1} (${swapParams[i].zeroForOne ? 'Selling token0' : 'Selling token1'})`);
    
    const txHash = await swapRouter.write.swap([
      POOL_CONFIGS.defaultPool,
      swapParams[i],
      {
        takeClaims: false,
        settleUsingBurn: false,
      },
      encodeAbiParameters(
        parseAbiParameters("int8,address,uint8,bytes"), [
          1,  // Enable CoW
          account.address,
          pools.length,
          toHex(encodePoolKeys(pools)),
        ]
      ),
    ]);

    await waitForTransactionReceipt(publicClient, {
      hash: txHash,
    });
    console.log("Task created:", txHash);
  }
}

// Export the main function and scenarios
export { createTask, TEST_SCENARIOS };

// If running directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  const numTasks = parseInt(args[0]) || 2;
  const scenario = (args[1] as keyof typeof TEST_SCENARIOS) || "cowMatch";
  
  if (!TEST_SCENARIOS[scenario]) {
    console.error(`Invalid scenario. Available scenarios: ${Object.keys(TEST_SCENARIOS).join(", ")}`);
    process.exit(1);
  }

  createTask(numTasks, scenario)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
