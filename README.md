# Relayroot

A decentralized infrastructure network that rewards community-hosted wallet relays, indexing services, and light RPC endpoints — creating a censorship-resistant backbone for Web3 dApps, all on-chain.

---

## Overview

Relayroot consists of ten modular Clarity smart contracts that together create a decentralized, performance-incentivized infrastructure layer:

1. **Relay Registry Contract** – Registers and manages infrastructure node metadata.
2. **Staking Vault Contract** – Handles node collateral and enforces staking rules.
3. **Uptime Oracle Contract** – Accepts verified uptime attestations from oracle agents.
4. **Reward Engine Contract** – Distributes performance-based rewards per epoch.
5. **Slasher Contract** – Penalizes nodes with poor performance or verified misconduct.
6. **Consumer Stream Contract** – Enables streaming micropayments from dApps to nodes.
7. **Usage Tracker Contract** – Collects and stores usage metrics from verifiable sources.
8. **Governance Hub Contract** – DAO contract for protocol upgrades and parameter management.
9. **Node Identity Contract** – Maintains trust scores and certification history.
10. **Treasury Contract** – Receives, stores, and routes funds across the system.

---

## Features

- **Permissionless node registration** for relays, RPCs, and indexers  
- **Staking & slashing** for node accountability  
- **Decentralized uptime oracles** to validate performance  
- **Usage-based reward distribution** tied to verified metrics  
- **Micropayment streams** between consumers and infrastructure  
- **Node trust scores & reputation tracking**  
- **DAO governance** for protocol decisions  
- **Transparent fund routing and emissions**  
- **Cross-region and multi-client support**  
- **Modular and upgrade-friendly architecture**

---

## Smart Contracts

### Relay Registry Contract
- Registers new infrastructure nodes
- Stores metadata: type, region, endpoints, etc.
- Enforces minimum stake requirements via Staking Vault

### Staking Vault Contract
- Manages locked collateral for node operators
- Time-locked stake withdrawal system
- Transfers stake to Slasher upon violations

### Uptime Oracle Contract
- Accepts signed attestations from uptime oracle nodes
- Aggregates and stores epoch-based uptime scores
- Interfaces with Reward Engine and Slasher

### Reward Engine Contract
- Distributes token rewards per epoch
- Weighting based on uptime and usage data
- Interacts with Treasury for disbursements

### Slasher Contract
- Monitors underperforming or malicious nodes
- Triggers partial or full stake slashing
- Updates trust score in Node Identity

### Consumer Stream Contract
- Allows dApps and wallets to stream payments to nodes
- Supports per-second, cancelable streaming logic
- Pull-based claim mechanism for node operators

### Usage Tracker Contract
- Stores metrics like request count, latency, bandwidth
- Accepts signed usage reports from verifiable agents
- Input to reward weighting

### Governance Hub Contract
- DAO contract with token-based voting
- Proposals for parameter changes, oracle whitelisting
- On-chain execution of approved proposals

### Node Identity Contract
- Assigns unique trust scores to each node
- Tracks certification events and performance history
- Publicly viewable reputation log

### Treasury Contract
- Stores consumer payments and protocol emissions
- Routes funds to Reward Engine, DAO, and Node payouts
- Tracks all inflows and outflows

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/relayroot.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

---


## Usage
Each contract serves a specific role and interacts with others via well-defined interfaces. To onboard a node, use the Relay Registry. To claim uptime rewards, report uptime via the Oracle and call Reward Engine. For governance, use Governance Hub proposals.

Refer to each contract’s documentation in /contracts/ for functions, parameters, and integration guidance.

---

## License

MIT License
