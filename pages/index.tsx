import { AppShell, Button, Code } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useWeb3 } from "../src/providers/Web3Provider";

const Home: NextPage = () => {
  const { connectWallet, disconnectWallet, wallet } = useWeb3();
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
            <Code>{wallet.address}</Code>
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
