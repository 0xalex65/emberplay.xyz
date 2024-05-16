import React from "react";
import { Link } from "react-router-dom";

const Games = () => {
  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 md:pb-20">
      <h2 className="font-bold text-5xl md:text-6xl text-center">
        BET BIG, SOAR HIGHER
      </h2>
      <p className="text-center text-lg opacity-80">
        The first multi-game platform on Stargaze chain with an in-built revenue
        sharing NFT collection, Ember. More to come.
      </p>
      <div className="w-full flex flex-col lg:flex-row justify-center gap-5 md:gap-20">
        <Link
          to="/lottery"
          className="w-full md:w-96 h-80 md:h-96 flex items-center justify-center bg-gray-800 font-bold text-4xl hover:opacity-70 transition rounded-lg"
        >
          Lottery
        </Link>
        <Link
          to="/coinflip"
          className="w-full md:w-96 h-80 md:h-96 flex items-center justify-center bg-gray-800 font-bold text-4xl hover:opacity-70 transition rounded-lg"
        >
          Coin Flip
        </Link>
      </div>
    </div>
  );
};

export default Games;
