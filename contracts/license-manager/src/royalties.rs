/// Calculate the royalty amount from a price and royalty basis points.
/// royalty_bps: 100 = 1%, 10000 = 100%
pub fn calculate_royalty(price: i128, royalty_bps: u32) -> i128 {
    (price * royalty_bps as i128) / 10000
}

/// Calculate the platform fee from a price and fee basis points.
/// fee_bps: 100 = 1%, 5000 = 50% (max allowed)
pub fn calculate_platform_fee(price: i128, fee_bps: u32) -> i128 {
    (price * fee_bps as i128) / 10000
}
