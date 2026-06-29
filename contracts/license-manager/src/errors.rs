use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum LicenseError {
    AlreadyInitialized = 200,
    NotInitialized = 201,
    Unauthorized = 202,
    AssetNotFound = 203,
    LicenseNotFound = 204,
    TemplateNotFound = 205,
    LicenseExpired = 206,
    LicenseRevoked = 207,
    MaxUsesReached = 208,
    InvalidInput = 209,
    InsufficientPayment = 210,
    InvalidFeeBps = 211,
}
