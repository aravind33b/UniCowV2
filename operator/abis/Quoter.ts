export const QuoterABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_poolManager",
        type: "address",
        internalType: "contract IPoolManager",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "_quoteExactInput",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactParams",
        components: [
          {
            name: "exactCurrency",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "path",
            type: "tuple[]",
            internalType: "struct PathKey[]",
            components: [
              {
                name: "intermediateCurrency",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
              { name: "hookData", type: "bytes", internalType: "bytes" },
            ],
          },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "_quoteExactInputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactSingleParams",
        components: [
          {
            name: "poolKey",
            type: "tuple",
            internalType: "struct PoolKey",
            components: [
              {
                name: "currency0",
                type: "address",
                internalType: "Currency",
              },
              {
                name: "currency1",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
            ],
          },
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
          { name: "hookData", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "_quoteExactOutput",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactParams",
        components: [
          {
            name: "exactCurrency",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "path",
            type: "tuple[]",
            internalType: "struct PathKey[]",
            components: [
              {
                name: "intermediateCurrency",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
              { name: "hookData", type: "bytes", internalType: "bytes" },
            ],
          },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "_quoteExactOutputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactSingleParams",
        components: [
          {
            name: "poolKey",
            type: "tuple",
            internalType: "struct PoolKey",
            components: [
              {
                name: "currency0",
                type: "address",
                internalType: "Currency",
              },
              {
                name: "currency1",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
            ],
          },
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
          { name: "hookData", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "poolManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IPoolManager",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "quoteExactInput",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactParams",
        components: [
          {
            name: "exactCurrency",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "path",
            type: "tuple[]",
            internalType: "struct PathKey[]",
            components: [
              {
                name: "intermediateCurrency",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
              { name: "hookData", type: "bytes", internalType: "bytes" },
            ],
          },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "deltaAmounts",
        type: "int128[]",
        internalType: "int128[]",
      },
      {
        name: "sqrtPriceX96AfterList",
        type: "uint160[]",
        internalType: "uint160[]",
      },
      {
        name: "initializedTicksLoadedList",
        type: "uint32[]",
        internalType: "uint32[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "quoteExactInputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactSingleParams",
        components: [
          {
            name: "poolKey",
            type: "tuple",
            internalType: "struct PoolKey",
            components: [
              {
                name: "currency0",
                type: "address",
                internalType: "Currency",
              },
              {
                name: "currency1",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
            ],
          },
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
          { name: "hookData", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [
      {
        name: "deltaAmounts",
        type: "int128[]",
        internalType: "int128[]",
      },
      {
        name: "sqrtPriceX96After",
        type: "uint160",
        internalType: "uint160",
      },
      {
        name: "initializedTicksLoaded",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "quoteExactOutput",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactParams",
        components: [
          {
            name: "exactCurrency",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "path",
            type: "tuple[]",
            internalType: "struct PathKey[]",
            components: [
              {
                name: "intermediateCurrency",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
              { name: "hookData", type: "bytes", internalType: "bytes" },
            ],
          },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "deltaAmounts",
        type: "int128[]",
        internalType: "int128[]",
      },
      {
        name: "sqrtPriceX96AfterList",
        type: "uint160[]",
        internalType: "uint160[]",
      },
      {
        name: "initializedTicksLoadedList",
        type: "uint32[]",
        internalType: "uint32[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "quoteExactOutputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoter.QuoteExactSingleParams",
        components: [
          {
            name: "poolKey",
            type: "tuple",
            internalType: "struct PoolKey",
            components: [
              {
                name: "currency0",
                type: "address",
                internalType: "Currency",
              },
              {
                name: "currency1",
                type: "address",
                internalType: "Currency",
              },
              { name: "fee", type: "uint24", internalType: "uint24" },
              {
                name: "tickSpacing",
                type: "int24",
                internalType: "int24",
              },
              {
                name: "hooks",
                type: "address",
                internalType: "contract IHooks",
              },
            ],
          },
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "exactAmount",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
          { name: "hookData", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [
      {
        name: "deltaAmounts",
        type: "int128[]",
        internalType: "int128[]",
      },
      {
        name: "sqrtPriceX96After",
        type: "uint160",
        internalType: "uint160",
      },
      {
        name: "initializedTicksLoaded",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unlockCallback",
    inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  { type: "error", name: "InsufficientAmountOut", inputs: [] },
  { type: "error", name: "InvalidLockCaller", inputs: [] },
  { type: "error", name: "InvalidQuoteBatchParams", inputs: [] },
  { type: "error", name: "LockFailure", inputs: [] },
  { type: "error", name: "NotPoolManager", inputs: [] },
  { type: "error", name: "NotSelf", inputs: [] },
  {
    type: "error",
    name: "UnexpectedRevertBytes",
    inputs: [{ name: "revertData", type: "bytes", internalType: "bytes" }],
  },
] as const;
