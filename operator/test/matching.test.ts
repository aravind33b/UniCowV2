import { describe, it, expect } from 'vitest';
import { generateTaskCombinations, isCombinationPossible, computePossibleResult, computeBalances } from '../matching';
import { Task, Feasibility } from '../utils';

describe('Circular CoW Matching', () => {
  it('should identify and match circular trades', () => {
    // Create test tasks for ETH→USDC→DAI→ETH
    const tasks: Task[] = [
      {
        taskId: 0,
        zeroForOne: true,
        amountSpecified: BigInt(-1e18), // 1 ETH
        sqrtPriceLimitX96: BigInt(0),
        sender: '0x1234',
        poolId: '0x0',
        taskCreatedBlock: 0,
        poolKey: {
          currency0: '0xETH',
          currency1: '0xUSDC',
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0'
        },
        poolInputAmount: BigInt(1e18), // 1 ETH
        poolOutputAmount: BigInt(2950e6), // 2950 USDC (AMM price)
        extraData: "0x",
        acceptedPools: [{
          currency0: '0xETH',
          currency1: '0xUSDC',
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0'
        }]
      },
      {
        taskId: 1,
        zeroForOne: true,
        amountSpecified: BigInt(-3000e6), // 3000 USDC
        sqrtPriceLimitX96: BigInt(0),
        sender: '0x5678',
        poolId: '0x1',
        taskCreatedBlock: 0,
        poolKey: {
          currency0: '0xUSDC',
          currency1: '0xDAI',
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0'
        },
        poolInputAmount: BigInt(3000e6), // 3000 USDC
        poolOutputAmount: BigInt(2950e18), // 2950 DAI (AMM price)
        extraData: "0x",
        acceptedPools: [{
          currency0: '0xUSDC',
          currency1: '0xDAI',
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0'
        }]
      },
      {
        taskId: 2,
        zeroForOne: true,
        amountSpecified: BigInt(-3000e18), // 3000 DAI
        sqrtPriceLimitX96: BigInt(0),
        sender: '0x9012',
        poolId: '0x2',
        taskCreatedBlock: 0,
        poolKey: {
          currency0: '0xDAI',
          currency1: '0xETH',
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0'
        },
        poolInputAmount: BigInt(3000e18), // 3000 DAI
        poolOutputAmount: BigInt(0.95e18), // 0.95 ETH (AMM price)
        extraData: "0x",
        acceptedPools: [{
          currency0: '0xDAI',
          currency1: '0xETH',
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0'
        }]
      }
    ];

    // Test generateTaskCombinations
    const combinations = generateTaskCombinations(tasks);
    expect(combinations.length).toBeGreaterThan(0);

    // Find the circular combination
    const circularCombination = combinations.find(comb => 
      comb.length === 1 && comb[0].length === 3 &&
      comb[0][0].poolKey.currency0 === '0xETH' &&
      comb[0][1].poolKey.currency0 === '0xUSDC' &&
      comb[0][2].poolKey.currency0 === '0xDAI'
    );
    expect(circularCombination).toBeDefined();

    // Test isCombinationPossible
    expect(isCombinationPossible([circularCombination![0]])).toBe(true);

    // Test computePossibleResult
    const result = computePossibleResult([circularCombination![0]], BigInt(1e18));
    expect(result.feasible).toBe(true);
    expect(result.matchings[0].feasibility).toBe(Feasibility.CIRCULAR);

    // Test computeBalances
    const balances = computeBalances(result);
    expect(balances.transferBalances.length).toBe(3);
    expect(balances.swapBalances.length).toBe(0);
  });
}); 