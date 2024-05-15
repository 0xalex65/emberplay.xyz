import {
  SigningCosmWasmClient,
  CosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

const rpcUrl = process.env.REACT_APP_RPC_URL;
const denom = "ustars";
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const nonSigningClient = await CosmWasmClient.connect(rpcUrl);

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

// Query the current round details
export async function queryCurrentRound() {
  const queryMsg = "CurrentRound";
  return await nonSigningClient.queryContractSmart(contractAddress, queryMsg);
}

// Query the current user's tickets
export async function queryMyTickets(client, userAddress) {
  const queryMsg = { MyTickets: { user: userAddress } };
  return await client.queryContractSmart(contractAddress, queryMsg);
}

// Query past winners by round number
export async function queryPastWinners(roundNumber) {
  const queryMsg = { PastWinners: { round_number: roundNumber } };
  return await nonSigningClient.queryContractSmart(contractAddress, queryMsg);
}

// Query left time until next round
export async function queryLeftTime() {
  const queryMsg = "LeftTime";
  return await nonSigningClient.queryContractSmart(contractAddress, queryMsg);
}

// Query past rounds
export async function queryPastRounds() {
  const queryMsg = "AllPastRounds";
  return await nonSigningClient.queryContractSmart(contractAddress, queryMsg);
}
