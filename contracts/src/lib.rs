use cosmwasm_std::{
  entry_point, to_binary, BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, CosmosMsg, WasmMsg, ContractInfo
};
use cosmwasm_storage::{singleton, singleton_read};
use cw_storage_plus::Item;
use serde::{Deserialize, Serialize};
use rand_chacha::{rand_core::SeedableRng, ChaChaRng};
use sha2::{Digest, Sha256};

const OWNER_FEE_PERCENTAGE: u128 = 2;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg {
  pub owner: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ExecuteMsg {
  BuyTicket { amount: Uint128 },
  EndRound {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct QueryMsg {}

static CONFIG_KEY: &[u8] = b"config";
static POT_KEY: &[u8] = b"pot";
static TICKET_KEY: &[u8] = b"ticket";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State {
  pub owner: String,
  pub pot: Uint128,
  pub ticket_count: u32,
}

#[entry_point]
pub fn instantiate(
  deps: DepsMut,
  _env: Env,
  _info: MessageInfo,
  msg: InstantiateMsg,
) -> StdResult<Response> {
  let state = State {
      owner: msg.owner,
      pot: Uint128::zero(),
      ticket_count: 0,
  };
  singleton(deps.storage, CONFIG_KEY).save(&state)?;
  Ok(Response::default())
}

#[entry_point]
pub fn execute(
  deps: DepsMut,
  env: Env,
  info: MessageInfo,
  msg: ExecuteMsg,
) -> StdResult<Response> {
  match msg {
      ExecuteMsg::BuyTicket { amount } => try_buy_ticket(deps, info, amount),
      ExecuteMsg::EndRound {} => try_end_round(deps, env),
  }
}

fn try_buy_ticket(
  deps: DepsMut,
  info: MessageInfo,
  amount: Uint128,
) -> StdResult<Response> {
  let mut state = singleton(deps.storage, CONFIG_KEY).load()?;
  state.pot += amount;
  state.ticket_count += 1; // Each STARS token buys one ticket
  singleton(deps.storage, CONFIG_KEY).save(&state)?;
  Ok(Response::new().add_attribute("action", "buy_ticket").add_attribute("tickets_bought", "1"))
}

fn try_end_round(
  deps: DepsMut,
  env: Env,
) -> StdResult<Response> {
  let state = singleton_read(deps.storage, CONFIG_KEY).load()?;
  let seed = Sha256::digest(env.block.time.to_be_bytes()).to_vec();
  let mut rng = ChaChaRng::from_seed(seed.try_into().unwrap());
  let winner_index = rng.gen_range(0..state.ticket_count) as usize;

  let ticket_holder = "ticket_holder_placeholder"; // Placeholder: Implement logic to select a ticket holder

  let fee = (state.pot.u128() * OWNER_FEE_PERCENTAGE) / 100;
  let payout = state.pot.u128() - fee;

  let payment_to_winner = BankMsg::Send {
      to_address: ticket_holder.to_string(),
      amount: vec![Coin {
          denom: "stars".to_string(),
          amount: Uint128::from(payout),
      }],
  };

  let payment_to_owner = BankMsg::Send {
      to_address: state.owner.clone(),
      amount: vec![Coin {
          denom: "stars".to_string(),
          amount: Uint128::from(fee),
      }],
  };

  Ok(Response::new()
      .add_message(payment_to_winner)
      .add_message(payment_to_owner)
      .add_attribute("action", "end_round")
      .add_attribute("winner", ticket_holder)
      .add_attribute("payout", payout.to_string()))
}

#[entry_point]
pub fn query(_deps: Deps, _env: Env, _msg: QueryMsg) -> StdResult<Binary> {
  to_binary(&"Query functionality not implemented yet")
}
