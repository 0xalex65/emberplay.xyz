const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {} });
const port = 8000;
const maxRetries = 3;
const rpcUrl = "https://rpc.elgafar-1.stargaze-apis.com";
const contractAddress =
  "stars1z8tg6h6psf60dez0x6kglu9765mpekxjzpl506pesfdrkgt9fgjq2vcvz2";

async function getCosmWasmClient(mnemonic, retries = 0) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "stars",
    });
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
    const client = await getCosmWasmClient(
      "obtain lend client hospital creek famous meat foster distance sell yard spatial"
    );
    await queryCurrentRound(client);
  });
});

async function queryCurrentRound(client) {
  try {
    const query = "CurrentRound";
    const result = await client.queryContractSmart(contractAddress, query);
    socket.broadcast.emit("update_current_round", result);
    socket.emit("update_current_round", result);
  } catch (error) {
    socket.emit("error", "Failed to fetch current round data");
    console.error("Error fetching current round for socket:", error);
  }
}

async function executeLottery(client) {
  try {
    const executeMsg = "ExecuteLottery";
    const response = await client.execute(
      contractAddress,
      executeMsg,
      "auto-lottery draw"
    );
    console.log("Lottery executed:", response.transactionHash);
  } catch (error) {
    console.error("Failed to execute lottery:", error);
  }
}

async function startLotteryDraw() {
  const client = await getCosmWasmClient(
    "obtain lend client hospital creek famous meat foster distance sell yard spatial"
  );
  setInterval(async () => {
    await executeLottery(client);
    await queryCurrentRound(client);
  }, 3600000); // 3600000 milliseconds = 60 minutes
}

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  startLotteryDraw();
});
