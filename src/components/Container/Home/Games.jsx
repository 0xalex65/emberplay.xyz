import React from "react";

const Games = () => {
  return (
    <div className="flex flex-col items-center gap-10 pb-20">
      <h2 className="font-bold text-7xl text-center">Games</h2>
      <p className="text-center text-lg opacity-80">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
      <div className="flex justify-center gap-20">
        <div className="w-96 h-96 flex items-center justify-center bg-gray-800 font-bold text-4xl">
          Lottery
        </div>
        <div className="w-96 h-96 flex items-center justify-center bg-gray-800 font-bold text-4xl">
          Coin Flip
        </div>
      </div>
    </div>
  );
};

export default Games;
