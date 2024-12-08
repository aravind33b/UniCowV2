// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockERC20} from "solmate/src/test/utils/mocks/MockERC20.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolSwapTest} from "v4-core/test/PoolSwapTest.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";

contract TestCircularSwap is Script {
    address constant TOKEN0 = 0x0E801D84Fa97b50751Dbf25036d067dCf18858bF;
    address constant TOKEN1 = 0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf;
    address constant TOKEN2 = 0x9d4454B023096f34B160D6B654540c56A1F81688;
    address constant SWAP_ROUTER = 0x4826533B4897376654Bb4d4AD88B7faFD0C98528;
    address constant HOOK = 0x3A011c647385343199cFe55d8D601722D0529088;

    // Known test private keys and their addresses
    address constant USER1 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // key: ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    address constant USER2 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // key: 59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
    address constant USER3 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // key: 5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

    function run() external {
        // Get token contracts
        MockERC20 token0 = MockERC20(TOKEN0);
        MockERC20 token1 = MockERC20(TOKEN1);
        MockERC20 token2 = MockERC20(TOKEN2);
        PoolSwapTest router = PoolSwapTest(SWAP_ROUTER);

        // Setup tokens
        vm.startBroadcast();
        token0.mint(USER1, 10 ether);
        token1.mint(USER2, 10 ether);
        token2.mint(USER3, 10 ether);
        vm.stopBroadcast();

        // Approve router for all users
        vm.startBroadcast(USER1);
        token0.approve(SWAP_ROUTER, type(uint256).max);
        vm.stopBroadcast();

        vm.startBroadcast(USER2);
        token1.approve(SWAP_ROUTER, type(uint256).max);
        vm.stopBroadcast();

        vm.startBroadcast(USER3);
        token2.approve(SWAP_ROUTER, type(uint256).max);
        vm.stopBroadcast();

        // Create pool keys
        PoolKey memory pool01 = PoolKey({
            currency0: Currency.wrap(TOKEN0),
            currency1: Currency.wrap(TOKEN1),
            fee: 3000,
            tickSpacing: 120,
            hooks: IHooks(HOOK)
        });

        PoolKey memory pool12 = PoolKey({
            currency0: Currency.wrap(TOKEN1),
            currency1: Currency.wrap(TOKEN2),
            fee: 3000,
            tickSpacing: 120,
            hooks: IHooks(HOOK)
        });

        PoolKey memory pool20 = PoolKey({
            currency0: Currency.wrap(TOKEN0),
            currency1: Currency.wrap(TOKEN2),
            fee: 3000,
            tickSpacing: 120,
            hooks: IHooks(HOOK)
        });

        console.log("=== Initial Balances ===");
        console.log("User1 Token0:", token0.balanceOf(USER1));
        console.log("User2 Token1:", token1.balanceOf(USER2));
        console.log("User3 Token2:", token2.balanceOf(USER3));

        // User1: token0 -> token1
        vm.startBroadcast(USER1);
        router.swap(
            pool01,
            IPoolManager.SwapParams({
                zeroForOne: true,
                amountSpecified: -1 ether,
                sqrtPriceLimitX96: 0
            }),
            PoolSwapTest.TestSettings({
                takeClaims: false,
                settleUsingBurn: false
            }),
            abi.encode(int8(1), USER1)
        );
        vm.stopBroadcast();

        // User2: token1 -> token2
        vm.startBroadcast(USER2);
        router.swap(
            pool12,
            IPoolManager.SwapParams({
                zeroForOne: true,
                amountSpecified: -1 ether,
                sqrtPriceLimitX96: 0
            }),
            PoolSwapTest.TestSettings({
                takeClaims: false,
                settleUsingBurn: false
            }),
            abi.encode(int8(1), USER2)
        );
        vm.stopBroadcast();

        // User3: token2 -> token0
        vm.startBroadcast(USER3);
        router.swap(
            pool20,
            IPoolManager.SwapParams({
                zeroForOne: false,
                amountSpecified: -1 ether,
                sqrtPriceLimitX96: type(uint160).max
            }),
            PoolSwapTest.TestSettings({
                takeClaims: false,
                settleUsingBurn: false
            }),
            abi.encode(int8(1), USER3)
        );
        vm.stopBroadcast();

        console.log("=== Final Balances ===");
        console.log("User1 Token0:", token0.balanceOf(USER1));
        console.log("User2 Token1:", token1.balanceOf(USER2));
        console.log("User3 Token2:", token2.balanceOf(USER3));
    }
} 