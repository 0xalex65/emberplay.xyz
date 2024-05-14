import React from "react";
import { Link } from "react-router-dom";
import Button from "components/Common/Button";
import NFT1 from "assets/images/nfts/1.png";
import NFT2 from "assets/images/nfts/2.png";
import NFT3 from "assets/images/nfts/3.png";
import NFT4 from "assets/images/nfts/4.png";
import NFT5 from "assets/images/nfts/5.png";
import NFT6 from "assets/images/nfts/6.png";
import NFT7 from "assets/images/nfts/7.png";
import NFT8 from "assets/images/nfts/8.png";
import NFT9 from "assets/images/nfts/9.png";
import NFT10 from "assets/images/nfts/10.png";
import NFT11 from "assets/images/nfts/11.png";
import NFT12 from "assets/images/nfts/12.png";
import NFT13 from "assets/images/nfts/13.png";
import NFT14 from "assets/images/nfts/14.png";
import NFT15 from "assets/images/nfts/15.png";

const NFTs = () => {
  return (
    <div className="grid gap-10 md:gap-20">
      <div className="flex flex-col items-center gap-5 justify-center relative">
        <h3 className="font-bold text-4xl md:text-5xl">Our NFTs</h3>
        <Link
          to="https://www.stargaze.zone/m/stars1s5l98e7rhe3d6f4cp67sv4q7qjaaffg8h0zaugzqyfgzzheyvepq9ykmm4/tokens"
          target="_blank"
          className="relative md:absolute right-0 bottom-0"
        >
          <Button>Try to mint</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <img src={NFT1} className="rounded-lg" />
        <img src={NFT2} className="rounded-lg" />
        <img src={NFT3} className="rounded-lg" />
        <img src={NFT4} className="rounded-lg" />
        <img src={NFT5} className="rounded-lg" />
        <img src={NFT6} className="rounded-lg" />
        <img src={NFT7} className="rounded-lg" />
        <img src={NFT8} className="rounded-lg" />
        <img src={NFT9} className="rounded-lg" />
        <img src={NFT10} className="rounded-lg" />
        <img src={NFT11} className="rounded-lg" />
        <img src={NFT12} className="rounded-lg" />
        <img src={NFT13} className="rounded-lg" />
        <img src={NFT14} className="rounded-lg" />
        <img src={NFT15} className="rounded-lg" />
      </div>
    </div>
  );
};

export default NFTs;
