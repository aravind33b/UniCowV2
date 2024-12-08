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
  pool01: {
    currency0: deploymentAddresses.hook.token0,
    currency1: deploymentAddresses.hook.token1,
    fee: 3000,
    tickSpacing: 120,
    hooks: deploymentAddresses.hook.hook,
  },
  pool12: {
    currency0: deploymentAddresses.hook.token1,
    currency1: deploymentAddresses.hook.token2,
    fee: 3000,
    tickSpacing: 120,
    hooks: deploymentAddresses.hook.hook,
  },
  pool02: {
    currency0: deploymentAddresses.hook.token0,
    currency1: deploymentAddresses.hook.token2,
    fee: 3000,
    tickSpacing: 120,
    hooks: deploymentAddresses.hook.hook,
  },
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
      amountSpecified: -parseEther("1"), // Sell 1 token0 for token1
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: false,
      amountSpecified: -parseEther("1"), // Sell 1 token1 for token0
      sqrtPriceLimitX96: BigInt("162369000000000000000000000000"),
    }
  ],

  // Scenario 2: Circular CoW (3 tasks that form a circle)
  circularCow: [
    {
      zeroForOne: true,
      amountSpecified: -parseEther("1"),
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: true,
      amountSpecified: -parseEther("1"),
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    },
    {
      zeroForOne: false,
      amountSpecified: -parseEther("1"),
      sqrtPriceLimitX96: BigInt("152398000000000000000000000000"),
    }
  ],
} as const;

async function createTask(numTasks: number, scenario: keyof typeof TEST_SCENARIOS = "cowMatch") {
  console.log(`Creating ${numTasks} tasks for scenario: ${scenario}`);
  
  const swapParams = TEST_SCENARIOS[scenario];
  const pools = [POOL_CONFIGS.pool01, POOL_CONFIGS.pool12, POOL_CONFIGS.pool02];

  // Create each task in sequence
  for (let i = 0; i < numTasks && i < swapParams.length; i++) {
    console.log(`Creating task ${i + 1}`);
    
    const poolConfigs = [POOL_CONFIGS.pool01, POOL_CONFIGS.pool12, POOL_CONFIGS.pool02];
    const pool = poolConfigs[i];
    
    const txHash = await swapRouter.write.swap([
      pool,
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
