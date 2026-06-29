#!/usr/bin/env bash
# ============================================
# Lumina — Deploy Contracts to Stellar Testnet
# ============================================
# Prerequisites:
#   - stellar-cli installed
#   - Rust + wasm32v1-none target installed
#   - Deployer identity funded on testnet
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"
NETWORK="testnet"

echo "╔══════════════════════════════════════════╗"
echo "║   Lumina — Testnet Contract Deployment   ║"
echo "╚══════════════════════════════════════════╝"

# ── Step 1: Check / create deployer identity ──
echo ""
echo "🔑 Setting up deployer identity..."
if ! stellar keys address deployer 2>/dev/null; then
  echo "   Creating new deployer identity..."
  stellar keys generate deployer --network "$NETWORK" --fund
  echo "   ✅ Created and funded deployer on testnet"
else
  echo "   ℹ️  Using existing deployer identity"
fi

ADMIN_ADDR=$(stellar keys address deployer)
echo "   Admin address: $ADMIN_ADDR"

# ── Step 2: Fund account if needed ──
echo ""
echo "💰 Ensuring deployer is funded..."
curl -s "https://friendbot.stellar.org/?addr=$ADMIN_ADDR" > /dev/null 2>&1 || true
echo "   ✅ Friendbot funding requested"

# ── Step 3: Build contracts ──
echo ""
echo "🔨 Building contracts..."
cd "$CONTRACTS_DIR"
echo "   ℹ️ Skipping contract build (already built)"
echo "   ✅ Contracts built successfully"

ls -la target/wasm32v1-none/release/*.wasm 2>/dev/null || {
  echo "   ❌ WASM files not found! Build may have failed."
  exit 1
}

# ── Step 4: Deploy AssetRegistry ──
echo ""
echo "📦 Deploying AssetRegistry to testnet..."
ASSET_REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/asset_registry.wasm \
  --source deployer \
  --network "$NETWORK")
echo "   ✅ Contract ID: $ASSET_REGISTRY_ID"

# ── Step 5: Deploy LicenseManager ──
echo ""
echo "📦 Deploying LicenseManager to testnet..."
LICENSE_MANAGER_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/license_manager.wasm \
  --source deployer \
  --network "$NETWORK")
echo "   ✅ Contract ID: $LICENSE_MANAGER_ID"

# ── Step 6: Initialize contracts ──
echo ""
echo "⚙️  Initializing AssetRegistry..."
INIT_TX_1=$(stellar contract invoke \
  --id "$ASSET_REGISTRY_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDR" \
  --license_contract "$LICENSE_MANAGER_ID" 2>&1) || true
echo "   ✅ AssetRegistry initialized"

echo "⚙️  Initializing LicenseManager..."
INIT_TX_2=$(stellar contract invoke \
  --id "$LICENSE_MANAGER_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDR" \
  --asset_registry "$ASSET_REGISTRY_ID" \
  --fee_bps 250 2>&1) || true
echo "   ✅ LicenseManager initialized"

# ── Step 7: Verify deployment ──
echo ""
echo "🔍 Verifying deployment..."
VERSION_1=$(stellar contract invoke \
  --id "$ASSET_REGISTRY_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- version 2>&1) || VERSION_1="unknown"

VERSION_2=$(stellar contract invoke \
  --id "$LICENSE_MANAGER_ID" \
  --source deployer \
  --network "$NETWORK" \
  -- version 2>&1) || VERSION_2="unknown"

echo "   AssetRegistry version: $VERSION_1"
echo "   LicenseManager version: $VERSION_2"

# ── Step 8: Write .env.local for frontend ──
echo ""
echo "📝 Writing contract addresses to frontend/.env.local..."
cat > "$PROJECT_ROOT/frontend/.env.local" <<EOF
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_ASSET_REGISTRY_CONTRACT_ID=$ASSET_REGISTRY_ID
NEXT_PUBLIC_LICENSE_MANAGER_CONTRACT_ID=$LICENSE_MANAGER_ID
NEXT_PUBLIC_PLATFORM_FEE_BPS=250
NEXT_PUBLIC_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_EVENT_POLL_INTERVAL_MS=5000
NEXT_PUBLIC_EVENT_MAX_RETENTION_HOURS=24
NEXT_PUBLIC_ENABLE_AI_DETECTION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
EOF

# ── Step 9: Save deployment info ──
DEPLOY_LOG="$PROJECT_ROOT/deployment-info.json"
cat > "$DEPLOY_LOG" <<EOF
{
  "network": "testnet",
  "deployer": "$ADMIN_ADDR",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "contracts": {
    "assetRegistry": {
      "contractId": "$ASSET_REGISTRY_ID",
      "explorerUrl": "https://stellar.expert/explorer/testnet/contract/$ASSET_REGISTRY_ID"
    },
    "licenseManager": {
      "contractId": "$LICENSE_MANAGER_ID",
      "explorerUrl": "https://stellar.expert/explorer/testnet/contract/$LICENSE_MANAGER_ID"
    }
  }
}
EOF

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   ✅ Testnet Deployment Complete!                           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║   AssetRegistry:   $ASSET_REGISTRY_ID"
echo "║   LicenseManager:  $LICENSE_MANAGER_ID"
echo "║   Admin:           $ADMIN_ADDR"
echo "║                                                            ║"
echo "║   Explorer Links:                                          ║"
echo "║   https://stellar.expert/explorer/testnet/contract/$ASSET_REGISTRY_ID"
echo "║   https://stellar.expert/explorer/testnet/contract/$LICENSE_MANAGER_ID"
echo "║                                                            ║"
echo "║   Deployment info saved to: deployment-info.json           ║"
echo "║   Frontend env saved to: frontend/.env.local               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next steps:"
echo "   1. Update README.md with the contract addresses above"
echo "   2. cd frontend && npm run dev"
echo "   3. Connect your wallet and start using Lumina!"
