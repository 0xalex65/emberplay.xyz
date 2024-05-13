import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { connectKeplr } from "utils/keplr";
import Button from "components/Common/Button";
import Logo from "assets/images/logo.png";
import { setWallet } from "store/actions/Wallet";

const Header = () => {
  const dispatch = useDispatch();

  const wallet = useSelector((state) => state.wallet);

  const handleConnectWallet = async () => {
    const chainId = process.env.REACT_APP_CHAIN_ID;
    const keplrWallet = await connectKeplr(chainId);

    if (keplrWallet) {
      dispatch(setWallet(keplrWallet));
    }
  };

  return (
    <div className="w-full h-20 border-b border-b-white/20 px-5">
      <div className="w-full max-w-7xl h-20 mx-auto flex items-center justify-between">
        <Link to="/">
          <img src={Logo} className="h-14 rounded" />
        </Link>
        {wallet.address ? (
          <span>{wallet.address.replace(/^(.{6}).*(.{4})$/, "$1...$2")}</span>
        ) : (
          <Button onClick={handleConnectWallet}>Connect</Button>
        )}
      </div>
    </div>
  );
};

export default Header;
