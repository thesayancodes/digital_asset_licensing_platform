use soroban_sdk::{contracttype, Address};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Version,
    AssetRegistryContract,
    PlatformFeeBps,
    LicenseCount,
    LicenseTemplate(u64),
    License(u64),
    AssetLicenses(u64),
    UserLicenses(Address),
    RoyaltyRecord(u64),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LicenseType {
    Personal,
    Commercial,
    Editorial,
    Enterprise,
    Exclusive,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LicenseStatus {
    Active,
    Expired,
    Revoked,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct LicenseTemplate {
    pub asset_id: u64,
    pub license_type: LicenseType,
    pub price: i128,
    pub max_uses: u32,
    pub duration_days: u64,
    pub active: bool,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct License {
    pub id: u64,
    pub asset_id: u64,
    pub license_type: LicenseType,
    pub buyer: Address,
    pub status: LicenseStatus,
    pub purchase_price: i128,
    pub purchased_at: u64,
    pub expires_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct RoyaltyRecord {
    pub license_id: u64,
    pub asset_owner: Address,
    pub royalty_amount: i128,
    pub platform_fee: i128,
    pub distributed_at: u64,
}
