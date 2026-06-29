use soroban_sdk::{symbol_short, Address, Env};

use crate::types::LicenseType;

pub fn emit_template_created(env: &Env, asset_id: u64, license_type: &LicenseType, price: i128) {
    env.events().publish(
        (symbol_short!("tmpl_new"), asset_id),
        (license_type.clone(), price),
    );
}

pub fn emit_license_purchased(
    env: &Env,
    license_id: u64,
    asset_id: u64,
    buyer: &Address,
    price: i128,
) {
    env.events().publish(
        (symbol_short!("lic_buy"), license_id),
        (asset_id, buyer.clone(), price),
    );
}

pub fn emit_license_revoked(env: &Env, license_id: u64) {
    env.events().publish(
        (symbol_short!("lic_rev"), license_id),
        (),
    );
}

pub fn emit_royalty_distributed(env: &Env, asset_id: u64, owner: &Address, amount: i128) {
    env.events().publish(
        (symbol_short!("royalty"), asset_id),
        (owner.clone(), amount),
    );
}
