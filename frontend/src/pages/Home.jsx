import React from "react";
import Games from "components/Container/Home/Games";
import NFTs from "components/Container/Home/NFTs";
import FAQs from "components/Container/Home/FAQs";

const Home = () => {
  return (
    <div className="px-5">
      <div className="w-full max-w-7xl grid gap-16 md:gap-20 mx-auto py-20">
        <Games />
        <NFTs />
        <FAQs />
      </div>
    </div>
  );
};

export default Home;
