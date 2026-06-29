use soroban_sdk::{Address, Env, Vec};

use crate::types::{Asset, DataKey};

// TTL Constants
pub const INSTANCE_BUMP_AMOUNT: u32 = 34560; // ~2 days
pub const INSTANCE_LIFETIME_THRESHOLD: u32 = 17280; // ~1 day
pub const PERSISTENT_BUMP_AMOUNT: u32 = 518400; // ~30 days
pub const PERSISTENT_LIFETIME_THRESHOLD: u32 = 120960; // ~7 days

// --- Admin ---
pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

// --- Version ---
pub fn get_version(env: &Env) -> u32 {
    env.storage().instance().get(&DataKey::Version).unwrap_or(0)
}

pub fn set_version(env: &Env, version: u32) {
    env.storage().instance().set(&DataKey::Version, &version);
}

// --- License Contract ---
pub fn get_license_contract(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::LicenseContract)
        .unwrap()
}

pub fn set_license_contract(env: &Env, contract: &Address) {
    env.storage()
        .instance()
        .set(&DataKey::LicenseContract, contract);
}

// --- Asset Count ---
pub fn get_asset_count(env: &Env) -> u64 {
    env.storage()
        .instance()
        .get(&DataKey::AssetCount)
        .unwrap_or(0)
}

pub fn set_asset_count(env: &Env, count: u64) {
    env.storage().instance().set(&DataKey::AssetCount, &count);
}

pub fn increment_asset_count(env: &Env) -> u64 {
    let count = get_asset_count(env) + 1;
    set_asset_count(env, count);
    count
}

// --- Asset ---
pub fn get_asset(env: &Env, asset_id: u64) -> Asset {
    let key = DataKey::Asset(asset_id);
    env.storage().persistent().get(&key).unwrap()
}

pub fn set_asset(env: &Env, asset_id: u64, asset: &Asset) {
    let key = DataKey::Asset(asset_id);
    env.storage().persistent().set(&key, asset);
    extend_persistent_ttl(env, &key);
}

pub fn has_asset(env: &Env, asset_id: u64) -> bool {
    env.storage().persistent().has(&DataKey::Asset(asset_id))
}

// --- Owner Assets ---
pub fn get_owner_assets(env: &Env, owner: &Address) -> Vec<u64> {
    let key = DataKey::OwnerAssets(owner.clone());
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(Vec::new(env))
}

pub fn add_owner_asset(env: &Env, owner: &Address, asset_id: u64) {
    let key = DataKey::OwnerAssets(owner.clone());
    let mut assets = get_owner_assets(env, owner);
    assets.push_back(asset_id);
    env.storage().persistent().set(&key, &assets);
    extend_persistent_ttl(env, &key);
}

// --- TTL Extensions ---
pub fn extend_instance_ttl(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn extend_persistent_ttl(env: &Env, key: &DataKey) {
    env.storage().persistent().extend_ttl(
        key,
        PERSISTENT_LIFETIME_THRESHOLD,
        PERSISTENT_BUMP_AMOUNT,
    );
}
