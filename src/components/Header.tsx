import {Box, Container, Group} from "@mantine/core"
import { FC } from "react"
import WalletConnectionButton from "./Buttons/WalletConnectionButton";
import {Logo} from "./Logo/Logo";

const Header: FC = () => {
    return (
        <Box component="header" py="md" sx={{ textAlign: "center", borderBottom: "1px solid lightgray" }}>
            <Container>
                <Group>
                    <Logo/>

                    {/*<Text*/}
                    {/*    variant="gradient"*/}
                    {/*    gradient={{ from: "primary", to: "secondary", deg: 45 }}*/}
                    {/*    sx={{ fontSize: "1.5em", fontWeight: 800 }}*/}
                    {/*    inline*/}
                    {/*>*/}
                    {/*    <Link href="/">NextJS + Web3</Link>*/}
                    {/*</Text>*/}

                    {/* pushes the succeeding contents to the right */}
                    <span style={{ flexGrow: 1 }} />

                    <WalletConnectionButton />
                    {/*<WalletDisplayButton />*/}
                    {/*<ThemeToggleButton />*/}
                </Group>
            </Container>
        </Box>
    )
}

export default Header
