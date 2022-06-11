import {Box, Button, Code, Container, Group, Text} from "@mantine/core"
import {FC} from "react"
import WalletConnectionButton from "./Buttons/WalletConnectionButton";
import {Logo} from "./Logo/Logo";
import {useWeb3} from "../providers/Web3Provider";

const Header: FC = () => {
    const {
        connectWallet,
        disconnectWallet,
        wallet,
    } = useWeb3();
    return (
        <Box component="header" py="md" sx={{textAlign: "center", borderBottom: "1px solid lightgray"}}>
            <Container>
                <Group>
            <Logo/>
            <span style={{flexGrow: 1}}/>

            {/*<WalletConnectionButton />*/}

            {wallet ? (
                <>
                    <Button onClick={() => disconnectWallet?.call(this)}>
                        Disconnect
                    </Button>
                    <Box>
                        <Code>{wallet.address}</Code>
                    </Box>
                </>
            ):(
                <Button onClick={() => connectWallet?.call(this)}>
                    Connect Wallet
                </Button>
            )
            }
                </Group>
            </Container>
        </Box>
    )
}


export default Header
