import React, { useEffect, useState } from "react";
import Button from "components/Common/Button";
import ChampionCup from "assets/images/champion-cup.png";
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
const socket = io(process.env.REACT_APP_SOCKET_URL);

const Lottery = () => {
  const [amount, setAmount] = useState(1);
  const [currentRound, setCurrentRound] = useState(null);
  const handleChange = (val) => setAmount(isNaN(val * 1) ? 1 : val * 1);

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

  return (
    <div className="px-5 py-20">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-20">
          <div className="grid gap-10">
            <div className="flex flex-col gap-3 items-center">
              <p className="font-medium text-2xl">Time until round x ends</p>
              <p className="font-bold text-3xl">55m 46s</p>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="flex flex-col items-center gap-3">
                <span className="text-xl">Total Tickets</span>
                <span className="font-semibold text-xl">190</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-xl">Total Pot</span>
                <span className="font-semibold text-xl">190 STARS</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-xl">Price Per Ticket</span>
                <span className="font-semibold text-xl">1 STAR</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span>Reward for winners</span>
              <img src={ChampionCup} className="w-32" />
              <span className="font-semibold text-xl">189 STARS</span>
            </div>
            <div className="w-full max-w-xs flex flex-col gap-5 items-center">
              <div className="w-full flex h-[72px] rounded overflow-hidden bg-gray-900 relative">
                <input
                  type="text"
                  className="font-semibold bg-transparent appearance-none w-full text-2xl text-center pr-10"
                  value={amount}
                  onChange={(e) => handleChange(e.target.value)}
                />
                <div className="flex flex-col absolute top-0 right-0">
                  <Button
                    className="text-2xl px-3 rounded-none"
                    onClick={() => setAmount(amount + 1)}
                  >
                    +
                  </Button>
                  <Button
                    className="text-2xl px-3 rounded-none"
                    onClick={() => amount > 1 && setAmount(amount - 1)}
                  >
                    -
                  </Button>
                </div>
              </div>
              <Button size="lg" fullWidth>
                Buy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lottery;
