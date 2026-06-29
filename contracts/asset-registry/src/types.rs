use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Version,
    LicenseContract,
    AssetCount,
    Asset(u64),
    OwnerAssets(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum AssetType {
    Image,
    Video,
    Audio,
    Document,
    Model3D,
    Code,
    Other,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum AssetStatus {
    Active,
    Inactive,
    Suspended,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Asset {
    pub id: u64,
    pub owner: Address,
    pub name: String,
    pub content_hash: String,
    pub asset_type: AssetType,
    pub status: AssetStatus,
    pub royalty_bps: u32,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct AssetInfo {
    pub id: u64,
    pub owner: Address,
    pub status: AssetStatus,
    pub royalty_bps: u32,
}
