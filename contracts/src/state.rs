use cosmwasm_std::{Addr, Storage, Uint128};
use cosmwasm_storage::{singleton, singleton_read, Singleton};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State {
    pub owner: Addr,
    pub pool: Uint128,
    pub last_draw: u64,
    pub fee_percentage: u64,
    pub ticket_price_usd: u64,
    pub ticket_counts: Vec<(Addr, u64)>,  // Address and ticket count
}

pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, b"config")
}

pub fn config_read(storage: &dyn Storage) -> Singleton<State> {
    singleton_read(storage, b"config")
}
