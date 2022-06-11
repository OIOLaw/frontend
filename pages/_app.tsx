import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Web3Provider } from "../src/providers/Web3Provider";
import { NotificationsProvider } from "@mantine/notifications";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>OIOTrust</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Web3Provider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
          }}>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </Web3Provider>
    </>
  );
}

export default MyApp;
