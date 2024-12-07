import * as dotenv from "dotenv";
dotenv.config();

import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  keccak256,
  encodePacked,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil, holesky } from "viem/chains";
import { AvsDirectoryABI } from "./abis/AvsDirectory";
import { DelegationManagerABI } from "./abis/DelegationManager";
import { HookABI } from "./abis/Hook";
import { QuoterABI } from "./abis/Quoter";
import { ServiceManagerABI } from "./abis/ServiceManager";
import { StakeRegistryABI } from "./abis/StakeRegistry";
import { deploymentAddresses } from "./deployment_addresses";
import { PoolManagerABI } from "./abis/PoolManager";
import bigDecimal from "js-big-decimal";

export type PoolPriceInfo = {
  poolKey: PoolKey;
  spotPrice: number;
  liquidity: bigint;
};

export type Task = {
  // Existing fields
  zeroForOne: boolean;
  amountSpecified: bigint;
  sqrtPriceLimitX96: bigint;
  sender: `0x${string}`;
  poolId: `0x${string}`;  // This becomes the preferred pool's ID
  poolKey: PoolKey;       // This becomes the preferred pool's key
  taskCreatedBlock: number;
  taskId: number;
  poolOutputAmount: bigint | null;
  poolInputAmount: bigint | null;
  extraData: `0x${string}`;  // Hook data

  // New fields
  acceptedPools: PoolKey[];     // List of pools this task can trade in
  poolPrices?: PoolPriceInfo[]; // Price info for each pool (optional, filled by operator)
};

export enum Feasibility {
  NONE = "NONE",
  AMM = "AMM",
  CIRCULAR = "CIRCULAR"
}

export type PossibleResult = {
  matchings: Matching[];
  feasible: boolean;
  transferBalances: TransferBalance[];
  swapBalances: SwapBalance[];
};

export type Matching = {
  tasks: Task[];
  feasibility: Feasibility;
  isCircular?: boolean;
};

export type PoolKey = {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
};

export const account = privateKeyToAccount(
  process.env.PRIVATE_KEY! as `0x${string}`
);

export const walletClient = createWalletClient({
  chain: process.env.IS_DEV === "true" ? anvil : holesky,
  transport: http(),
  account,
  pollingInterval: 2000,
});

export const publicClient = createPublicClient({
  chain: process.env.IS_DEV === "true" ? anvil : holesky,
  transport: http(),
  pollingInterval: 2000,
});

export const delegationManager = getContract({
  address: deploymentAddresses.eigenlayer.delegation,
  abi: DelegationManagerABI,
  client: { public: publicClient, wallet: walletClient },
});

export const registryContract = getContract({
  address: deploymentAddresses.avs.stakeRegistryProxy,
  abi: StakeRegistryABI,
  client: { public: publicClient, wallet: walletClient },
});

export const avsDirectory = getContract({
  address: deploymentAddresses.eigenlayer.avsDirectory,
  abi: AvsDirectoryABI,
  client: { public: publicClient, wallet: walletClient },
});

export const serviceManager = getContract({
  address: deploymentAddresses.avs.serviceManagerProxy,
  abi: ServiceManagerABI,
  client: { public: publicClient, wallet: walletClient },
});

export const quoterContract = getContract({
  address: deploymentAddresses.hook.quoter,
  abi: QuoterABI,
  client: { public: publicClient, wallet: walletClient },
});

export const hook = getContract({
  address: deploymentAddresses.hook.hook,
  abi: HookABI,
  client: { public: publicClient, wallet: walletClient },
});

export const poolManager = getContract({
  address: deploymentAddresses.hook.poolManager,
  abi: PoolManagerABI,
  client: { public: publicClient, wallet: walletClient },
});

// Helper to calculate pool ID from key (pure function, matches Solidity implementation)
export function calculatePoolId(key: PoolKey): `0x${string}` {
  return keccak256(
    encodePacked(
      ["address", "address", "uint24", "int24", "address"],
      [key.currency0, key.currency1, key.fee, key.tickSpacing, key.hooks]
    )
  );
}

// Helper to get slot0 data using extsload
export async function getSlot0Data(poolManager: any, poolId: `0x${string}`): Promise<[bigint, number]> {
  // Calculate the slot for Pool.State (matches Solidity implementation)
  const stateSlot = keccak256(encodePacked(["bytes32", "uint256"], [poolId, BigInt(0)]));
  
  // Read the slot data
  const data = await poolManager.read.extsload([stateSlot]);
  
  // Decode the data (matches Solidity StateLibrary implementation)
  const sqrtPriceX96 = BigInt(data) >> BigInt(96);
  const tick = Number((BigInt(data) >> BigInt(160)) & ((BigInt(1) << BigInt(24)) - BigInt(1)));
  
  return [sqrtPriceX96, tick];
}

// Helper to get liquidity using extsload
export async function getPoolLiquidity(poolManager: any, poolId: `0x${string}`): Promise<bigint> {
  // Calculate the slot for Pool.State (matches Solidity implementation)
  const stateSlot = keccak256(encodePacked(["bytes32", "uint256"], [poolId, BigInt(0)]));
  
  // Calculate liquidity slot with offset (matches Solidity StateLibrary implementation)
  const LIQUIDITY_OFFSET = BigInt(4);
  const liquiditySlot = BigInt(stateSlot) + LIQUIDITY_OFFSET;
  
  // Convert liquiditySlot to hex string with 0x prefix
  const liquiditySlotHex = `0x${liquiditySlot.toString(16).padStart(64, '0')}` as `0x${string}`;
  
  // Read the slot data
  const data = await poolManager.read.extsload([liquiditySlotHex]);
  
  // Decode the data (matches Solidity StateLibrary implementation)
  return BigInt(data);
}

export type TransferBalance = {
  amount: bigint;
  currency: `0x${string}`;
  sender: `0x${string}`;
};

export type SwapBalance = {
  amountSpecified: bigint;
  zeroForOne: boolean;
  sqrtPriceLimitX96: bigint;
};

// Helper to encode pool keys into bytes
export function encodePoolKeys(pools: PoolKey[]): Uint8Array {
  // Convert pool data to bytes
  const bytes = new Uint8Array(pools.length * 108); // 20 + 20 + 4 + 4 + 20 bytes per pool
  let offset = 0;

  pools.forEach(pool => {
    // Convert addresses to bytes (20 bytes each)
    const currency0Bytes = hexToBytes(pool.currency0.slice(2));
    const currency1Bytes = hexToBytes(pool.currency1.slice(2));
    const hooksBytes = hexToBytes(pool.hooks.slice(2));
    
    // Convert numbers to bytes (4 bytes each)
    const feeBytes = numberToBytes(pool.fee);
    const tickSpacingBytes = numberToBytes(pool.tickSpacing);
    
    // Copy all bytes into the result array
    bytes.set(currency0Bytes, offset);
    bytes.set(currency1Bytes, offset + 20);
    bytes.set(feeBytes, offset + 40);
    bytes.set(tickSpacingBytes, offset + 44);
    bytes.set(hooksBytes, offset + 48);
    
    offset += 68;
  });

  return bytes;
}

// Helper to convert hex string to bytes
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

// Helper to convert number to bytes
function numberToBytes(num: number): Uint8Array {
  const bytes = new Uint8Array(4);
  bytes[0] = (num >> 24) & 0xFF;
  bytes[1] = (num >> 16) & 0xFF;
  bytes[2] = (num >> 8) & 0xFF;
  bytes[3] = num & 0xFF;
  return bytes;
}
