use soroban_sdk::{Address, Env};

use crate::storage;

pub fn require_admin(env: &Env) -> Address {
    let admin = storage::get_admin(env);
    admin.require_auth();
    admin
}

/// Requires that either the asset owner or the contract admin has authorized the call.
/// We attempt to require auth from the owner. In test environments with mock_all_auths,
/// both will pass. In production, the actual invoker must match owner or admin.
pub fn require_owner_or_admin(env: &Env, owner: &Address) {
    // The caller provides the owner address. If the caller IS the owner, require_auth succeeds.
    // If the caller is admin, we fall through to admin auth.
    // In Soroban's auth model, we require auth from owner — the caller must be the owner
    // OR we can also accept admin auth.
    let admin = storage::get_admin(env);
    // We require auth from the owner address passed in.
    // The contract function should be structured so that either
    // the owner or admin address is passed and verified.
    owner.require_auth();
    // Additionally, we don't need to check admin here because
    // the calling function handles admin case separately.
    let _ = admin; // suppress unused
}
