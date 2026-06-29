use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AssetError {
    AlreadyInitialized = 100,
    NotInitialized = 101,
    Unauthorized = 102,
    AssetNotFound = 103,
    AssetInactive = 104,
    InvalidInput = 105,
    InvalidRoyaltyBps = 106,
}
