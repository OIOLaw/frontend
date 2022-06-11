import {
  Alert,
  Box,
  Button,
  Code,
  Container,
  Group,
  Text,
} from "@mantine/core";
import { FC } from "react";
import WalletConnectionButton from "./Buttons/WalletConnectionButton";
import { Logo } from "./Logo/Logo";
import { useWeb3 } from "../providers/Web3Provider";
import { truncateAddress } from "../utils/utility";
import { AlertCircle } from "tabler-icons-react";

const Header: FC = () => {
  const { connectWallet, disconnectWallet, wallet } = useWeb3();
  return (
    <>
      <Box
        component="header"
        py="md"
        sx={{
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}>
        <Container>
          <Group>
            <Logo />
            <span style={{ flexGrow: 1 }} />

            {/*<WalletConnectionButton />*/}

            {wallet ? (
              <>
                <Box>
                  <Code title={wallet.address}>
                    {truncateAddress(wallet.address)}
                  </Code>
                </Box>
                <Button
                  onClick={() => disconnectWallet?.call(this)}
                  variant="default">
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                onClick={() => connectWallet?.call(this)}
                sx={(theme) => ({
                  boxShadow: `0px 1px 15px 1px ${theme.colors.blue[5]}50`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: `0px 1px 25px 1px ${theme.colors.blue[5]}50`,
                    transform: "scale(1.05)",
                  },
                })}>
                Connect Wallet
              </Button>
            )}
          </Group>
        </Container>
      </Box>
      {wallet?.network?.name && wallet?.network?.name !== "goerli" && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Wrong network"
          color="red">
          Please switch to Goerli testchain.
        </Alert>
      )}
    </>
  );
};

export default Header;
