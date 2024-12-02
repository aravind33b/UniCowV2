UniCowV2 Setup Instructions
==========================

Prerequisites
------------
1. Node.js
2. pnpm
3. Git
4. Foundry

Step-by-Step Setup
-----------------

1. Clone and Initial Setup
-------------------------
git clone <repository-url>
cd UniCowV2


2. Install Dependencies
----------------------
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install Node.js dependencies
pnpm install


3. Build and Deploy Contracts
----------------------------
# Build the contracts
make build-contracts

# Start local Anvil chain with persistent state (Terminal 1)
make start-anvil-with-state

# In a new terminal (Terminal 2), deploy contracts to local Anvil chain
make deploy-to-anvil


4. Register Operator
-------------------
# In Terminal 2, register the operator
cd operator && pnpm tsx register.ts


5. Start the Operator
--------------------
# In Terminal 2, start the operator service
cd operator && pnpm tsx index.ts


Important Notes
--------------
1. Terminal Management:
   - Terminal 1: Keep Anvil chain running
   - Terminal 2: Use for all other commands

2. Order of Operations:
   - Start Anvil first
   - Deploy contracts second
   - Register operator third
   - Start operator service last

3. Expected Behavior:
   - Anvil chain starts with persistent state
   - Contracts deploy successfully
   - Operator registers successfully
   - Operator service starts monitoring for tasks

4. Troubleshooting:
   - Ensure Anvil is running before deploying contracts
   - Verify contracts are deployed before registering operator
   - Confirm operator is registered before starting service
   - If any step fails, resolve the error before proceeding

5. Common Commands:
   - To rebuild contracts: make build-contracts
   - To redeploy: make deploy-to-anvil
   - To restart operator: cd operator && pnpm tsx index.ts 