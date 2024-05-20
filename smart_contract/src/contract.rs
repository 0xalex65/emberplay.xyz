use crate::error::ContractError;
use crate::msg::{
    CurrentRoundResponse, ExecuteMsg, InstantiateMsg, LeftTimeResponse, MyTicketsResponse,
    PastRoundsResponse, PastWinnersResponse, QueryMsg,
};
use crate::state::{LotteryRound, Ticket, CURRENT_ROUND, NEXT_DRAW, OWNER, PAST_ROUNDS};
use cosmwasm_std::{
    entry_point, to_json_binary, BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Order,
    Response, StdError, StdResult, Uint128,
};

const TICKET_PRICE: u128 = 1_000_000; // Assuming 1 STARS = 1_000_000 units

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let initial_owner = info.sender.clone();

    // Initialize empty current round and store owner address
    let initial_round: LotteryRound = LotteryRound {
        index: Uint128::one(),
        tickets: vec![],
        winner: None,
        pot: Uint128::zero(),
    };

    CURRENT_ROUND.save(deps.storage, &initial_round)?;
    OWNER.save(deps.storage, &initial_owner)?;

    let next_draw = env.block.time.seconds() + 60 * 60; // 60 minutes in seconds
    NEXT_DRAW.save(deps.storage, &next_draw)?;

    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::BuyTickets { amount } => execute_buy_tickets(deps, info, amount),
        ExecuteMsg::ExecuteLottery => execute_lottery(deps, env),
    }
}

fn execute_buy_tickets(
    deps: DepsMut,
    info: MessageInfo,
    amount: u128,
) -> Result<Response, ContractError> {
    let ticket_count = amount / TICKET_PRICE;
    if ticket_count == 0 {
        return Err(ContractError::InvalidAmount {});
    }

    CURRENT_ROUND.update(deps.storage, |mut round| -> StdResult<_> {
        let owner_addr = info.sender;
        let existing = round.tickets.iter_mut().find(|t| t.owner == owner_addr);

        if let Some(ticket) = existing {
            ticket.count += ticket_count as u64;
        } else {
            round.tickets.push(Ticket {
                owner: owner_addr,
                count: ticket_count as u64,
            });
        }

        round.pot += Uint128::from(amount);

        Ok(round)
    })?;

    Ok(Response::new().add_attribute("action", "buy_tickets"))
}

fn execute_lottery(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    // Ensure the current time is past the next draw time
    let next_draw = NEXT_DRAW.load(deps.storage)?;
    if env.block.time.seconds() < next_draw {
        return Err(ContractError::TooEarly {});
    }

    // Perform lottery logic as before (select winner, send rewards, etc.)
    let mut current_round = CURRENT_ROUND.load(deps.storage)?;
    let ticket_sum: u64 = current_round.tickets.iter().map(|t| t.count).sum();

    if ticket_sum == 0 {
        // Update next draw time
        let new_draw_time = env.block.time.seconds() + 60 * 60;
        NEXT_DRAW.save(deps.storage, &new_draw_time)?;
        
        return Ok(Response::new().add_attribute("next_draw", new_draw_time.to_string()));
    }

    // Random value generation
    let random_value = env.block.time.seconds() % ticket_sum;
    let mut cumulative_count = 0;
    let mut winner_addr = None;

    for ticket in &current_round.tickets {
        cumulative_count += ticket.count;
        if cumulative_count > random_value {
            winner_addr = Some(ticket.owner.clone());
            break;
        }
    }

    if let Some(winner) = winner_addr {
        // Reward distribution
        let total_pot = current_round.pot;
        let winner_reward = total_pot.multiply_ratio(98u128, 100u128);
        let owner_fee = total_pot.multiply_ratio(1u128, 100u128);

        let owner = OWNER.load(deps.storage)?;

        let send_messages = vec![
            BankMsg::Send {
                to_address: winner.to_string(),
                amount: vec![Coin {
                    denom: "ustars".to_string(),
                    amount: winner_reward,
                }],
            },
            BankMsg::Send {
                to_address: owner.to_string(),
                amount: vec![Coin {
                    denom: "ustars".to_string(),
                    amount: owner_fee,
                }],
            },
        ];

        current_round.winner = Some(winner.clone());
        CURRENT_ROUND.save(deps.storage, &current_round)?;

        PAST_ROUNDS.save(deps.storage, env.block.height, &current_round)?;
        CURRENT_ROUND.save(
            deps.storage,
            &LotteryRound {
                index: current_round.index + Uint128::new(1),
                tickets: vec![],
                winner: Some(winner.clone()),
                pot: Uint128::zero(),
            },
        )?;

        // Update next draw time
        let new_draw_time = env.block.time.seconds() + 60 * 60;
        NEXT_DRAW.save(deps.storage, &new_draw_time)?;

        Ok(Response::new()
            .add_messages(send_messages)
            .add_attribute("action", "execute_lottery")
            .add_attribute("winner", winner.to_string()))
    } else {
        Err(ContractError::NoWinnerFound {})
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::CurrentRound => to_json_binary(&query_current_round(deps)?),
        QueryMsg::MyTickets { user } => to_json_binary(&query_my_current_tickets(deps, user)?),
        QueryMsg::PastWinners { round_number } => {
            to_json_binary(&query_past_winners(deps, round_number)?)
        }
        QueryMsg::LeftTime => to_json_binary(&query_left_time(deps)?),
        QueryMsg::AllPastRounds => to_json_binary(&query_all_past_rounds(deps)?),
    }
}

fn query_current_round(deps: Deps) -> StdResult<CurrentRoundResponse> {
    let round = CURRENT_ROUND.load(deps.storage)?;
    Ok(CurrentRoundResponse {
        index: round.index,
        tickets: round.tickets,
        pot: round.pot,
    })
}

fn query_my_current_tickets(deps: Deps, user: Option<String>) -> StdResult<MyTicketsResponse> {
    let round = CURRENT_ROUND.load(deps.storage)?;

    let sender_addr = match user {
        Some(addr) => deps.api.addr_validate(&addr)?,
        None => return Err(StdError::generic_err("User address required")),
    };

    // Find tickets owned by the user
    let user_tickets = round
        .tickets
        .iter()
        .find(|&ticket| ticket.owner == sender_addr)
        .map(|ticket| ticket.count)
        .unwrap_or(0);

    Ok(MyTicketsResponse {
        user: sender_addr.to_string(),
        count: user_tickets,
    })
}

fn query_past_winners(deps: Deps, round_number: u64) -> StdResult<PastWinnersResponse> {
    let round = PAST_ROUNDS.load(deps.storage, round_number)?;
    Ok(PastWinnersResponse {
        tickets: round.tickets,
        winner: round.winner.map(|w| w.to_string()),
        pot: round.pot,
    })
}

fn query_left_time(deps: Deps) -> StdResult<LeftTimeResponse> {
    let time = NEXT_DRAW.load(deps.storage)?;
    Ok(LeftTimeResponse { time })
}

fn query_all_past_rounds(deps: Deps) -> StdResult<PastRoundsResponse> {
    let rounds: Vec<LotteryRound> = PAST_ROUNDS
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| item.map(|(_key, value)| value))
        .collect::<StdResult<Vec<LotteryRound>>>()?;
    Ok(PastRoundsResponse { rounds })
}
