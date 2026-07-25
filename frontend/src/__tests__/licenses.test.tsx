import { describe, it, expect } from 'vitest';

interface License {
  id: number;
  asset_id: number;
  license_type: string;
  buyer: string;
  status: 'Active' | 'Expired' | 'Revoked';
  purchase_price: bigint;
  purchased_at: number;
  expires_at: number;
}

function verifyLicenseById(licenses: License[], searchIdStr: string): { success: boolean; license?: License; error?: string } {
  const idNum = parseInt(searchIdStr.trim(), 10);
  if (isNaN(idNum) || idNum <= 0) {
    return { success: false, error: 'Please enter a valid numeric License ID (e.g. 1, 2)' };
  }

  const found = licenses.find((l) => l.id === idNum);
  if (found) {
    return { success: true, license: found };
  } else {
    return { success: false, error: `License #${idNum} was not found on the Soroban ledger or local cache.` };
  }
}

describe('On-Chain License Inspector Logic', () => {
  const sampleLicenses: License[] = [
    {
      id: 1,
      asset_id: 101,
      license_type: 'Commercial',
      buyer: 'GAQEBOZ...6ZJN',
      status: 'Active',
      purchase_price: 150000000n,
      purchased_at: 1700000000,
      expires_at: 1731536000,
    },
    {
      id: 2,
      asset_id: 102,
      license_type: 'Personal',
      buyer: 'GB34K9...88LK',
      status: 'Expired',
      purchase_price: 50000000n,
      purchased_at: 1650000000,
      expires_at: 1660000000,
    },
  ];

  it('successfully retrieves and verifies an active license by ID', () => {
    const result = verifyLicenseById(sampleLicenses, '1');
    expect(result.success).toBe(true);
    expect(result.license?.id).toBe(1);
    expect(result.license?.license_type).toBe('Commercial');
    expect(result.license?.status).toBe('Active');
  });

  it('rejects invalid non-numeric inputs', () => {
    const result = verifyLicenseById(sampleLicenses, 'abc');
    expect(result.success).toBe(false);
    expect(result.error).toContain('valid numeric License ID');
  });

  it('returns appropriate error message for non-existent license ID', () => {
    const result = verifyLicenseById(sampleLicenses, '999');
    expect(result.success).toBe(false);
    expect(result.error).toContain('was not found on the Soroban ledger');
  });
});
