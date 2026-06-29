#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};
use types::{AssetStatus, AssetType};

fn setup_env() -> (Env, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(AssetRegistryContract, ());
    let admin = Address::generate(&env);
    let license_contract = Address::generate(&env);
    (env, contract_id, admin, license_contract)
}

fn init_contract(env: &Env, contract_id: &Address, admin: &Address, license_contract: &Address) {
    let client = AssetRegistryContractClient::new(env, contract_id);
    client.initialize(admin, license_contract);
}

#[test]
fn test_initialize_and_register_asset() {
    let (env, contract_id, admin, license_contract) = setup_env();
    let client = AssetRegistryContractClient::new(&env, &contract_id);

    client.initialize(&admin, &license_contract);

    assert_eq!(client.version(), 1);

    let owner = Address::generate(&env);
    let name = String::from_str(&env, "Test Asset");
    let content_hash = String::from_str(&env, "abc123hash");

    let asset_id = client.register_asset(
        &owner,
        &name,
        &content_hash,
        &AssetType::Image,
        &500u32,
    );

    assert_eq!(asset_id, 1);

    let asset = client.get_asset(&asset_id);
    assert_eq!(asset.id, 1);
    assert_eq!(asset.owner, owner);
    assert_eq!(asset.royalty_bps, 500);
    assert_eq!(asset.status, AssetStatus::Active);
    assert_eq!(asset.asset_type, AssetType::Image);
}

#[test]
fn test_transfer_ownership() {
    let (env, contract_id, admin, license_contract) = setup_env();
    let client = AssetRegistryContractClient::new(&env, &contract_id);

    client.initialize(&admin, &license_contract);

    let owner = Address::generate(&env);
    let new_owner = Address::generate(&env);
    let name = String::from_str(&env, "Transfer Test");
    let content_hash = String::from_str(&env, "hash456");

    let asset_id = client.register_asset(
        &owner,
        &name,
        &content_hash,
        &AssetType::Audio,
        &1000u32,
    );

    client.transfer_asset(&asset_id, &owner, &new_owner);

    let asset = client.get_asset(&asset_id);
    assert_eq!(asset.owner, new_owner);

    let new_owner_assets = client.get_owner_assets(&new_owner);
    assert_eq!(new_owner_assets.len(), 1);
    assert_eq!(new_owner_assets.get(0).unwrap(), asset_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #102)")]
fn test_unauthorized_transfer_fails() {
    let (env, contract_id, admin, license_contract) = setup_env();
    let client = AssetRegistryContractClient::new(&env, &contract_id);

    client.initialize(&admin, &license_contract);

    let owner = Address::generate(&env);
    let not_owner = Address::generate(&env);
    let new_owner = Address::generate(&env);
    let name = String::from_str(&env, "Auth Test");
    let content_hash = String::from_str(&env, "hash789");

    let asset_id = client.register_asset(
        &owner,
        &name,
        &content_hash,
        &AssetType::Document,
        &200u32,
    );

    // Try to transfer from not_owner — should fail with Unauthorized
    client.transfer_asset(&asset_id, &not_owner, &new_owner);
}

#[test]
fn test_verify_asset_returns_info() {
    let (env, contract_id, admin, license_contract) = setup_env();
    let client = AssetRegistryContractClient::new(&env, &contract_id);

    client.initialize(&admin, &license_contract);

    let owner = Address::generate(&env);
    let name = String::from_str(&env, "Verify Test");
    let content_hash = String::from_str(&env, "verifyhash");

    let asset_id = client.register_asset(
        &owner,
        &name,
        &content_hash,
        &AssetType::Video,
        &750u32,
    );

    let info = client.verify_asset(&asset_id);
    assert_eq!(info.id, asset_id);
    assert_eq!(info.owner, owner);
    assert_eq!(info.status, AssetStatus::Active);
    assert_eq!(info.royalty_bps, 750);
}
