import React, { Children, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { genericErrorNotify, notify } from "../utils/notify";
import { BaseProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { hexToDecimal, truncateAddress } from "../utils/utility";
import OIOTrust_abi from "../abi/OIOTrust.json";

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
  createTrust?: () => void;
  depositToken?: () => void;
  loadTrusts?: () => Promise<any[]>;
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

  const [contract, setContract] = useState<ethers.Contract>();

  useEffect(() => {
    if (wallet) {
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
        const newContract = new ethers.Contract(
          contractAddress,
          OIOTrust_abi.abi,
          wallet.library.getSigner(wallet.address)
        );
        setContract(newContract);
        console.log(newContract);
      } catch (e: any) {
        genericErrorNotify(e, "Contract Not Found", false);
      }
    }

    return () => {
      setContract(undefined);
    };
  }, [wallet]);

  const loadTrusts = async () => {
    if (!contract) return;
    const count = await contract.totalSupply();

    // For each trust, get the details
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(contract.tokenURI(i));
    }

    const resolved = await Promise.all(promises);
    return resolved.map((metadataURI) => {
      console.log(atob(metadataURI.split(",")[1]));
      const metadata = JSON.parse(atob(metadataURI.split(",")[1]));
      return {
        metadata,
      };
    });
  };
  const createTrust = async () => {
    if (!contract) return;
    try {
      const tx = await contract.createTrust(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        Math.floor(new Date().getTime() / 1000) * 60 * 60 * 24 * 7,
        "1"
      );
      await tx.wait();
      notify("Success", "Trust created successfully!", "success");
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error creating trust", false);
    }
  };
  const depositToken = async () => {
    if (!contract) return;
    try {
      const tokenId = 0;
      const erc20Address = "";
      const amount = "";
      const installmentAmount = "";
      const tx = await contract.deposit(
        tokenId,
        erc20Address,
        amount,
        installmentAmount
      );
      await tx.wait();
      notify("Success", "Token deposited successfully!", "success");
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error depositing token", false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        createTrust,
        depositToken,
        loadTrusts,
      }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return React.useContext(Web3Context);
}
