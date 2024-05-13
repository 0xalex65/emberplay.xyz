import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import {
  getSigningClient,
  queryCurrentRound,
  queryMyTickets,
  executeLotteryDraw,
  buyLotteryTickets,
  queryPastWinners,
} from "utils/contractClient";
import { connectKeplr } from "utils/keplr";
const socket = io("http://localhost:8000");

function App() {
  const [address, setAddress] = useState("");
  const [signingClient, setSigningClient] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [myTickets, setMyTickets] = useState(null);
  const [pastWinners, setPastWinners] = useState(null);
  const [roundNumber, setRoundNumber] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend");
    });

    socket.on("update_current_round", (data) => {
      console.log("Current Round Data:", data);
      setCurrentRound({ ...data });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    return () => {
      socket.off("connect");
      socket.off("update_current_round");
      socket.off("disconnect");
      socket.close();
    };
  }, []);

  // Connect Keplr Wallet
  const connectWallet = async () => {
    const chainId = "elgafar-1"; // Replace with your chain ID
    const keplrData = await connectKeplr(chainId);
    if (keplrData) {
      const client = await getSigningClient(keplrData.signer);
      setAddress(keplrData.address);
      setSigningClient(client);
      fetchCurrentRound(client);
      fetchMyTickets(client, keplrData.address);
    }
  };

  const handleBuyTickets = async () => {
    const res = await buyLotteryTickets(signingClient, address, 1000000);
    socket.emit("BoughtTickets");
  };

  // Fetch the current round data
  const fetchCurrentRound = async (client) => {
    const roundData = await queryCurrentRound(client);
    setCurrentRound(roundData);
  };

  // Fetch the current user's tickets
  const fetchMyTickets = async (client, userAddress) => {
    const myTicketsData = await queryMyTickets(client, userAddress);
    console.log(myTicketsData);
    setMyTickets(myTicketsData);
  };

  // Fetch past winners for a given round
  const fetchPastWinners = async (client, roundNum) => {
    const winnersData = await queryPastWinners(client, roundNum);
    setPastWinners(winnersData);
  };

  // Update round number input
  const handleRoundNumberChange = (event) => {
    setRoundNumber(event.target.value);
  };

  // Query past winners when button clicked
  const handleQueryPastWinners = () => {
    if (signingClient && roundNumber) {
      fetchPastWinners(signingClient, roundNumber);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lottery App</h1>
        {address ? (
          <>
            <p>Connected as: {address}</p>
            <button
              className="bg-gray-500"
              onClick={() => executeLotteryDraw(signingClient, address)}
            >
              Execute Lottery Draw
            </button>{" "}
            {` `}
            <button className="bg-gray-500" onClick={handleBuyTickets}>
              Buy Tickets
            </button>
            <div>
              <h2>Current Round</h2>
              <p>
                {currentRound ? JSON.stringify(currentRound) : "Loading..."}
              </p>
            </div>
            <div>
              <h2>My Tickets</h2>
              <p>{myTickets ? JSON.stringify(myTickets) : "Loading..."}</p>
            </div>
            <div>
              <input
                type="text"
                value={roundNumber}
                onChange={handleRoundNumberChange}
                placeholder="Enter round number"
              />
              <button className="bg-gray-500" onClick={handleQueryPastWinners}>
                Query Past Winners
              </button>
              <h2>Past Winners</h2>
              <p>
                {pastWinners
                  ? JSON.stringify(pastWinners)
                  : "Enter a round number and click query"}
              </p>
            </div>
          </>
        ) : (
          <button onClick={connectWallet}>Connect Keplr Wallet</button>
        )}
      </header>
    </div>
  );
}

export default App;
