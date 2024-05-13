import React, { useState } from "react";
import NFT1 from "assets/images/nfts/1.jpg";
import NFT2 from "assets/images/nfts/2.jpg";
import NFT3 from "assets/images/nfts/3.jpg";
import NFT4 from "assets/images/nfts/4.jpg";
import NFT5 from "assets/images/nfts/5.jpg";
import NFT6 from "assets/images/nfts/6.jpg";
import NFT7 from "assets/images/nfts/7.jpg";
import NFT8 from "assets/images/nfts/8.jpg";
import NFT9 from "assets/images/nfts/9.jpg";
import NFT10 from "assets/images/nfts/10.jpg";

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
      question: "How do I buy a lottery ticket?",
      answer:
        "You can purchase lottery tickets from authorized retailers, through our official website, or via our mobile app. Be sure to check that online purchasing is available in your location.",
      avatar: NFT1,
    },
    {
      question: "What are the age requirements to play the lottery?",
      answer:
        "Participants must be at least 18 years old to buy a lottery ticket and claim any winnings, though this age requirement may vary by jurisdiction. Please confirm the age requirement in your area.",
      avatar: NFT2,
    },
    {
      question: "How can I check if I have won?",
      answer:
        "Winning numbers are posted on our official website and through our mobile app shortly after each draw. You can also visit any authorized retailer to check your tickets.",
      avatar: NFT3,
    },
    {
      question: "What should I do if I win?",
      answer:
        "If you win, sign the back of your ticket and store it in a safe place. Contact the lottery office as soon as possible to claim your prize. Prizes may be claimed by mail or in person, depending on the amount.",
      avatar: NFT4,
    },
    {
      question: "How long do I have to claim my winnings?",
      answer:
        "The time frame to claim a prize varies by state or country but typically ranges from 90 days to one year from the draw date. Check the rules specific to your lottery game for the exact period.",
      avatar: NFT5,
    },
    {
      question: "Are lottery winnings taxable?",
      answer:
        "Yes, lottery winnings are subject to federal and possibly state taxes depending on your location. We recommend consulting with a tax professional to understand your obligations.",
      avatar: NFT6,
    },
    {
      question: "Can I remain anonymous if I win?",
      answer:
        "Some jurisdictions allow winners to remain anonymous, while others require public disclosure. Check the specific rules in your area or consult with legal counsel.",
      avatar: NFT7,
    },
    {
      question: "What happens to unclaimed prizes?",
      answer:
        "Unclaimed prizes are handled differently by each lottery operator. Generally, these funds are returned to the community through various public initiatives like education, parks, and other public services.",
      avatar: NFT8,
    },
    {
      question: "Can I buy lottery tickets in advance?",
      answer:
        "Yes, most lotteries allow you to purchase tickets for multiple draws in advance. Check the details on our website or at an authorized retailer.",
      avatar: NFT9,
    },
    {
      question: "Is there a limit to how many tickets I can buy?",
      answer:
        "There is typically no limit to the number of tickets you can buy, but we encourage responsible gambling. Always play within your means and consider the odds before purchasing multiple tickets.",
      avatar: NFT10,
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
