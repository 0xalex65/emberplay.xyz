use cosmwasm_std::{Addr, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Ticket {
    pub owner: Addr,
    pub count: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct LotteryRound {
    pub index: Uint128,
    pub tickets: Vec<Ticket>,
    pub winner: Option<Addr>,
    pub pot: Uint128,
}

pub const CURRENT_ROUND: Item<LotteryRound> = Item::new("current_round");
pub const PAST_ROUNDS: Map<u64, LotteryRound> = Map::new("past_rounds");
pub const OWNER: Item<Addr> = Item::new("owner");
pub const NEXT_DRAW: Item<u64> = Item::new("next_draw");
pub const REMAINDER_POT: Item<Uint128> = Item::new("remainder_pot");