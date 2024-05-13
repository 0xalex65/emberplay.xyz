const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {} });
const port = 8000;
const maxRetries = 3;
const rpcUrl = "https://rpc.elgafar-1.stargaze-apis.com"; // Example RPC URL
const contractAddress =
  "stars180t5nlw3su2d77hlmvpvvky85alt5z72jtycx3xyd6qgtkaamlusldmxvx"; // Your contract address

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

// Middleware to initialize the CosmWasm client
async function clientMiddleware(req, res, next) {
  const mnemonic =
    "obtain lend client hospital creek famous meat foster distance sell yard spatial"; // Ensure this is securely stored
  if (!mnemonic) {
    return res.status(500).send("Mnemonic is not configured properly.");
  }
  try {
    req.cosmWasmClient = await getCosmWasmClient(mnemonic);
    next();
  } catch (error) {
    console.error("Error setting up CosmWasm client:", error);
    res.status(500).send("Failed to set up blockchain client.");
  }
}

app.get("/current-round", clientMiddleware, async (req, res) => {
  try {
    const query = { current_round: {} };
    const result = await req.cosmWasmClient.queryContractSmart(
      contractAddress,
      query
    );
    res.json(result);
  } catch (error) {
    console.error("Error querying current round:", error);
    res.status(500).send("Error querying current round.");
  }
});

io.on("connection", async (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("BoughtTickets", async () => {
    try {
      const client = await getCosmWasmClient(
        "obtain lend client hospital creek famous meat foster distance sell yard spatial"
      );
      const query = "CurrentRound";
      const result = await client.queryContractSmart(contractAddress, query);
      socket.emit("update_current_round", result);
    } catch (error) {
      socket.emit("error", "Failed to fetch current round data");
      console.error("Error fetching current round for socket:", error);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
