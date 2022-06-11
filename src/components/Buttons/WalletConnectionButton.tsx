import React, {FC} from 'react'
import {Button} from "@mantine/core";
import {truncateAddress} from "../../utils/utility";
import {useWeb3} from "../../providers/Web3Provider";


const WalletConnectionButton: FC = () => {
    const {disconnectWallet, connectWallet, wallet} = useWeb3();
    return (
        <>
            {wallet ? (
                <>
                    <Button onClick={() => disconnectWallet?.call(this)}>
                        {`Disconnect ${truncateAddress(wallet.address)}`}
                    </Button>
                </>
            ):(
                <Button onClick={() => connectWallet?.call(this)}>
                    Connect Wallet
                </Button>
            )}
        </>
    );
};

export default WalletConnectionButton
