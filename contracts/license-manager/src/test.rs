#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, testutils::Events as _, Address, Env, String};
use types::{LicenseStatus, LicenseType};

mod asset_registry_contract {
    soroban_sdk::contractimport!(file = "../target/wasm32v1-none/release/asset_registry.wasm");
}

struct TestSetup {
    env: Env,
    admin: Address,
    asset_owner: Address,
    asset_reg_id: Address,
    license_mgr_id: Address,
    asset_reg_client: asset_registry_contract::Client<'static>,
    license_mgr_client: LicenseManagerContractClient<'static>,
}

fn setup() -> TestSetup {
    let env = Env::default();
    env.mock_all_auths();

    // Register asset registry from WASM and license manager natively
    let asset_reg_id = env.register(asset_registry_contract::WASM, ());
    let license_mgr_id = env.register(LicenseManagerContract, ());

    let admin = Address::generate(&env);
    let asset_owner = Address::generate(&env);

    let asset_reg_client = asset_registry_contract::Client::new(&env, &asset_reg_id);
    let license_mgr_client = LicenseManagerContractClient::new(&env, &license_mgr_id);

    // Initialize both contracts
    asset_reg_client.initialize(&admin, &license_mgr_id);
    license_mgr_client.initialize(&admin, &asset_reg_id, &250u32); // 2.5% platform fee

    // Register a test asset
    let name = String::from_str(&env, "Test Image");
    let hash = String::from_str(&env, "content_hash_123");
    // AssetType::Image is variant 0 in the imported contract
    asset_reg_client.register_asset(
        &asset_owner,
        &name,
        &hash,
        &asset_registry_contract::AssetType::Image,
        &500u32, // 5% royalty
    );

    TestSetup {
        env,
        admin,
        asset_owner,
        asset_reg_id,
        license_mgr_id,
        asset_reg_client,
        license_mgr_client,
    }
}

#[test]
fn test_create_template_and_purchase() {
    let s = setup();

    // Create a license template
    s.license_mgr_client.create_license_template(
        &s.asset_owner,
        &1u64,
        &LicenseType::Commercial,
        &1000i128,
        &100u32,
        &365u64,
    );

    // Purchase a license
    let buyer = Address::generate(&s.env);
    let license_id = s
        .license_mgr_client
        .purchase_license(&buyer, &1u64, &LicenseType::Commercial);

    assert_eq!(license_id, 1);

    let license = s.license_mgr_client.get_license(&license_id);
    assert_eq!(license.id, 1);
    assert_eq!(license.asset_id, 1);
    assert_eq!(license.buyer, buyer);
    assert_eq!(license.purchase_price, 1000);
    assert_eq!(license.status, LicenseStatus::Active);
}

#[test]
fn test_purchase_emits_events() {
    let s = setup();

    // Create template
    s.license_mgr_client.create_license_template(
        &s.asset_owner,
        &1u64,
        &LicenseType::Personal,
        &500i128,
        &50u32,
        &30u64,
    );

    // Purchase
    let buyer = Address::generate(&s.env);
    let _license_id = s
        .license_mgr_client
        .purchase_license(&buyer, &1u64, &LicenseType::Personal);

    // Verify events were emitted (events().all() returns all events)
    let all_events = s.env.events().all();
    extern crate std;
    assert_ne!(all_events, std::vec::Vec::new());
}

#[test]
fn test_cross_contract_verification() {
    let s = setup();

    // The template creation calls verify_asset cross-contract
    s.license_mgr_client.create_license_template(
        &s.asset_owner,
        &1u64,
        &LicenseType::Enterprise,
        &5000i128,
        &10u32,
        &90u64,
    );

    // Get the template back
    let template = s.license_mgr_client.get_template(&1u64);
    assert_eq!(template.asset_id, 1);
    assert_eq!(template.price, 5000);
    assert_eq!(template.max_uses, 10);
    assert_eq!(template.duration_days, 90);
    assert!(template.active);

    // Purchase also calls verify_asset cross-contract
    let buyer = Address::generate(&s.env);
    let license_id = s
        .license_mgr_client
        .purchase_license(&buyer, &1u64, &LicenseType::Enterprise);

    let license = s.license_mgr_client.get_license(&license_id);
    assert_eq!(license.purchase_price, 5000);
}

#[test]
fn test_revoke_license() {
    let s = setup();

    // Create template and purchase
    s.license_mgr_client.create_license_template(
        &s.asset_owner,
        &1u64,
        &LicenseType::Editorial,
        &200i128,
        &1000u32,
        &180u64,
    );

    let buyer = Address::generate(&s.env);
    let license_id = s
        .license_mgr_client
        .purchase_license(&buyer, &1u64, &LicenseType::Editorial);

    // Verify it's active
    let license = s.license_mgr_client.get_license(&license_id);
    assert_eq!(license.status, LicenseStatus::Active);

    // Revoke (as asset owner)
    s.license_mgr_client
        .revoke_license(&s.asset_owner, &license_id);

    // Verify it's revoked
    let license = s.license_mgr_client.get_license(&license_id);
    assert_eq!(license.status, LicenseStatus::Revoked);
}
