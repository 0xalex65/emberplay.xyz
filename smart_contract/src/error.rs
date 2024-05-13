use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid amount: Amount must be greater than zero.")]
    InvalidAmount {},

    #[error("No tickets have been purchased for this round.")]
    NoTickets {},

    #[error("No winner could be selected in the lottery.")]
    NoWinnerFound {},

    #[error("Too early to draw a new lottery round")]
    TooEarly {},
}
