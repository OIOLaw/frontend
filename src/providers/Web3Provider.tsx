import React, { Children, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { notify } from "../utils/notify";
import { BaseProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

interface Web3ProviderProps {
  children?: React.ReactNode;
}

interface WalletType {
  network: ethers.providers.Network; // Current network
  provider: BaseProvider; // Provider
  chainId: number; // Current chain ID (decimal)
  library: ethers.providers.Web3Provider; // Web3Provider library
  address: string; // Address of this wallet (i.e. account)
}

interface Web3ContextType {
  connectWallet?: () => void;
  disconnectWallet?: () => void;
  wallet?: WalletType;
}

export const Web3Context = React.createContext<Web3ContextType>({});

export function Web3Provider({ children }: Web3ProviderProps) {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [wallet, setWallet] = useState<WalletType>();
  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: "mainnet",
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal!.connect();
      console.log(provider);
      const library = new ethers.providers.Web3Provider(provider, "any");
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      console.log(accounts);
      console.log(network);
      if (accounts) {
        setWallet({
          provider,
          library,
          network,
          address: accounts[0], // always get the first account (topmost),
          chainId: network.chainId,
        });
      } else {
        notify("Error", "Could not find any accounts!", "error");
      }
    } catch (error) {
      notify("Error", "Could not connect wallet properly!", "error");
      console.log(error);
    }
  };

  const disconnectWallet = () => {
    try {
      web3Modal?.clearCachedProvider();
      setWallet(undefined);
    } catch (error) {
      notify("Error", "Could not disconnect wallet properly!", "error");
    }
  };

  return (
    <Web3Context.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return React.useContext(Web3Context);
}
