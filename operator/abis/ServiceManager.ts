export const ServiceManagerABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_avsDirectory",
        type: "address",
        internalType: "address",
      },
      {
        name: "_stakeRegistry",
        type: "address",
        internalType: "address",
      },
      {
        name: "_delegationManager",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allTaskHashes",
    inputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allTaskResponses",
    inputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "avsDirectory",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createAVSRewardsSubmission",
    inputs: [
      {
        name: "rewardsSubmissions",
        type: "tuple[]",
        internalType: "struct IRewardsCoordinator.RewardsSubmission[]",
        components: [
          {
            name: "strategiesAndMultipliers",
            type: "tuple[]",
            internalType: "struct IRewardsCoordinator.StrategyAndMultiplier[]",
            components: [
              {
                name: "strategy",
                type: "address",
                internalType: "contract IStrategy",
              },
              {
                name: "multiplier",
                type: "uint96",
                internalType: "uint96",
              },
            ],
          },
          {
            name: "token",
            type: "address",
            internalType: "contract IERC20",
          },
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "startTimestamp",
            type: "uint32",
            internalType: "uint32",
          },
          { name: "duration", type: "uint32", internalType: "uint32" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createNewTask",
    inputs: [
      { name: "zeroForOne", type: "bool", internalType: "bool" },
      {
        name: "amountSpecified",
        type: "int256",
        internalType: "int256",
      },
      {
        name: "sqrtPriceLimitX96",
        type: "uint160",
        internalType: "uint160",
      },
      { name: "sender", type: "address", internalType: "address" },
      { name: "poolId", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deregisterOperatorFromAVS",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMessageHash",
    inputs: [
      { name: "poolId", type: "bytes32", internalType: "bytes32" },
      {
        name: "transferBalances",
        type: "tuple[]",
        internalType: "struct IUniCowHook.TransferBalance[]",
        components: [
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "currency",
            type: "address",
            internalType: "address",
          },
          { name: "sender", type: "address", internalType: "address" },
        ],
      },
      {
        name: "swapBalances",
        type: "tuple[]",
        internalType: "struct IUniCowHook.SwapBalance[]",
        components: [
          {
            name: "amountSpecified",
            type: "int256",
            internalType: "int256",
          },
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getOperatorRestakedStrategies",
    inputs: [{ name: "_operator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRestakeableStrategies",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hook",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "latestTaskNum",
    inputs: [],
    outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "operatorHasMinimumWeight",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [
      {
        name: "newPausedStatus",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pauseAll",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "paused",
    inputs: [{ name: "index", type: "uint8", internalType: "uint8" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pauserRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IPauserRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerOperatorToAVS",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      {
        name: "operatorSignature",
        type: "tuple",
        internalType: "struct ISignatureUtils.SignatureWithSaltAndExpiry",
        components: [
          { name: "signature", type: "bytes", internalType: "bytes" },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
          { name: "expiry", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "respondToBatch",
    inputs: [
      {
        name: "tasks",
        type: "tuple[]",
        internalType: "struct UniCowServiceManager.Task[]",
        components: [
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "amountSpecified",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
          { name: "sender", type: "address", internalType: "address" },
          { name: "poolId", type: "bytes32", internalType: "bytes32" },
          {
            name: "taskCreatedBlock",
            type: "uint32",
            internalType: "uint32",
          },
          { name: "taskId", type: "uint32", internalType: "uint32" },
        ],
      },
      {
        name: "referenceTaskIndices",
        type: "uint32[]",
        internalType: "uint32[]",
      },
      {
        name: "transferBalances",
        type: "tuple[]",
        internalType: "struct IUniCowHook.TransferBalance[]",
        components: [
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "currency",
            type: "address",
            internalType: "address",
          },
          { name: "sender", type: "address", internalType: "address" },
        ],
      },
      {
        name: "swapBalances",
        type: "tuple[]",
        internalType: "struct IUniCowHook.SwapBalance[]",
        components: [
          {
            name: "amountSpecified",
            type: "int256",
            internalType: "int256",
          },
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rewardsInitiator",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setHook",
    inputs: [{ name: "_hook", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPauserRegistry",
    inputs: [
      {
        name: "newPauserRegistry",
        type: "address",
        internalType: "contract IPauserRegistry",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setRewardsInitiator",
    inputs: [
      {
        name: "newRewardsInitiator",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "stakeRegistry",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [
      {
        name: "newPausedStatus",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateAVSMetadataURI",
    inputs: [{ name: "_metadataURI", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BatchResponse",
    inputs: [
      {
        name: "referenceTaskIndices",
        type: "uint32[]",
        indexed: true,
        internalType: "uint32[]",
      },
      {
        name: "sender",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NewTaskCreated",
    inputs: [
      {
        name: "taskIndex",
        type: "uint32",
        indexed: true,
        internalType: "uint32",
      },
      {
        name: "task",
        type: "tuple",
        indexed: false,
        internalType: "struct UniCowServiceManager.Task",
        components: [
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "amountSpecified",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
          { name: "sender", type: "address", internalType: "address" },
          { name: "poolId", type: "bytes32", internalType: "bytes32" },
          {
            name: "taskCreatedBlock",
            type: "uint32",
            internalType: "uint32",
          },
          { name: "taskId", type: "uint32", internalType: "uint32" },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Paused",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newPausedStatus",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PauserRegistrySet",
    inputs: [
      {
        name: "pauserRegistry",
        type: "address",
        indexed: false,
        internalType: "contract IPauserRegistry",
      },
      {
        name: "newPauserRegistry",
        type: "address",
        indexed: false,
        internalType: "contract IPauserRegistry",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardsInitiatorUpdated",
    inputs: [
      {
        name: "prevRewardsInitiator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newRewardsInitiator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unpaused",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newPausedStatus",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;
