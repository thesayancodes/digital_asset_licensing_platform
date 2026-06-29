#!/usr/bin/env bash
# ============================================
# Lumina — Upgrade Contract
# ============================================
# Builds new WASM, installs it, and upgrades
# a deployed contract in-place.
#
# Usage: ./upgrade-contract.sh <contract_name> <contract_id> [network]
#   contract_name: "asset-registry" or "license-manager"
# ============================================

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <contract_name> <contract_id> [network]"
  echo ""
  echo "Arguments:"
  echo "  contract_name  'asset-registry' or 'license-manager'"
  echo "  contract_id    Deployed contract ID to upgrade"
  echo "  network        Network to use (default: testnet)"
  exit 1
fi

CONTRACT_NAME="$1"
CONTRACT_ID="$2"
NETWORK="${3:-testnet}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

echo "╔══════════════════════════════════════════╗"
echo "║   Lumina — Contract Upgrade              ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "   Contract:   $CONTRACT_NAME"
echo "   ID:         $CONTRACT_ID"
echo "   Network:    $NETWORK"

# ── Step 1: Get current version ──
echo ""
echo "🔍 Current version..."
CURRENT_VERSION=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- version 2>&1) || CURRENT_VERSION="unknown"
echo "   Current version: $CURRENT_VERSION"

# ── Step 2: Build new WASM ──
echo ""
echo "🔨 Building contracts..."
cd "$CONTRACTS_DIR"
stellar contract build
echo "   ✅ Build complete"

# Determine WASM filename
WASM_NAME="${CONTRACT_NAME//-/_}"
WASM_PATH="target/wasm32v1-none/release/${WASM_NAME}.wasm"

if [ ! -f "$WASM_PATH" ]; then
  echo "   ❌ WASM file not found: $WASM_PATH"
  exit 1
fi

echo "   WASM file: $WASM_PATH ($(wc -c < "$WASM_PATH") bytes)"

# ── Step 3: Install new WASM ──
echo ""
echo "📦 Installing new WASM on-chain..."
WASM_HASH=$(stellar contract install \
  --wasm "$WASM_PATH" \
  --source deployer \
  --network "$NETWORK")
echo "   ✅ WASM hash: $WASM_HASH"

# ── Step 4: Upgrade contract ──
echo ""
echo "⬆️  Upgrading contract..."
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- upgrade \
  --new_wasm_hash "$WASM_HASH"
echo "   ✅ Upgrade transaction submitted"

# ── Step 5: Verify new version ──
echo ""
echo "🔍 Verifying upgrade..."
NEW_VERSION=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- version 2>&1) || NEW_VERSION="unknown"
echo "   New version: $NEW_VERSION"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ✅ Contract Upgrade Complete!          ║"
echo "╠══════════════════════════════════════════╣"
echo "║   $CURRENT_VERSION → $NEW_VERSION"
echo "║   WASM Hash: $WASM_HASH"
echo "╚══════════════════════════════════════════╝"
