import { Box, Button, Center, Loader, Text, Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useWeb3 } from "../src/providers/Web3Provider";
import Layout from "../src/components/Layout";
import TrustItem from "../src/components/TrustItem";
import Link from "next/link";
import CenteredText from "../src/components/CenteredText";
import { Plus } from "tabler-icons-react";

const Home: NextPage = () => {
  const { wallet, trusts } = useWeb3();

  const myTrusts = trusts?.filter(
    (metadata) =>
      metadata?.creator?.toLowerCase() == wallet?.address?.toLowerCase()
  );

  return (
    <>
      <Layout>
        {wallet ? (
          <>
            {myTrusts === undefined ? (
              <CenteredText>
                <Loader />
              </CenteredText>
            ) : myTrusts.length === 0 ? (
              <CenteredText>
                <Title>No trusts created</Title>
                <Text>Create your first trust using the button below</Text>
              </CenteredText>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                  my="md">
                  <Link href="/create" passHref>
                    <Button leftIcon={<Plus />} component="a">
                      Create a new trust
                    </Button>
                  </Link>
                </Box>
                {myTrusts?.map((metadata) => (
                  <TrustItem metadata={metadata} key={metadata.id} />
                ))}
              </>
            )}
          </>
        ) : (
          <CenteredText>
            <Title>Connect your wallet</Title>
            <Text>To manage your trusts, connect your wallet first</Text>
          </CenteredText>
        )}
      </Layout>
    </>
  );
};

export default Home;
