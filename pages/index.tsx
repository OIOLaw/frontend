import { AppShell, Box, Button, Code, Text } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWeb3 } from "../src/providers/Web3Provider";

const Home: NextPage = () => {
  const {
    connectWallet,
    disconnectWallet,
    wallet,
    depositToken,
    createTrust,
    trusts,
  } = useWeb3();

  return (
    <>
      <Head>
        <title>OIOLaw</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell>
        {wallet ? (
          <>
            <Button onClick={() => disconnectWallet?.call(this)}>
              Disconnect
            </Button>
            <Box>
              <Code>{wallet.address}</Code>
            </Box>

            <Button
              onClick={() =>
                createTrust?.call(
                  this,
                  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                  Math.floor(new Date().getTime() / 1000) * 60 * 60 * 24 * 7,
                  1
                )
              }>
              Create a new trust
            </Button>
            <Button
              onClick={() =>
                depositToken?.call(
                  this,
                  0,
                  "0x0dcd1bf9a1b36ce34237eeafef220932846bcd82",
                  1e18,
                  1e17
                )
              }>
              Deposit a token
            </Button>

            {trusts
              ?.filter(
                (metadata) =>
                  metadata?.creator?.toLowerCase() ==
                  wallet?.address?.toLowerCase()
              )
              .map((metadata, i) => (
                <Box key={i}>
                  <Text>Trust ID {i}</Text>
                  <Text>{JSON.stringify(metadata)}</Text>
                </Box>
              ))}
          </>
        ) : (
          <Button onClick={() => connectWallet?.call(this)}>
            Connect Wallet
          </Button>
        )}
      </AppShell>
    </>
  );
};

export default Home;
