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
    loadTrusts,
  } = useWeb3();
  const [trusts, setTrusts] = useState<any[]>();

  useEffect(() => {
    if (!loadTrusts) return;
    loadTrusts().then(setTrusts).catch(console.log);
  }, [loadTrusts]);

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

            <Button onClick={() => createTrust?.call(this)}>
              Create a new trust
            </Button>
            <Button onClick={() => depositToken?.call(this)}>
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
