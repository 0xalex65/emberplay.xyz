use cosmwasm_std::{
    attr, entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, BankMsg, Coin, Uint128,
};
use crate::msg::{InstantiateMsg, ExecuteMsg, QueryMsg};
use crate::state::{config, config_read, State};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        owner: msg.owner,
        pool: Uint128::zero(),
        last_draw: env.block.time.seconds(),
        fee_percentage: msg.fee_percentage,
        ticket_price_usd: 1,
        ticket_counts: Vec::new(),
    };
    config(deps.storage).save(&state)?;
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
        ExecuteMsg::Deposit { amount, denom } => try_deposit(deps, env, info, amount, denom),
        ExecuteMsg::DrawLottery => try_draw_lottery(deps, env, info),
        ExecuteMsg::ClaimPrize { winner } => try_claim_prize(deps, env, info, winner),
    }
}

fn try_deposit(deps: DepsMut, env: Env, info: MessageInfo, amount: Uint128, denom: String) -> StdResult<Response> {
    let mut state = config(deps.storage).load()?;

    // Calculate the USD value based on the token and amount
    let usd_value = calculate_usd_value(amount, &denom)?;
    let tickets = usd_value / state.ticket_price_usd;  // Calculate how many tickets this amount buys

    // Check for the presence of the depositor in the ticket holders list and update or add accordingly
    let mut found = false;
    for ticket_holder in &mut state.ticket_counts {
        if ticket_holder.address == info.sender {
            ticket_holder.tickets += tickets as u64;
            found = true;
            break;
        }
    }

    if !found {
        state.ticket_counts.push(TicketHolder {
            address: info.sender.clone(),
            tickets: tickets as u64,
        });
    }

    // Update the pool with the new deposit
    state.pool += amount;
    config(deps.storage).save(&state)?;

    Ok(Response::new()
        .add_attributes(vec![
            attr("method", "try_deposit"),
            attr("depositor", info.sender.as_str()),
            attr("amount", amount.to_string()),
            attr("denom", denom),
            attr("tickets_issued", tickets.to_string()),
        ])
        .add_message(BankMsg::Send {
            to_address: state.owner.to_string(),
            amount: vec![Coin { denom, amount }],
        }))
}

fn try_draw_lottery(deps: DepsMut, env: Env, info: MessageInfo) -> StdResult<Response> {
    let mut state = config(deps.storage).load()?;

    // Ensure only the owner can trigger the draw (or adapt according to your security model)
    if info.sender != state.owner {
        return Err(cosmwasm_std::StdError::Unauthorized { backtrace: None });
    }

    // Check if 60 minutes have passed since the last draw
    let current_time = env.block.time.seconds();
    if current_time < state.last_draw + 3600 {
        return Err(cosmwasm_std::StdError::GenericErr {
            msg: "The draw can only be run every 60 minutes".to_string(),
            backtrace: None,
        });
    }

    // Proceed with drawing the lottery if there are tickets
    if state.ticket_counts.is_empty() {
        return Err(cosmwasm_std::StdError::GenericErr {
            msg: "No tickets sold".to_string(),
            backtrace: None,
        });
    }

    // Simulate a random draw based on ticket weights
    let total_tickets: u64 = state.ticket_counts.iter().map(|th| th.tickets).sum();
    let mut rng = rand::thread_rng();
    let winning_ticket = rand::Rng::gen_range(&mut rng, 0..total_tickets);
    let mut current_ticket = 0;

    let mut winner: Option<Addr> = None;
    for holder in &state.ticket_counts {
        current_ticket += holder.tickets;
        if current_ticket > winning_ticket {
            winner = Some(holder.address.clone());
            break;
        }
    }

    // Calculate prize and fee
    let prize = state.pool;
    let fee = Uint128::from((prize.u128() * state.fee_percentage as u128) / 100);
    let prize_after_fee = prize - fee;

    // Reset state for the next draw
    state.last_draw = current_time;
    state.pool = Uint128::zero();
    state.ticket_counts.clear();
    config(deps.storage).save(&state)?;

    // Send prize to winner and fee to owner
    let winner_addr = winner.ok_or(cosmwasm_std::StdError::GenericErr {
        msg: "Failed to determine a winner".to_string(),
        backtrace: None,
    })?;
    let messages: Vec<CosmosMsg> = vec![
        BankMsg::Send {
            to_address: winner_addr.to_string(),
            amount: vec![Coin { denom: "ustars".to_string(), amount: prize_after_fee }],
        }.into(),
        BankMsg::Send {
            to_address: state.owner.to_string(),
            amount: vec![Coin { denom: "ustars".to_string(), amount: fee }],
        }.into(),
    ];

    Ok(Response::new()
        .add_messages(messages)
        .add_attributes(vec![
            attr("action", "draw_lottery"),
            attr("winner", winner_addr.as_str()),
            attr("prize", prize_after_fee.to_string()),
            attr("fee", fee.to_string()),
        ]))
}

fn try_claim_prize(deps: DepsMut, _env: Env, info: MessageInfo, winner: Addr) -> StdResult<Response> {
    let mut state = config(deps.storage).load()?;

    // Determine if the message sender is the winner
    if info.sender != winner {
        return Err(cosmwasm_std::StdError::Unauthorized { backtrace: None });
    }

    // Ensure there is a prize to claim
    if state.pool.is_zero() {
        return Err(cosmwasm_std::StdError::GenericErr {
            msg: "No prize available to claim".to_string(),
            backtrace: None,
        });
    }

    // Calculate the prize and fee
    let prize = state.pool;
    let fee = Uint128::from((prize.u128() * state.fee_percentage as u128) / 100);
    let prize_after_fee = prize - fee;

    // Reset the pool to zero after claiming
    state.pool = Uint128::zero();
    config(deps.storage).save(&state)?;

    // Send the prize to the winner
    let messages: Vec<CosmosMsg> = vec![
        BankMsg::Send {
            to_address: winner.to_string(),
            amount: vec![Coin { denom: "ustars".to_string(), amount: prize_after_fee }],
        }.into(),
        // Optionally send the fee to the owner
        BankMsg::Send {
            to_address: state.owner.to_string(),
            amount: vec![Coin { denom: "ustars".to_string(), amount: fee }],
        }.into(),
    ];

    Ok(Response::new()
        .add_messages(messages)
        .add_attributes(vec![
            attr("action", "claim_prize"),
            attr("winner", winner.as_str()),
            attr("prize", prize_after_fee.to_string()),
            attr("fee", fee.to_string()),
        ]))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetLotteryStatus => to_binary(&"Query Lottery Status"),
    }
}
