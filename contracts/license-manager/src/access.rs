use soroban_sdk::{Address, Env};

use crate::storage;

pub fn require_admin(env: &Env) -> Address {
    let admin = storage::get_admin(env);
    admin.require_auth();
    admin
}
