import React, { useState } from "react";
import NFT1 from "assets/images/nfts/1.png";
import NFT2 from "assets/images/nfts/2.png";
import NFT3 from "assets/images/nfts/3.png";
import NFT4 from "assets/images/nfts/4.png";

const Collapse = ({ question, answer, avatar }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="flex odd:flex-row even:flex-row-reverse items-start gap-0 group">
      <img
        src={avatar}
        className="w-[68px] flex-shrink-0 group-even:scale-x-[-1] rounded-l-lg cursor-pointer"
        onClick={() => setOpened(!opened)}
      />
      <div
        className={`w-full bg-gray-800 from-[#88F7FE] to-[#397EFF] text-lg group-even:rounded-l-lg group-odd:rounded-r-lg ${
          opened ? `rounded-b-lg` : ``
        }`}
      >
        <div
          className="px-6 py-5 cursor-pointer"
          onClick={() => setOpened(!opened)}
        >
          {question}
        </div>
        {opened && <div className="px-6 pb-5">{answer}</div>}
      </div>
    </div>
  );
};

const FAQs = () => {
  const faqs = [
    {
      question: "What is the Ember lottery?",
      answer:
        "Bet STARS in a lottery against other players for a chance to win the entire prize pool.",
      avatar: NFT1,
    },
    {
      question: "How much is one ticket?",
      answer:
        "1 STARS is 1 ticket, the morevalue you bet, the higher probability you'll have of winning.",
      avatar: NFT2,
    },
    {
      question: "How often does the lottery reset?",
      answer:
        "Every 60 minutes, a new stars jackpot round begins. There can be unlimited participants, but only one winner.",
      avatar: NFT3,
    },
    {
      question: "How does Emberplay interact with the Ember NFT collection?",
      answer:
        "Emberplay takes 2% fee where 50% gets redistributed to the Ember NFT collection holders.",
      avatar: NFT4,
    },
  ];

  return (
    <div className="grid gap-10 md:gap-20">
      <h3 className="font-bold text-4xl md:text-5xl text-center">
        Frequently Asked Questions
      </h3>
      <div className="grid gap-3">
        {faqs.map((faq, i) => (
          <Collapse key={i} {...faq} />
        ))}
      </div>
    </div>
  );
};

export default FAQs;
