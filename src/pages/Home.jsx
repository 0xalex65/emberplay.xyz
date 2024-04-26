import FAQs from "components/Container/Home/FAQs";
import NFTs from "components/Container/Home/NFTs";
import Games from "components/Container/Home/Games";
import React from "react";

const Home = () => {
  return (
    <div className="w-full max-w-7xl grid gap-20 mx-auto py-20">
      <Games />
      <NFTs />
      <FAQs />
    </div>
  );
};

export default Home;
