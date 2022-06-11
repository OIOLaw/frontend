import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Web3Provider } from "../src/providers/Web3Provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}>
        <Component {...pageProps} />
      </MantineProvider>
    </Web3Provider>
  );
}

export default MyApp;
