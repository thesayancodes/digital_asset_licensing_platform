use soroban_sdk::{symbol_short, Address, Env, String};

use crate::types::AssetStatus;

pub fn emit_asset_registered(env: &Env, asset_id: u64, owner: &Address, content_hash: &String) {
    env.events().publish(
        (symbol_short!("register"), asset_id),
        (owner.clone(), content_hash.clone()),
    );
}

pub fn emit_asset_transferred(env: &Env, asset_id: u64, from: &Address, to: &Address) {
    env.events().publish(
        (symbol_short!("transfer"), asset_id),
        (from.clone(), to.clone()),
    );
}

pub fn emit_asset_status_changed(env: &Env, asset_id: u64, status: &AssetStatus) {
    env.events()
        .publish((symbol_short!("status"), asset_id), status.clone());
}

pub fn emit_admin_changed(env: &Env, old_admin: &Address, new_admin: &Address) {
    env.events().publish(
        (symbol_short!("admin"),),
        (old_admin.clone(), new_admin.clone()),
    );
}
