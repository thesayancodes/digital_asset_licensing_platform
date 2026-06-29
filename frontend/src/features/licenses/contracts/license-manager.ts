import { Contract, nativeToScVal, Address } from '@stellar/stellar-sdk';
import { LICENSE_MANAGER_CONTRACT_ID } from '@/lib/constants';
import { buildContractCall } from '@/lib/stellar/transaction';

// ── Types matching Rust contract ──
export type LicenseType = 'Personal' | 'Commercial' | 'Editorial' | 'Enterprise' | 'Exclusive';
export type LicenseStatus = 'Active' | 'Expired' | 'Revoked';

export interface LicenseTemplate {
  asset_id: number;
  license_type: LicenseType;
  price: bigint;
  max_uses: number;
  duration_days: number;
  active: boolean;
}

export interface License {
  id: number;
  asset_id: number;
  license_type: LicenseType;
  buyer: string;
  status: LicenseStatus;
  purchase_price: bigint;
  purchased_at: number;
  expires_at: number;
}

export interface RoyaltyRecord {
  license_id: number;
  asset_owner: string;
  royalty_amount: bigint;
  platform_fee: bigint;
  distributed_at: number;
}

// ── Contract Interaction Functions ──
export async function createLicenseTemplate(
  sourcePublicKey: string,
  caller: string,
  assetId: number,
  licenseType: LicenseType,
  price: bigint,
  maxUses: number,
  durationDays: number
) {
  const args = [
    new Address(caller).toScVal(),
    nativeToScVal(assetId, { type: 'u64' }),
    nativeToScVal(licenseType, { type: 'symbol' }),
    nativeToScVal(price, { type: 'i128' }),
    nativeToScVal(maxUses, { type: 'u32' }),
    nativeToScVal(durationDays, { type: 'u64' }),
  ];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'create_license_template', args);
}

export async function purchaseLicense(
  sourcePublicKey: string,
  buyer: string,
  assetId: number,
  licenseType: LicenseType
) {
  const args = [
    new Address(buyer).toScVal(),
    nativeToScVal(assetId, { type: 'u64' }),
    nativeToScVal(licenseType, { type: 'symbol' }),
  ];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'purchase_license', args);
}

export async function verifyLicense(sourcePublicKey: string, licenseId: number) {
  const args = [nativeToScVal(licenseId, { type: 'u64' })];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'verify_license', args);
}

export async function revokeLicense(sourcePublicKey: string, caller: string, licenseId: number) {
  const args = [
    new Address(caller).toScVal(),
    nativeToScVal(licenseId, { type: 'u64' }),
  ];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'revoke_license', args);
}

export async function getLicense(sourcePublicKey: string, licenseId: number) {
  const args = [nativeToScVal(licenseId, { type: 'u64' })];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'get_license', args);
}

export async function getUserLicenses(sourcePublicKey: string, user: string) {
  const args = [new Address(user).toScVal()];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'get_user_licenses', args);
}

export async function getAssetLicenses(sourcePublicKey: string, assetId: number) {
  const args = [nativeToScVal(assetId, { type: 'u64' })];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'get_asset_licenses', args);
}

export async function getTemplate(sourcePublicKey: string, assetId: number) {
  const args = [nativeToScVal(assetId, { type: 'u64' })];
  return buildContractCall(sourcePublicKey, LICENSE_MANAGER_CONTRACT_ID, 'get_template', args);
}
