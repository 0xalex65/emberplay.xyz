const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {} });
const port = process.env.PORT || 8000;
const maxRetries = 10;
const walletMnemonic = process.env.WALLET_MNEMONIC;
const rpcUrl = "https://rpc.elgafar-1.stargaze-apis.com";
const contractAddress = process.env.CONTRACT_ADDRESS;

let adminWalletAddress;

async function getCosmWasmClient(mnemonic, retries = 0) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "stars",
    });

    const accounts = await wallet.getAccounts();
    adminWalletAddress = accounts[0].address;

    const client = await SigningCosmWasmClient.connectWithSigner(
      rpcUrl,
      wallet
    );
    return client;
  } catch (error) {
    console.error("Attempt", retries, "failed:", error);
    if (retries < maxRetries) {
      console.log("Retrying to connect...");
      return getCosmWasmClient(mnemonic, retries + 1);
    } else {
      throw new Error(
        "Failed to initialize blockchain client after multiple attempts."
      );
    }
  }
}

io.on("connection", async (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("buy_tickets", async () => {
    const client = await getCosmWasmClient(walletMnemonic);
    await queryCurrentRound(client);
  });
});

async function queryCurrentRound(client) {
  try {
    const query = "CurrentRound";
    const result = await client.queryContractSmart(contractAddress, query);
    io.emit("update_current_round", result);
  } catch (error) {
    io.emit("error", "Failed to fetch current round data");
    console.error("Error fetching current round for socket:", error);
  }
}

async function queryLeftTime(client) {
  try {
    const query = "LeftTime";
    const result = await client.queryContractSmart(contractAddress, query);
    io.emit("update_left_time", result);
  } catch (error) {
    io.emit("error", "Failed to fetch left time until next round");
    console.error("Error fetching left time until next round:", error);
  }
}

async function executeLottery(client) {
  try {
    const fee = {
      amount: [{ denom: "ustars", amount: "5000" }],
      gas: "200000",
    };
    const executeMsg = "ExecuteLottery";
    const response = await client.execute(
      adminWalletAddress,
      contractAddress,
      executeMsg,
      fee
    );
    console.log("Lottery executed:", response.transactionHash);
  } catch (error) {
    console.error("Failed to execute lottery:", error);
  }
}

async function startLotteryDraw() {
  const client = await getCosmWasmClient(walletMnemonic);
  setInterval(async () => {
    await executeLottery(client);
    queryCurrentRound(client);
    queryLeftTime(client);
  }, 3600000);
}

server.listen(port, async () => {
  await startLotteryDraw();
  console.log(`Server running on http://localhost:${port}`);
});
