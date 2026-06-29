#!/usr/bin/env bash
# ============================================
# Lumina — Store Deployment Metadata
# ============================================
# After deployment, use this script to update
# README.md and .env with actual contract IDs
# and transaction hashes.
#
# Usage: ./store-metadata.sh <deployment-info.json>
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_INFO="${1:-$PROJECT_ROOT/deployment-info.json}"

if [ ! -f "$DEPLOY_INFO" ]; then
  echo "❌ Deployment info file not found: $DEPLOY_INFO"
  echo "   Run deploy-testnet.sh first to generate it."
  exit 1
fi

echo "╔══════════════════════════════════════════╗"
echo "║   Lumina — Store Deployment Metadata     ║"
echo "╚══════════════════════════════════════════╝"

# Parse deployment info
ASSET_REG_ID=$(grep -o '"contractId": "[^"]*"' "$DEPLOY_INFO" | head -1 | cut -d'"' -f4)
LICENSE_MGR_ID=$(grep -o '"contractId": "[^"]*"' "$DEPLOY_INFO" | tail -1 | cut -d'"' -f4)
DEPLOYER=$(grep -o '"deployer": "[^"]*"' "$DEPLOY_INFO" | cut -d'"' -f4)
DEPLOY_TIME=$(grep -o '"deployedAt": "[^"]*"' "$DEPLOY_INFO" | cut -d'"' -f4)

echo ""
echo "   AssetRegistry:    $ASSET_REG_ID"
echo "   LicenseManager:   $LICENSE_MGR_ID"
echo "   Deployer:         $DEPLOYER"
echo "   Deployed At:      $DEPLOY_TIME"

# Update README.md
README="$PROJECT_ROOT/README.md"
if [ -f "$README" ]; then
  echo ""
  echo "📝 Updating README.md..."

  # Replace placeholder contract addresses
  sed -i "s|ASSET_REGISTRY_CONTRACT_ID_PLACEHOLDER|$ASSET_REG_ID|g" "$README"
  sed -i "s|LICENSE_MANAGER_CONTRACT_ID_PLACEHOLDER|$LICENSE_MGR_ID|g" "$README"
  sed -i "s|DEPLOYER_ADDRESS_PLACEHOLDER|$DEPLOYER|g" "$README"
  sed -i "s|DEPLOYMENT_DATE_PLACEHOLDER|$DEPLOY_TIME|g" "$README"

  echo "   ✅ README.md updated"
else
  echo "   ⚠️  README.md not found, skipping"
fi

# Update .env.example with contract IDs as comments
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"
if [ -f "$ENV_EXAMPLE" ]; then
  echo ""
  echo "📝 Adding contract IDs as comments in .env.example..."

  sed -i "s|^NEXT_PUBLIC_ASSET_REGISTRY_CONTRACT_ID=.*|NEXT_PUBLIC_ASSET_REGISTRY_CONTRACT_ID=  # Testnet: $ASSET_REG_ID|" "$ENV_EXAMPLE"
  sed -i "s|^NEXT_PUBLIC_LICENSE_MANAGER_CONTRACT_ID=.*|NEXT_PUBLIC_LICENSE_MANAGER_CONTRACT_ID=  # Testnet: $LICENSE_MGR_ID|" "$ENV_EXAMPLE"

  echo "   ✅ .env.example updated"
fi

echo ""
echo "✅ Metadata stored successfully!"
echo ""
echo "📋 Explorer Links:"
echo "   AssetRegistry:   https://stellar.expert/explorer/testnet/contract/$ASSET_REG_ID"
echo "   LicenseManager:  https://stellar.expert/explorer/testnet/contract/$LICENSE_MGR_ID"
