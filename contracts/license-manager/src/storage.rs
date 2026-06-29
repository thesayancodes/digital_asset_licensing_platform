use soroban_sdk::{Address, Env, Vec};

use crate::types::{DataKey, License, LicenseTemplate, RoyaltyRecord};

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

// --- Asset Registry Contract ---
pub fn get_asset_registry(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::AssetRegistryContract)
        .unwrap()
}

pub fn set_asset_registry(env: &Env, contract: &Address) {
    env.storage()
        .instance()
        .set(&DataKey::AssetRegistryContract, contract);
}

// --- Platform Fee ---
pub fn get_platform_fee_bps(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&DataKey::PlatformFeeBps)
        .unwrap_or(0)
}

pub fn set_platform_fee_bps(env: &Env, fee_bps: u32) {
    env.storage()
        .instance()
        .set(&DataKey::PlatformFeeBps, &fee_bps);
}

// --- License Count ---
pub fn get_license_count(env: &Env) -> u64 {
    env.storage()
        .instance()
        .get(&DataKey::LicenseCount)
        .unwrap_or(0)
}

pub fn set_license_count(env: &Env, count: u64) {
    env.storage().instance().set(&DataKey::LicenseCount, &count);
}

pub fn increment_license_count(env: &Env) -> u64 {
    let count = get_license_count(env) + 1;
    set_license_count(env, count);
    count
}

// --- License Template ---
pub fn get_template(env: &Env, asset_id: u64) -> Option<LicenseTemplate> {
    let key = DataKey::LicenseTemplate(asset_id);
    env.storage().persistent().get(&key)
}

pub fn set_template(env: &Env, asset_id: u64, template: &LicenseTemplate) {
    let key = DataKey::LicenseTemplate(asset_id);
    env.storage().persistent().set(&key, template);
    extend_persistent_ttl(env, &key);
}

pub fn has_template(env: &Env, asset_id: u64) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::LicenseTemplate(asset_id))
}

// --- License ---
pub fn get_license(env: &Env, license_id: u64) -> License {
    let key = DataKey::License(license_id);
    env.storage().persistent().get(&key).unwrap()
}

pub fn set_license(env: &Env, license_id: u64, license: &License) {
    let key = DataKey::License(license_id);
    env.storage().persistent().set(&key, license);
    extend_persistent_ttl(env, &key);
}

pub fn has_license(env: &Env, license_id: u64) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::License(license_id))
}

// --- Asset Licenses ---
pub fn get_asset_licenses(env: &Env, asset_id: u64) -> Vec<u64> {
    let key = DataKey::AssetLicenses(asset_id);
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(Vec::new(env))
}

pub fn add_asset_license(env: &Env, asset_id: u64, license_id: u64) {
    let key = DataKey::AssetLicenses(asset_id);
    let mut licenses = get_asset_licenses(env, asset_id);
    licenses.push_back(license_id);
    env.storage().persistent().set(&key, &licenses);
    extend_persistent_ttl(env, &key);
}

// --- User Licenses ---
pub fn get_user_licenses(env: &Env, user: &Address) -> Vec<u64> {
    let key = DataKey::UserLicenses(user.clone());
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(Vec::new(env))
}

pub fn add_user_license(env: &Env, user: &Address, license_id: u64) {
    let key = DataKey::UserLicenses(user.clone());
    let mut licenses = get_user_licenses(env, user);
    licenses.push_back(license_id);
    env.storage().persistent().set(&key, &licenses);
    extend_persistent_ttl(env, &key);
}

// --- Royalty Record ---
pub fn set_royalty_record(env: &Env, license_id: u64, record: &RoyaltyRecord) {
    let key = DataKey::RoyaltyRecord(license_id);
    env.storage().persistent().set(&key, record);
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
