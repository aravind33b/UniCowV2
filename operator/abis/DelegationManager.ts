export const DelegationManagerABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_strategyManager",
        type: "address",
        internalType: "contract IStrategyManager",
      },
      {
        name: "_slasher",
        type: "address",
        internalType: "contract ISlasher",
      },
      {
        name: "_eigenPodManager",
        type: "address",
        internalType: "contract IEigenPodManager",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DELEGATION_APPROVAL_TYPEHASH",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DOMAIN_TYPEHASH",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_STAKER_OPT_OUT_WINDOW_BLOCKS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_WITHDRAWAL_DELAY_BLOCKS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "STAKER_DELEGATION_TYPEHASH",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "beaconChainETHStrategy",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IStrategy" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateCurrentStakerDelegationDigestHash",
    inputs: [
      { name: "staker", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
      { name: "expiry", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateDelegationApprovalDigestHash",
    inputs: [
      { name: "staker", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
      {
        name: "_delegationApprover",
        type: "address",
        internalType: "address",
      },
      { name: "approverSalt", type: "bytes32", internalType: "bytes32" },
      { name: "expiry", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateStakerDelegationDigestHash",
    inputs: [
      { name: "staker", type: "address", internalType: "address" },
      { name: "_stakerNonce", type: "uint256", internalType: "uint256" },
      { name: "operator", type: "address", internalType: "address" },
      { name: "expiry", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateWithdrawalRoot",
    inputs: [
      {
        name: "withdrawal",
        type: "tuple",
        internalType: "struct IDelegationManager.Withdrawal",
        components: [
          { name: "staker", type: "address", internalType: "address" },
          {
            name: "delegatedTo",
            type: "address",
            internalType: "address",
          },
          {
            name: "withdrawer",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "startBlock", type: "uint32", internalType: "uint32" },
          {
            name: "strategies",
            type: "address[]",
            internalType: "contract IStrategy[]",
          },
          { name: "shares", type: "uint256[]", internalType: "uint256[]" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "completeQueuedWithdrawal",
    inputs: [
      {
        name: "withdrawal",
        type: "tuple",
        internalType: "struct IDelegationManager.Withdrawal",
        components: [
          { name: "staker", type: "address", internalType: "address" },
          {
            name: "delegatedTo",
            type: "address",
            internalType: "address",
          },
          {
            name: "withdrawer",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "startBlock", type: "uint32", internalType: "uint32" },
          {
            name: "strategies",
            type: "address[]",
            internalType: "contract IStrategy[]",
          },
          { name: "shares", type: "uint256[]", internalType: "uint256[]" },
        ],
      },
      {
        name: "tokens",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      {
        name: "middlewareTimesIndex",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "receiveAsTokens", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "completeQueuedWithdrawals",
    inputs: [
      {
        name: "withdrawals",
        type: "tuple[]",
        internalType: "struct IDelegationManager.Withdrawal[]",
        components: [
          { name: "staker", type: "address", internalType: "address" },
          {
            name: "delegatedTo",
            type: "address",
            internalType: "address",
          },
          {
            name: "withdrawer",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "startBlock", type: "uint32", internalType: "uint32" },
          {
            name: "strategies",
            type: "address[]",
            internalType: "contract IStrategy[]",
          },
          { name: "shares", type: "uint256[]", internalType: "uint256[]" },
        ],
      },
      {
        name: "tokens",
        type: "address[][]",
        internalType: "contract IERC20[][]",
      },
      {
        name: "middlewareTimesIndexes",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      { name: "receiveAsTokens", type: "bool[]", internalType: "bool[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cumulativeWithdrawalsQueued",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decreaseDelegatedShares",
    inputs: [
      { name: "staker", type: "address", internalType: "address" },
      {
        name: "strategy",
        type: "address",
        internalType: "contract IStrategy",
      },
      { name: "shares", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "delegateTo",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      {
        name: "approverSignatureAndExpiry",
        type: "tuple",
        internalType: "struct ISignatureUtils.SignatureWithExpiry",
        components: [
          { name: "signature", type: "bytes", internalType: "bytes" },
          { name: "expiry", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "approverSalt", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "delegateToBySignature",
    inputs: [
      { name: "staker", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
      {
        name: "stakerSignatureAndExpiry",
        type: "tuple",
        internalType: "struct ISignatureUtils.SignatureWithExpiry",
        components: [
          { name: "signature", type: "bytes", internalType: "bytes" },
          { name: "expiry", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "approverSignatureAndExpiry",
        type: "tuple",
        internalType: "struct ISignatureUtils.SignatureWithExpiry",
        components: [
          { name: "signature", type: "bytes", internalType: "bytes" },
          { name: "expiry", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "approverSalt", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "delegatedTo",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "delegationApprover",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "delegationApproverSaltIsSpent",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "domainSeparator",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "eigenPodManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IEigenPodManager",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDelegatableShares",
    inputs: [{ name: "staker", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "contract IStrategy[]",
      },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOperatorShares",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      {
        name: "strategies",
        type: "address[]",
        internalType: "contract IStrategy[]",
      },
    ],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWithdrawalDelay",
    inputs: [
      {
        name: "strategies",
        type: "address[]",
        internalType: "contract IStrategy[]",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "increaseDelegatedShares",
    inputs: [
      { name: "staker", type: "address", internalType: "address" },
      {
        name: "strategy",
        type: "address",
        internalType: "contract IStrategy",
      },
      { name: "shares", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "initialOwner", type: "address", internalType: "address" },
      {
        name: "_pauserRegistry",
        type: "address",
        internalType: "contract IPauserRegistry",
      },
      {
        name: "initialPausedStatus",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_minWithdrawalDelayBlocks",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_strategies",
        type: "address[]",
        internalType: "contract IStrategy[]",
      },
      {
        name: "_withdrawalDelayBlocks",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isDelegated",
    inputs: [{ name: "staker", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isOperator",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minWithdrawalDelayBlocks",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "modifyOperatorDetails",
    inputs: [
      {
        name: "newOperatorDetails",
        type: "tuple",
        internalType: "struct IDelegationManager.OperatorDetails",
        components: [
          {
            name: "__deprecated_earningsReceiver",
            type: "address",
            internalType: "address",
          },
          {
            name: "delegationApprover",
            type: "address",
            internalType: "address",
          },
          {
            name: "stakerOptOutWindowBlocks",
            type: "uint32",
            internalType: "uint32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "operatorDetails",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IDelegationManager.OperatorDetails",
        components: [
          {
            name: "__deprecated_earningsReceiver",
            type: "address",
            internalType: "address",
          },
          {
            name: "delegationApprover",
            type: "address",
            internalType: "address",
          },
          {
            name: "stakerOptOutWindowBlocks",
            type: "uint32",
            internalType: "uint32",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "operatorShares",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "contract IStrategy" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
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
    name: "pendingWithdrawals",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "queueWithdrawals",
    inputs: [
      {
        name: "queuedWithdrawalParams",
        type: "tuple[]",
        internalType: "struct IDelegationManager.QueuedWithdrawalParams[]",
        components: [
          {
            name: "strategies",
            type: "address[]",
            internalType: "contract IStrategy[]",
          },
          {
            name: "shares",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          { name: "withdrawer", type: "address", internalType: "address" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes32[]", internalType: "bytes32[]" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registerAsOperator",
    inputs: [
      {
        name: "registeringOperatorDetails",
        type: "tuple",
        internalType: "struct IDelegationManager.OperatorDetails",
        components: [
          {
            name: "__deprecated_earningsReceiver",
            type: "address",
            internalType: "address",
          },
          {
            name: "delegationApprover",
            type: "address",
            internalType: "address",
          },
          {
            name: "stakerOptOutWindowBlocks",
            type: "uint32",
            internalType: "uint32",
          },
        ],
      },
      { name: "metadataURI", type: "string", internalType: "string" },
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
    name: "setMinWithdrawalDelayBlocks",
    inputs: [
      {
        name: "newMinWithdrawalDelayBlocks",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "setStrategyWithdrawalDelayBlocks",
    inputs: [
      {
        name: "strategies",
        type: "address[]",
        internalType: "contract IStrategy[]",
      },
      {
        name: "withdrawalDelayBlocks",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "slasher",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract ISlasher" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "stakerNonce",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "stakerOptOutWindowBlocks",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "strategyManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IStrategyManager",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "strategyWithdrawalDelayBlocks",
    inputs: [{ name: "", type: "address", internalType: "contract IStrategy" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
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
    name: "undelegate",
    inputs: [{ name: "staker", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "withdrawalRoots",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
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
    name: "updateOperatorMetadataURI",
    inputs: [{ name: "metadataURI", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "MinWithdrawalDelayBlocksSet",
    inputs: [
      {
        name: "previousValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorDetailsModified",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOperatorDetails",
        type: "tuple",
        indexed: false,
        internalType: "struct IDelegationManager.OperatorDetails",
        components: [
          {
            name: "__deprecated_earningsReceiver",
            type: "address",
            internalType: "address",
          },
          {
            name: "delegationApprover",
            type: "address",
            internalType: "address",
          },
          {
            name: "stakerOptOutWindowBlocks",
            type: "uint32",
            internalType: "uint32",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorMetadataURIUpdated",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "metadataURI",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorRegistered",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operatorDetails",
        type: "tuple",
        indexed: false,
        internalType: "struct IDelegationManager.OperatorDetails",
        components: [
          {
            name: "__deprecated_earningsReceiver",
            type: "address",
            internalType: "address",
          },
          {
            name: "delegationApprover",
            type: "address",
            internalType: "address",
          },
          {
            name: "stakerOptOutWindowBlocks",
            type: "uint32",
            internalType: "uint32",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorSharesDecreased",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "staker",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "strategy",
        type: "address",
        indexed: false,
        internalType: "contract IStrategy",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorSharesIncreased",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "staker",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "strategy",
        type: "address",
        indexed: false,
        internalType: "contract IStrategy",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
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
    name: "StakerDelegated",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StakerForceUndelegated",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StakerUndelegated",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StrategyWithdrawalDelayBlocksSet",
    inputs: [
      {
        name: "strategy",
        type: "address",
        indexed: false,
        internalType: "contract IStrategy",
      },
      {
        name: "previousValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
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
  {
    type: "event",
    name: "WithdrawalCompleted",
    inputs: [
      {
        name: "withdrawalRoot",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WithdrawalQueued",
    inputs: [
      {
        name: "withdrawalRoot",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "withdrawal",
        type: "tuple",
        indexed: false,
        internalType: "struct IDelegationManager.Withdrawal",
        components: [
          { name: "staker", type: "address", internalType: "address" },
          {
            name: "delegatedTo",
            type: "address",
            internalType: "address",
          },
          {
            name: "withdrawer",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "startBlock", type: "uint32", internalType: "uint32" },
          {
            name: "strategies",
            type: "address[]",
            internalType: "contract IStrategy[]",
          },
          { name: "shares", type: "uint256[]", internalType: "uint256[]" },
        ],
      },
    ],
    anonymous: false,
  },
] as const;
