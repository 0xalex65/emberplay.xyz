use crate::state::{LotteryRound, Ticket};
use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    BuyTickets { amount: u128 },
    ExecuteLottery,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum QueryMsg {
    CurrentRound,
    MyTickets { user: Option<String> },
    PastWinners { round_number: u64 },
    LeftTime,
    AllPastRounds
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CurrentRoundResponse {
    pub index: Uint128,
    pub tickets: Vec<Ticket>,
    pub pot: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MyTicketsResponse {
    pub user: String,
    pub count: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PastWinnersResponse {
    pub tickets: Vec<Ticket>,
    pub winner: Option<String>,
    pub pot: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct LeftTimeResponse {
    pub time: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PastRoundsResponse {
    pub rounds: Vec<LotteryRound>,
}
