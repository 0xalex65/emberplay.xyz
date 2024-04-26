use cosmwasm_std::{Addr, Coin, Uint128};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg {
    pub owner: Addr,
    pub fee_percentage: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ExecuteMsg {
    Deposit { amount: Uint128, denom: String },
    DrawLottery,
    ClaimPrize { winner: Addr },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum QueryMsg {
    GetLotteryStatus,
}
