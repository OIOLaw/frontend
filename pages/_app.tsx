import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Web3Provider } from "../src/providers/Web3Provider";
import { NotificationsProvider } from "@mantine/notifications";

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default MyApp;
