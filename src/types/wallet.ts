import { ethers } from "ethers"
import { BaseProvider } from "@ethersproject/providers"

export interface WalletType {
    network: ethers.providers.Network; // Current network
    provider: BaseProvider; // Provider
    chainId: number; // Current chain ID (decimal)
    library: ethers.providers.Web3Provider; // Web3Provider library
    address: string; // Address of this wallet (i.e. account)
}

export interface Web3ContextType {
    connectWallet?: () => void;
    disconnectWallet?: () => void;
    wallet?: WalletType;
}
