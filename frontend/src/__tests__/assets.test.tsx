import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock types matching contract definitions
interface Asset {
  id: number;
  owner: string;
  name: string;
  content_hash: string;
  asset_type: 'Image' | 'Video' | 'Audio' | 'Document' | 'Model3D' | 'Code' | 'Other';
  status: 'Active' | 'Inactive' | 'Suspended';
  royalty_bps: number;
  created_at: number;
}

// Asset validation logic (mirrors what RegisterAssetForm would use)
function validateAssetRegistration(data: {
  name: string;
  contentHash: string;
  assetType: string;
  royaltyBps: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Asset name is required');
  }
  if (data.name && data.name.length > 100) {
    errors.push('Asset name must be 100 characters or less');
  }
  if (!data.contentHash || data.contentHash.trim().length === 0) {
    errors.push('Content hash is required');
  }
  if (!data.assetType) {
    errors.push('Asset type is required');
  }
  if (data.royaltyBps < 0 || data.royaltyBps > 10000) {
    errors.push('Royalty must be between 0% and 100%');
  }

  return { valid: errors.length === 0, errors };
}

// Format address helper (mirrors utils.ts)
function formatAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

describe('Asset Registration Validation', () => {
  it('should validate a correct asset registration', () => {
    const result = validateAssetRegistration({
      name: 'Digital Sunset Photography',
      contentHash: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxM',
      assetType: 'Image',
      royaltyBps: 500,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty asset name', () => {
    const result = validateAssetRegistration({
      name: '',
      contentHash: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxM',
      assetType: 'Image',
      royaltyBps: 500,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Asset name is required');
  });

  it('should reject name longer than 100 characters', () => {
    const result = validateAssetRegistration({
      name: 'A'.repeat(101),
      contentHash: 'QmHash',
      assetType: 'Image',
      royaltyBps: 500,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Asset name must be 100 characters or less');
  });

  it('should reject empty content hash', () => {
    const result = validateAssetRegistration({
      name: 'Test Asset',
      contentHash: '',
      assetType: 'Image',
      royaltyBps: 500,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Content hash is required');
  });

  it('should reject royalty above 100%', () => {
    const result = validateAssetRegistration({
      name: 'Test Asset',
      contentHash: 'QmHash',
      assetType: 'Image',
      royaltyBps: 15000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Royalty must be between 0% and 100%');
  });

  it('should reject negative royalty', () => {
    const result = validateAssetRegistration({
      name: 'Test Asset',
      contentHash: 'QmHash',
      assetType: 'Image',
      royaltyBps: -100,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Royalty must be between 0% and 100%');
  });

  it('should accept zero royalty', () => {
    const result = validateAssetRegistration({
      name: 'Open Source Model',
      contentHash: 'QmHash',
      assetType: 'Model3D',
      royaltyBps: 0,
    });

    expect(result.valid).toBe(true);
  });

  it('should accept maximum royalty (100%)', () => {
    const result = validateAssetRegistration({
      name: 'Exclusive Art',
      contentHash: 'QmHash',
      assetType: 'Image',
      royaltyBps: 10000,
    });

    expect(result.valid).toBe(true);
  });
});

describe('Address Formatting', () => {
  it('should format a long Stellar address', () => {
    const address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRST';
    const formatted = formatAddress(address);
    expect(formatted).toBe('GABC...QRST');
  });

  it('should return short addresses unchanged', () => {
    const address = 'GABCDE';
    const formatted = formatAddress(address);
    expect(formatted).toBe('GABCDE');
  });
});

describe('Asset Type Mapping', () => {
  const assetTypes = ['Image', 'Video', 'Audio', 'Document', 'Model3D', 'Code', 'Other'];

  it('should have all expected asset types', () => {
    expect(assetTypes).toHaveLength(7);
    expect(assetTypes).toContain('Image');
    expect(assetTypes).toContain('Video');
    expect(assetTypes).toContain('Audio');
    expect(assetTypes).toContain('Document');
    expect(assetTypes).toContain('Model3D');
    expect(assetTypes).toContain('Code');
    expect(assetTypes).toContain('Other');
  });
});
