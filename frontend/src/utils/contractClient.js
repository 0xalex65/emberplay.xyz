import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const rpcUrl = process.env.REACT_APP_RPC_URL;
const denom = "ustars";
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// Function to create a Signing CosmWasm Client for transactions and queries
export async function getSigningClient(signer) {
  return SigningCosmWasmClient.connectWithSigner(rpcUrl, signer);
}

// Function to buy tickets in the lottery
export async function buyLotteryTickets(client, senderAddress, amount) {
  const executeMsg = { BuyTickets: { amount } };

  const fee = {
    amount: [{ denom, amount: "5000" }], // Adjust according to expected gas fees
    gas: "200000",
  };

  const funds = [{ denom: "ustars", amount: amount.toString() }];

  return await client.execute(
    senderAddress,
    contractAddress,
    executeMsg,
    fee,
    "Buy tickets",
    funds
  );
}

// Function to execute the lottery draw
export async function executeLotteryDraw(client, senderAddress) {
  const executeMsg = "ExecuteLottery";

  const fee = {
    amount: [{ denom, amount: "5000" }],
    gas: "200000",
  };

  return client.execute(senderAddress, contractAddress, executeMsg, fee);
}

// Query the current round details
export async function queryCurrentRound(client) {
  const queryMsg = "CurrentRound";
  return await client.queryContractSmart(contractAddress, queryMsg);
}

// Query the current user's tickets
export async function queryMyTickets(client, userAddress) {
  const queryMsg = { MyTickets: { user: userAddress } };
  return await client.queryContractSmart(contractAddress, queryMsg);
}

// Query past winners by round number
export async function queryPastWinners(client, roundNumber) {
  const queryMsg = { PastWinners: { round_number: roundNumber } };
  return await client.queryContractSmart(contractAddress, queryMsg);
}

// Query left time until next round
export async function queryLeftTime(client) {
  const queryMsg = "LeftTime";
  return await client.queryContractSmart(contractAddress, queryMsg);
}
