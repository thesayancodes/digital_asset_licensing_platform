#!/usr/bin/env bash
# ============================================
# Lumina — Deploy Contracts to Local Standalone
# ============================================
# Prerequisites:
#   - Docker running
#   - stellar-cli installed
#   - Rust + wasm32v1-none target installed
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

echo "╔══════════════════════════════════════════╗"
echo "║   Lumina — Local Contract Deployment     ║"
echo "╚══════════════════════════════════════════╝"

# ── Step 1: Start local Stellar sandbox ──
echo ""
echo "🚀 Starting local Stellar sandbox..."
docker run -d --name stellar-local \
  -p 8000:8000 \
  stellar/quickstart:latest \
  --standalone \
  --enable-soroban-rpc \
  2>/dev/null || echo "ℹ️  Container 'stellar-local' already running"

echo "⏳ Waiting for RPC to be ready..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8000/soroban/rpc | grep -q "jsonrpc"; then
    echo "✅ RPC is ready!"
    break
  fi
  sleep 2
done

# ── Step 2: Generate deployer identity ──
echo ""
echo "🔑 Generating deployer identity..."
stellar keys generate deployer \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017" \
  --fund \
  2>/dev/null || echo "ℹ️  Identity 'deployer' already exists"

ADMIN_ADDR=$(stellar keys address deployer)
echo "   Admin address: $ADMIN_ADDR"

# ── Step 3: Build contracts ──
echo ""
echo "🔨 Building contracts..."
cd "$CONTRACTS_DIR"
stellar contract build
echo "✅ Contracts built successfully"

# ── Step 4: Deploy AssetRegistry ──
echo ""
echo "📦 Deploying AssetRegistry..."
ASSET_REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/asset_registry.wasm \
  --source deployer \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017")
echo "   Contract ID: $ASSET_REGISTRY_ID"

# ── Step 5: Deploy LicenseManager ──
echo ""
echo "📦 Deploying LicenseManager..."
LICENSE_MANAGER_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/license_manager.wasm \
  --source deployer \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017")
echo "   Contract ID: $LICENSE_MANAGER_ID"

# ── Step 6: Initialize contracts ──
echo ""
echo "⚙️  Initializing AssetRegistry..."
stellar contract invoke \
  --id "$ASSET_REGISTRY_ID" \
  --source deployer \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017" \
  -- initialize \
  --admin "$ADMIN_ADDR" \
  --license_contract "$LICENSE_MANAGER_ID"

echo "⚙️  Initializing LicenseManager..."
stellar contract invoke \
  --id "$LICENSE_MANAGER_ID" \
  --source deployer \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017" \
  -- initialize \
  --admin "$ADMIN_ADDR" \
  --asset_registry "$ASSET_REGISTRY_ID" \
  --fee_bps 250

# ── Step 7: Write .env ──
echo ""
echo "📝 Writing contract addresses to .env.local..."
cat > "$PROJECT_ROOT/frontend/.env.local" <<EOF
NEXT_PUBLIC_STELLAR_NETWORK=standalone
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc
NEXT_PUBLIC_HORIZON_URL=http://localhost:8000
NEXT_PUBLIC_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
NEXT_PUBLIC_ASSET_REGISTRY_CONTRACT_ID=$ASSET_REGISTRY_ID
NEXT_PUBLIC_LICENSE_MANAGER_CONTRACT_ID=$LICENSE_MANAGER_ID
NEXT_PUBLIC_PLATFORM_FEE_BPS=250
NEXT_PUBLIC_EXPLORER_URL=http://localhost:8000
NEXT_PUBLIC_EVENT_POLL_INTERVAL_MS=3000
EOF

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ✅ Local Deployment Complete!          ║"
echo "╠══════════════════════════════════════════╣"
echo "║   AssetRegistry:  $ASSET_REGISTRY_ID"
echo "║   LicenseManager: $LICENSE_MANAGER_ID"
echo "║   Admin:          $ADMIN_ADDR"
echo "╚══════════════════════════════════════════╝"
