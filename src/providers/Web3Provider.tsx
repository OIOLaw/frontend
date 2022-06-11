import React, { Children, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { notify } from "../utils/notify";
import { BaseProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { hexToDecimal, truncateAddress } from "../utils/utility";

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
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true,
      network: "mainnet",
      providerOptions,
      theme: "dark",
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal!.connect();
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

  const autoConnect = async () => {
    // TODO not working :(
    if (web3Modal?.cachedProvider) {
      await web3Modal.connect();
    }
  };

  useEffect(() => {
    if (!web3Modal) return;
    if (!wallet || !wallet.provider.on) {
      autoConnect();
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (!(accounts && accounts.length > 0)) return;
      setWallet({ ...wallet, address: accounts[0] });
      notify(
        "Account Change",
        `${truncateAddress(wallet.address)} changed to ${truncateAddress(
          accounts[0]
        )}.`,
        "info"
      );
    };

    const handleChainChanged = (chainId: number) => {
      const newChainId = hexToDecimal(chainId);
      setWallet({ ...wallet, chainId: newChainId });
      notify(
        "Network Change",
        "You have changed to chain " + newChainId,
        "success"
      );
    };

    const handleDisconnect = () => {
      setWallet(undefined);
      notify(
        "Wallet Disconnect",
        "You have disconnected your wallet.",
        "success"
      );
    };

    wallet.provider.on("accountsChanged", handleAccountsChanged);
    wallet.provider.on("chainChanged", handleChainChanged);
    wallet.provider.on("disconnect", handleDisconnect);

    return () => {
      wallet.provider.removeListener("accountsChanged", handleAccountsChanged);
      wallet.provider.removeListener("chainChanged", handleChainChanged);
      wallet.provider.removeListener("disconnect", handleDisconnect);
    };
  }, [web3Modal, wallet]);

  return (
    <Web3Context.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return React.useContext(Web3Context);
}
