import { Image } from "@mantine/core";
import { FC } from "react";
import {tokenAddresses} from "../constants/contractAddresses";

const TokenIcon: FC<{ symbol: string }> = ({ symbol }) => {
  const currency = tokenAddresses[symbol] ?? {
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
  };
  return (
    <Image height={'25px'} alt={currency.address} src={currency.image}/>
  );
};

export default TokenIcon;
