import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import io from "socket.io-client";
import Countdown from "react-countdown";
import Button from "components/Common/Button";
import ChampionCup from "assets/images/champion-cup.png";

import {
  getSigningClient,
  queryCurrentRound,
  queryMyTickets,
  buyLotteryTickets,
  queryPastWinners,
  queryLeftTime,
} from "utils/contractClient";

const socket = io(process.env.REACT_APP_SOCKET_URL);
const unit = 1000000;

const Lottery = () => {
  const [loading, setLoading] = useState(false);
  const wallet = useSelector((state) => state.wallet);
  const [amount, setAmount] = useState(1);
  const [signingClient, setSigningClient] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [leftTime, setLeftTime] = useState(0);
  const [myTickets, setMyTickets] = useState(null);
  const [pastWinners, setPastWinners] = useState(null);
  const handleChange = (val) => setAmount(isNaN(val * 1) ? 1 : val * 1);

  // Fetch the current round data
  const fetchCurrentRound = async (client) => {
    const roundData = await queryCurrentRound(client);
    setCurrentRound(roundData);
  };

  /// Fetch the left time until next round;
  const fetchLeftTime = async (client) => {
    const leftTimeData = await queryLeftTime(client);
    setLeftTime(leftTimeData);
  };

  // Fetch the current user's tickets
  const fetchMyTickets = async (client, userAddress) => {
    const myTicketsData = await queryMyTickets(client, userAddress);
    setMyTickets(myTicketsData);
  };

  // Fetch past winners for a given round
  const fetchPastWinners = async (client, roundNum) => {
    const winnersData = await queryPastWinners(client, roundNum);
    setPastWinners(winnersData);
  };

  const getCurrentRoundTotalTickets = () => {
    let count = 0;
    if (currentRound) {
      currentRound.tickets.map((round) => {
        count += round.count;
      });
    }
    return count;
  };

  const handleBuyTickets = async () => {
    setLoading(true);
    await buyLotteryTickets(signingClient, wallet.address, amount * unit);
    setLoading(false);
    toast.success(`Bought ${amount} tickets successfully.`, {
      theme: "dark",
    });
    socket.emit("buy_tickets");
    setAmount(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet.signer) {
        const client = await getSigningClient(wallet.signer);
        setSigningClient(client);
        fetchCurrentRound(client);
        fetchLeftTime(client);
        fetchMyTickets(client, wallet.address);
      }
    };

    fetchData();
  }, [wallet]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend");
    });

    socket.on("update_current_round", (data) => {
      console.log("Current Round Data:", data);
      setCurrentRound({ ...data });
    });

    socket.on("update_left_time", (data) => {
      setLeftTime(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });
  }, []);

  const timerRenderer = ({ hours, minutes, seconds }) => {
    return (
      <span>
        {minutes}m {seconds}s
      </span>
    );
  };

  return (
    <>
      {currentRound && (
        <div className="px-5 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-20">
              <div className="grid gap-10">
                <div className="flex flex-col gap-3 items-center">
                  <p className="font-medium text-2xl">
                    Time until round {currentRound?.index} ends
                  </p>
                  <p className="font-bold text-3xl">
                    <Countdown
                      date={leftTime.time * 1000}
                      renderer={timerRenderer}
                    />
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-xl">Total Tickets</span>
                    <span className="font-semibold text-xl">
                      {getCurrentRoundTotalTickets()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-xl">Total Pot</span>
                    <span className="font-semibold text-xl">
                      {currentRound?.pot / unit} STARS
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-xl">Price Per Ticket</span>
                    <span className="font-semibold text-xl">1 STAR</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span>Reward for winners</span>
                  <img src={ChampionCup} className="w-32" />
                  <span className="font-semibold text-xl">
                    {Math.floor(getCurrentRoundTotalTickets() * 0.99 * 100) /
                      100}{" "}
                    STARS
                  </span>
                </div>
                <div className="w-full max-w-xs flex flex-col gap-5 items-center">
                  <div className="w-full flex h-[72px] rounded overflow-hidden bg-gray-900 relative">
                    <input
                      type="text"
                      className="font-semibold bg-transparent appearance-none w-full text-2xl text-center pr-10 disabled:opacity-60"
                      value={amount}
                      onChange={(e) => handleChange(e.target.value)}
                      disabled={loading}
                    />
                    <div className="flex flex-col absolute top-0 right-0">
                      <Button
                        className="text-2xl px-3 rounded-none"
                        onClick={() => setAmount(amount + 1)}
                        disabled={loading}
                      >
                        +
                      </Button>
                      <Button
                        className="text-2xl px-3 rounded-none"
                        onClick={() => amount > 1 && setAmount(amount - 1)}
                        disabled={loading}
                      >
                        -
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleBuyTickets}
                    loading={loading}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lottery;
