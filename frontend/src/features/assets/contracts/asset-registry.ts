import { Contract, nativeToScVal, scValToNative, xdr, Address } from '@stellar/stellar-sdk';
import { ASSET_REGISTRY_CONTRACT_ID } from '@/lib/constants';
import { buildContractCall } from '@/lib/stellar/transaction';

// ── Types matching Rust contract ──
export type AssetType = 'Image' | 'Video' | 'Audio' | 'Document' | 'Model3D' | 'Code' | 'Other';
export type AssetStatus = 'Active' | 'Inactive' | 'Suspended';

export interface Asset {
  id: number;
  owner: string;
  name: string;
  content_hash: string;
  asset_type: AssetType;
  status: AssetStatus;
  royalty_bps: number;
  created_at: number;
}

export interface AssetInfo {
  id: number;
  owner: string;
  status: AssetStatus;
  royalty_bps: number;
}

// ── Contract Interaction Functions ──
export function getContractId(): string {
  return ASSET_REGISTRY_CONTRACT_ID;
}

export async function registerAsset(
  sourcePublicKey: string,
  owner: string,
  name: string,
  contentHash: string,
  assetType: AssetType,
  royaltyBps: number
) {
  const contract = new Contract(ASSET_REGISTRY_CONTRACT_ID);
  const args = [
    new Address(owner).toScVal(),
    nativeToScVal(name, { type: 'string' }),
    nativeToScVal(contentHash, { type: 'string' }),
    nativeToScVal(assetType, { type: 'symbol' }),
    nativeToScVal(royaltyBps, { type: 'u32' }),
  ];
  return buildContractCall(sourcePublicKey, ASSET_REGISTRY_CONTRACT_ID, 'register_asset', args);
}

export async function transferAsset(
  sourcePublicKey: string,
  assetId: number,
  from: string,
  to: string
) {
  const args = [
    nativeToScVal(assetId, { type: 'u64' }),
    new Address(from).toScVal(),
    new Address(to).toScVal(),
  ];
  return buildContractCall(sourcePublicKey, ASSET_REGISTRY_CONTRACT_ID, 'transfer_asset', args);
}

export async function getAsset(sourcePublicKey: string, assetId: number) {
  const args = [nativeToScVal(assetId, { type: 'u64' })];
  return buildContractCall(sourcePublicKey, ASSET_REGISTRY_CONTRACT_ID, 'get_asset', args);
}

export async function verifyAsset(sourcePublicKey: string, assetId: number) {
  const args = [nativeToScVal(assetId, { type: 'u64' })];
  return buildContractCall(sourcePublicKey, ASSET_REGISTRY_CONTRACT_ID, 'verify_asset', args);
}

export async function getOwnerAssets(sourcePublicKey: string, owner: string) {
  const args = [new Address(owner).toScVal()];
  return buildContractCall(sourcePublicKey, ASSET_REGISTRY_CONTRACT_ID, 'get_owner_assets', args);
}

export async function updateAssetStatus(
  sourcePublicKey: string,
  assetId: number,
  status: AssetStatus
) {
  const args = [
    nativeToScVal(assetId, { type: 'u64' }),
    nativeToScVal(status, { type: 'symbol' }),
  ];
  return buildContractCall(sourcePublicKey, ASSET_REGISTRY_CONTRACT_ID, 'update_asset_status', args);
}
