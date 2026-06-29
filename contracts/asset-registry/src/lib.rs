#![no_std]

mod access;
mod errors;
mod events;
mod storage;
mod types;

use soroban_sdk::{contract, contractimpl, panic_with_error, Address, BytesN, Env, String, Vec};

use errors::AssetError;
use types::{Asset, AssetInfo, AssetStatus, AssetType, DataKey};

pub use types::{Asset as AssetStruct, AssetInfo as AssetInfoStruct};

#[contract]
pub struct AssetRegistryContract;

#[contractimpl]
impl AssetRegistryContract {
    /// Initialize the contract with an admin and license contract address.
    pub fn initialize(env: Env, admin: Address, license_contract: Address) {
        if storage::has_admin(&env) {
            panic_with_error!(&env, AssetError::AlreadyInitialized);
        }

        storage::set_admin(&env, &admin);
        storage::set_license_contract(&env, &license_contract);
        storage::set_version(&env, 1);
        storage::set_asset_count(&env, 0);
        storage::extend_instance_ttl(&env);
    }

    /// Register a new digital asset. Returns the new asset ID.
    pub fn register_asset(
        env: Env,
        owner: Address,
        name: String,
        content_hash: String,
        asset_type: AssetType,
        royalty_bps: u32,
    ) -> u64 {
        owner.require_auth();

        if royalty_bps > 10000 {
            panic_with_error!(&env, AssetError::InvalidRoyaltyBps);
        }

        let asset_id = storage::increment_asset_count(&env);

        let asset = Asset {
            id: asset_id,
            owner: owner.clone(),
            name,
            content_hash: content_hash.clone(),
            asset_type,
            status: AssetStatus::Active,
            royalty_bps,
            created_at: env.ledger().timestamp(),
        };

        storage::set_asset(&env, asset_id, &asset);
        storage::add_owner_asset(&env, &owner, asset_id);
        storage::extend_instance_ttl(&env);

        events::emit_asset_registered(&env, asset_id, &owner, &content_hash);

        asset_id
    }

    /// Transfer asset ownership from one address to another.
    pub fn transfer_asset(env: Env, asset_id: u64, from: Address, to: Address) {
        from.require_auth();

        if !storage::has_asset(&env, asset_id) {
            panic_with_error!(&env, AssetError::AssetNotFound);
        }

        let mut asset = storage::get_asset(&env, asset_id);

        if asset.owner != from {
            panic_with_error!(&env, AssetError::Unauthorized);
        }

        asset.owner = to.clone();
        storage::set_asset(&env, asset_id, &asset);

        // Remove from old owner's list and add to new owner's list
        let old_assets = storage::get_owner_assets(&env, &from);
        let mut new_from_assets: Vec<u64> = Vec::new(&env);
        for a in old_assets.iter() {
            if a != asset_id {
                new_from_assets.push_back(a);
            }
        }
        let key_from = DataKey::OwnerAssets(from.clone());
        env.storage().persistent().set(&key_from, &new_from_assets);

        storage::add_owner_asset(&env, &to, asset_id);
        storage::extend_instance_ttl(&env);

        events::emit_asset_transferred(&env, asset_id, &from, &to);
    }

    /// Verify an asset exists and return lightweight info for inter-contract calls.
    pub fn verify_asset(env: Env, asset_id: u64) -> AssetInfo {
        if !storage::has_asset(&env, asset_id) {
            panic_with_error!(&env, AssetError::AssetNotFound);
        }

        let asset = storage::get_asset(&env, asset_id);
        storage::extend_instance_ttl(&env);

        AssetInfo {
            id: asset.id,
            owner: asset.owner,
            status: asset.status,
            royalty_bps: asset.royalty_bps,
        }
    }

    /// Get the full asset details.
    pub fn get_asset(env: Env, asset_id: u64) -> Asset {
        if !storage::has_asset(&env, asset_id) {
            panic_with_error!(&env, AssetError::AssetNotFound);
        }

        let asset = storage::get_asset(&env, asset_id);
        storage::extend_instance_ttl(&env);
        asset
    }

    /// Get all asset IDs owned by a given address.
    pub fn get_owner_assets(env: Env, owner: Address) -> Vec<u64> {
        storage::get_owner_assets(&env, &owner)
    }

    /// Update the status of an asset. Only owner or admin can do this.
    pub fn update_asset_status(env: Env, asset_id: u64, status: AssetStatus) {
        if !storage::has_asset(&env, asset_id) {
            panic_with_error!(&env, AssetError::AssetNotFound);
        }

        let mut asset = storage::get_asset(&env, asset_id);
        access::require_owner_or_admin(&env, &asset.owner);

        asset.status = status.clone();
        storage::set_asset(&env, asset_id, &asset);
        storage::extend_instance_ttl(&env);

        events::emit_asset_status_changed(&env, asset_id, &status);
    }

    /// Change the contract admin. Only current admin can call.
    pub fn set_admin(env: Env, new_admin: Address) {
        let old_admin = access::require_admin(&env);
        storage::set_admin(&env, &new_admin);
        storage::extend_instance_ttl(&env);

        events::emit_admin_changed(&env, &old_admin, &new_admin);
    }

    /// Upgrade the contract WASM. Only admin can call.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        access::require_admin(&env);
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        let version = storage::get_version(&env) + 1;
        storage::set_version(&env, version);
    }

    /// Return the current contract version.
    pub fn version(env: Env) -> u32 {
        storage::get_version(&env)
    }
}

#[cfg(test)]
mod test;
