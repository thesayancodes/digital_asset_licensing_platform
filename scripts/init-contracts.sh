#!/usr/bin/env bash
# ============================================
# Lumina — Initialize Contracts
# ============================================
# Use this to initialize already-deployed contracts
# with cross-references and admin configuration.
#
# Usage: ./init-contracts.sh <asset_registry_id> <license_manager_id> [network]
# ============================================

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <asset_registry_id> <license_manager_id> [network]"
  echo ""
  echo "Arguments:"
  echo "  asset_registry_id   Contract ID of deployed AssetRegistry"
  echo "  license_manager_id  Contract ID of deployed LicenseManager"
  echo "  network             Network to use (default: testnet)"
  exit 1
fi

ASSET_REGISTRY_ID="$1"
LICENSE_MANAGER_ID="$2"
NETWORK="${3:-testnet}"

echo "╔══════════════════════════════════════════╗"
echo "║   Lumina — Contract Initialization       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "   Network:          $NETWORK"
echo "   AssetRegistry:    $ASSET_REGISTRY_ID"
echo "   LicenseManager:   $LICENSE_MANAGER_ID"

# Get admin address
ADMIN_ADDR=$(stellar keys address deployer)
echo "   Admin:            $ADMIN_ADDR"

echo ""
echo "⚙️  Initializing AssetRegistry..."
stellar contract invoke \
  --id "$ASSET_REGISTRY_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDR" \
  --license_contract "$LICENSE_MANAGER_ID"
echo "   ✅ Done"

echo ""
echo "⚙️  Initializing LicenseManager..."
stellar contract invoke \
  --id "$LICENSE_MANAGER_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDR" \
  --asset_registry "$ASSET_REGISTRY_ID" \
  --fee_bps 250
echo "   ✅ Done"

echo ""
echo "🔍 Verifying..."
echo "   AssetRegistry version: $(stellar contract invoke --id "$ASSET_REGISTRY_ID" --source deployer --network "$NETWORK" -- version)"
echo "   LicenseManager version: $(stellar contract invoke --id "$LICENSE_MANAGER_ID" --source deployer --network "$NETWORK" -- version)"

echo ""
echo "✅ Both contracts initialized and cross-referenced!"
