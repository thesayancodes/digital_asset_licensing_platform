#![no_std]

mod access;
mod errors;
mod events;
mod royalties;
mod storage;
mod types;

use soroban_sdk::{contract, contractimpl, panic_with_error, Address, BytesN, Env, Vec};

use errors::LicenseError;
use types::{License, LicenseStatus, LicenseTemplate, LicenseType, RoyaltyRecord};

// Import the AssetRegistry contract WASM for cross-contract calls
mod asset_registry_contract {
    soroban_sdk::contractimport!(
        file = "../target/wasm32v1-none/release/asset_registry.wasm"
    );
}

#[contract]
pub struct LicenseManagerContract;

#[contractimpl]
impl LicenseManagerContract {
    /// Initialize the license manager with admin, asset registry address, and platform fee.
    pub fn initialize(env: Env, admin: Address, asset_registry: Address, fee_bps: u32) {
        if storage::has_admin(&env) {
            panic_with_error!(&env, LicenseError::AlreadyInitialized);
        }

        if fee_bps > 5000 {
            panic_with_error!(&env, LicenseError::InvalidFeeBps);
        }

        storage::set_admin(&env, &admin);
        storage::set_asset_registry(&env, &asset_registry);
        storage::set_platform_fee_bps(&env, fee_bps);
        storage::set_version(&env, 1);
        storage::set_license_count(&env, 0);
        storage::extend_instance_ttl(&env);
    }

    /// Create a license template for an asset. Only the asset owner can create templates.
    pub fn create_license_template(
        env: Env,
        caller: Address,
        asset_id: u64,
        license_type: LicenseType,
        price: i128,
        max_uses: u32,
        duration_days: u64,
    ) {
        caller.require_auth();

        // Verify asset exists and caller is owner via cross-contract call
        let registry_addr = storage::get_asset_registry(&env);
        let registry_client = asset_registry_contract::Client::new(&env, &registry_addr);
        let asset_info = registry_client.verify_asset(&asset_id);

        if asset_info.owner != caller {
            panic_with_error!(&env, LicenseError::Unauthorized);
        }

        let template = LicenseTemplate {
            asset_id,
            license_type: license_type.clone(),
            price,
            max_uses,
            duration_days,
            active: true,
        };

        storage::set_template(&env, asset_id, &template);
        storage::extend_instance_ttl(&env);

        events::emit_template_created(&env, asset_id, &license_type, price);
    }

    /// Purchase a license for an asset. Returns the new license ID.
    pub fn purchase_license(
        env: Env,
        buyer: Address,
        asset_id: u64,
        license_type: LicenseType,
    ) -> u64 {
        buyer.require_auth();

        // Get the template
        let template = match storage::get_template(&env, asset_id) {
            Some(t) => t,
            None => panic_with_error!(&env, LicenseError::TemplateNotFound),
        };

        if !template.active {
            panic_with_error!(&env, LicenseError::TemplateNotFound);
        }

        // Verify asset via cross-contract call to get owner info
        let registry_addr = storage::get_asset_registry(&env);
        let registry_client = asset_registry_contract::Client::new(&env, &registry_addr);
        let asset_info = registry_client.verify_asset(&asset_id);

        // Calculate expiration
        let now = env.ledger().timestamp();
        let duration_secs = template.duration_days * 86400;
        let expires_at = now + duration_secs;

        // Create the license
        let license_id = storage::increment_license_count(&env);

        let license = License {
            id: license_id,
            asset_id,
            license_type,
            buyer: buyer.clone(),
            status: LicenseStatus::Active,
            purchase_price: template.price,
            purchased_at: now,
            expires_at,
        };

        storage::set_license(&env, license_id, &license);
        storage::add_asset_license(&env, asset_id, license_id);
        storage::add_user_license(&env, &buyer, license_id);

        // Calculate royalty and platform fee
        let fee_bps = storage::get_platform_fee_bps(&env);
        let royalty_amount = royalties::calculate_royalty(template.price, asset_info.royalty_bps);
        let platform_fee = royalties::calculate_platform_fee(template.price, fee_bps);

        // Store royalty record
        let record = RoyaltyRecord {
            license_id,
            asset_owner: asset_info.owner.clone(),
            royalty_amount,
            platform_fee,
            distributed_at: now,
        };
        storage::set_royalty_record(&env, license_id, &record);
        storage::extend_instance_ttl(&env);

        // Emit events
        events::emit_license_purchased(&env, license_id, asset_id, &buyer, template.price);
        events::emit_royalty_distributed(&env, asset_id, &asset_info.owner, royalty_amount);

        license_id
    }

    /// Verify a license is valid. Returns the license, checking expiry.
    pub fn verify_license(env: Env, license_id: u64) -> License {
        if !storage::has_license(&env, license_id) {
            panic_with_error!(&env, LicenseError::LicenseNotFound);
        }

        let mut license = storage::get_license(&env, license_id);

        // Check if expired
        if license.status == LicenseStatus::Active {
            let now = env.ledger().timestamp();
            if now > license.expires_at {
                license.status = LicenseStatus::Expired;
                storage::set_license(&env, license_id, &license);
            }
        }

        license
    }

    /// Revoke a license. Must be asset owner or admin.
    pub fn revoke_license(env: Env, caller: Address, license_id: u64) {
        caller.require_auth();

        if !storage::has_license(&env, license_id) {
            panic_with_error!(&env, LicenseError::LicenseNotFound);
        }

        let mut license = storage::get_license(&env, license_id);

        // Verify caller is asset owner or admin
        let admin = storage::get_admin(&env);
        let registry_addr = storage::get_asset_registry(&env);
        let registry_client = asset_registry_contract::Client::new(&env, &registry_addr);
        let asset_info = registry_client.verify_asset(&license.asset_id);

        if caller != asset_info.owner && caller != admin {
            panic_with_error!(&env, LicenseError::Unauthorized);
        }

        license.status = LicenseStatus::Revoked;
        storage::set_license(&env, license_id, &license);
        storage::extend_instance_ttl(&env);

        events::emit_license_revoked(&env, license_id);
    }

    /// Get a license by ID.
    pub fn get_license(env: Env, license_id: u64) -> License {
        if !storage::has_license(&env, license_id) {
            panic_with_error!(&env, LicenseError::LicenseNotFound);
        }
        storage::get_license(&env, license_id)
    }

    /// Get all license IDs for a user.
    pub fn get_user_licenses(env: Env, user: Address) -> Vec<u64> {
        storage::get_user_licenses(&env, &user)
    }

    /// Get all license IDs for an asset.
    pub fn get_asset_licenses(env: Env, asset_id: u64) -> Vec<u64> {
        storage::get_asset_licenses(&env, asset_id)
    }

    /// Get the license template for an asset.
    pub fn get_template(env: Env, asset_id: u64) -> LicenseTemplate {
        match storage::get_template(&env, asset_id) {
            Some(t) => t,
            None => panic_with_error!(&env, LicenseError::TemplateNotFound),
        }
    }

    /// Set the platform fee in basis points. Only admin. Max 5000 (50%).
    pub fn set_platform_fee(env: Env, fee_bps: u32) {
        access::require_admin(&env);

        if fee_bps > 5000 {
            panic_with_error!(&env, LicenseError::InvalidFeeBps);
        }

        storage::set_platform_fee_bps(&env, fee_bps);
        storage::extend_instance_ttl(&env);
    }

    /// Upgrade the contract WASM. Only admin.
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
