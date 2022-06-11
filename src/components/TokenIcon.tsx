import { Box, Code, ThemeIcon, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { FC } from "react";
import {
  Coin,
  CurrencyBitcoin,
  CurrencyDogecoin,
  CurrencyDollar,
  CurrencyEthereum,
  CurrencyKroneDanish,
  CurrencyLitecoin,
} from "tabler-icons-react";
import { truncateAddress } from "../utils/utility";

const TokenIcon: FC<{ symbol: string }> = ({ symbol }) => {
  const currencies = [
    {
      icon: <CurrencyBitcoin />,
      symbol: "BTC",
      color: "yellow",
    },
    {
      icon: <CurrencyEthereum />,
      symbol: "ETH",
      color: "blue",
    },
    {
      icon: <CurrencyDollar />,
      symbol: "USDC",
      color: "orange",
    },
  ];
  const currency = currencies.filter((it) => it.symbol === symbol)[0] ?? {
    icon: <Coin />,
    color: "yellow",
  };
  return (
    <ThemeIcon radius="xl" size="md" color={currency.color}>
      {currency.icon}
    </ThemeIcon>
  );
};

export default TokenIcon;
