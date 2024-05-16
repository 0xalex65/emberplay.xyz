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
  queryPastRounds,
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
  const [pastRounds, setPastRounds] = useState();
  const [myTickets, setMyTickets] = useState(null);
  const [pastWinners, setPastWinners] = useState(null);
  const handleChange = (val) => setAmount(isNaN(val * 1) ? 1 : val * 1);

  // Fetch the current round data
  const fetchCurrentRound = async () => {
    const roundData = await queryCurrentRound();
    setCurrentRound(roundData);
  };

  /// Fetch the left time until next round;
  const fetchLeftTime = async () => {
    const leftTimeData = await queryLeftTime();
    setLeftTime(leftTimeData.time);
  };

  /// Fetch the past rounds;
  const fetchPastRounds = async () => {
    const data = await queryPastRounds();
    console.log(data.rounds);
    setPastRounds(data.rounds);
  };

  // Fetch the current user's tickets
  const fetchMyTickets = async (client, userAddress) => {
    const myTicketsData = await queryMyTickets(client, userAddress);
    setMyTickets(myTicketsData);
  };

  // Fetch past winners for a given round
  const fetchPastWinners = async (roundNum) => {
    const winnersData = await queryPastWinners(roundNum);
    setPastWinners(winnersData);
  };

  const getTotalTicketCount = (round) => {
    let count = 0;
    round.tickets.map((r) => {
      count += r.count;
    });
    return count;
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

  const getMyTicketCount = () => {
    return currentRound.tickets.filter(
      (ticket) => ticket.owner === wallet.address
    )[0].count;
  };

  const handleBuyTickets = async () => {
    if (!wallet.signer) {
      toast.warning("Please connect wallet");
      return;
    }
    setLoading(true);
    await buyLotteryTickets(signingClient, wallet.address, amount * unit)
      .then(() => {
        toast.success(`Bought ${amount} tickets successfully.`);
        socket.emit("buy_tickets");
        setAmount(1);
      })
      .catch((err) => {
        toast.error(err.message);
      });
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchCurrentRound();
      fetchLeftTime();
      fetchPastRounds();
      if (wallet.signer) {
        const client = await getSigningClient(wallet.signer);
        setSigningClient(client);
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
      setCurrentRound({ ...data });
    });

    socket.on("update_left_time", (data) => {
      setLeftTime(data.time);
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
          <div className="w-full max-w-7xl mx-auto grid gap-20">
            <div className="bg-gray-800 rounded-xl p-20">
              <div className="grid gap-10">
                <div className="flex flex-col gap-3 items-center">
                  <p className="font-medium text-2xl">
                    Time until round {currentRound?.index} ends
                  </p>
                  <p className="font-bold text-3xl">
                    {leftTime && (
                      <Countdown
                        date={leftTime * 1000}
                        renderer={timerRenderer}
                      />
                    )}
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
                {wallet.signer && (
                  <div className="grid grid-cols-4 gap-5">
                    <div></div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xl">My Tickets</span>
                      <span className="font-semibold text-xl">
                        {getMyTicketCount()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xl">Winning Chance</span>
                      <span className="font-semibold text-xl">
                        {Math.round(
                          (getMyTicketCount() / getCurrentRoundTotalTickets()) *
                            100000
                        ) / 1000}
                        %
                      </span>
                    </div>
                    <div></div>
                  </div>
                )}
                <div className="w-full max-w-xs flex flex-col gap-5 items-center">
                  <div className="grid gap-2">
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
                    <div className="w-full flex gap-1">
                      <Button
                        disabled={loading}
                        className="!px-0"
                        fullWidth
                        onClick={() => setAmount(5)}
                      >
                        5
                      </Button>
                      <Button
                        disabled={loading}
                        className="!px-0"
                        fullWidth
                        onClick={() => setAmount(10)}
                      >
                        10
                      </Button>
                      <Button
                        disabled={loading}
                        className="!px-0"
                        fullWidth
                        onClick={() => setAmount(50)}
                      >
                        50
                      </Button>
                      <Button
                        disabled={loading}
                        className="!px-0"
                        fullWidth
                        onClick={() => setAmount(100)}
                      >
                        100
                      </Button>
                      <Button
                        disabled={loading}
                        className="!px-0"
                        fullWidth
                        onClick={() => setAmount(500)}
                      >
                        500
                      </Button>
                      <Button
                        disabled={loading}
                        className="!px-0"
                        fullWidth
                        onClick={() => setAmount(1000)}
                      >
                        1000
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
            <div className="grid gap-10">
              <h3 className="font-bold text-3xl text-center">Past Rounds</h3>
              <div className="grid gap-5">
                {pastRounds?.map((round) => {
                  const totalCount = getTotalTicketCount(round);

                  return (
                    <div
                      className="bg-gray-800 rounded-xl p-10 flex flex-col items-center gap-5"
                      key={round.index}
                    >
                      <p className="font-medium text-xl">Round {round.index}</p>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900">
                            <td className="p-3"></td>
                            <td className="p-3">Player address</td>
                            <td className="p-3">Ticket Count</td>
                            <td className="p-3">Winning Chance</td>
                          </tr>
                        </thead>
                        <tbody>
                          {round.tickets.map((ticket, i) => (
                            <tr key={i} className="even:bg-gray-900">
                              <td className="px-3">
                                {ticket.owner === round.winner && (
                                  <img src={ChampionCup} className="w-8" />
                                )}
                              </td>
                              <td className="p-3">{ticket.owner}</td>
                              <td className="p-3">{ticket.count}</td>
                              <td className="p-3">
                                {Math.round(
                                  (ticket.count / totalCount) * 100000
                                ) / 1000}
                                %
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lottery;
