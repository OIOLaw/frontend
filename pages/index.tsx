import { AppShell, Box, Button, Code, Text } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWeb3 } from "../src/providers/Web3Provider";
import Layout from "../src/components/Layout";

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
      <Layout>
        {wallet && (
          <>
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
                  "0xe93058c0c7f8bf193bc8c565fabfc050c51b48c7",
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
        )}
        {/*    TODO: Add Create Trust button and link to /create */}

        {/*    TODO: NOT connected? "connect wallet to proceed". */}

        {/*    TODO: connected? && !trusts[] print "you have no trusts. Start by creating one. */}
        {/*    TODO: connected? && trusts[]? display list of trusts, with an update trust button */}
      </Layout>
    </>
  );
};

export default Home;
