import React, { Children, useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { genericErrorNotify, notify } from "../utils/notify";
import { BaseProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { hexToDecimal, truncateAddress } from "../utils/utility";
import OIOTrust_abi from "../abi/OIOTrust.json";
import ERC20_abi from "../abi/IERC20.json";

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
  createTrust?: (
    recipient: string,
    startTime: number,
    frequencyInDays: number
  ) => void;
  depositToken?: (
    tokenId: number,
    erc20Address: string,
    amount: number,
    installmentAmount: number
  ) => void;
  withdrawToken?: (
    tokenId: number,
    erc20Address: string,
    amount: number
  ) => void;
  updateTrust?: (
    trustId: string,
    startTime: number,
    frequencyInDays: number
  ) => void;
  trusts?: any[];
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
      network: "goerli",
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

  const [trusts, setTrusts] = useState<any[]>();

  const loadTrusts = useCallback(async () => {
    if (!contract) return [];
    const count = await contract.totalSupply();

    // For each trust, get the details
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(contract.tokenURI(i));
    }

    const resolved = await Promise.all(promises);
    const newTrusts = resolved.map((metadataURI) => {
      const metadata = JSON.parse(atob(metadataURI.split(",")[1]));
      return metadata;
    });
    setTrusts(newTrusts);
  }, [contract]);

  useEffect(() => {
    loadTrusts();
  }, [loadTrusts, contract]);

  const createTrust = async (
    recipient: string,
    startTime: number,
    frequencyInDays: number
  ) => {
    if (!contract) return;
    try {
      const tx = await contract.createTrust(
        recipient,
        startTime + "",
        frequencyInDays + ""
      );
      await tx.wait();
      notify("Success", "Trust created successfully!", "success");
      loadTrusts();
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error creating trust", false);
    }
  };
  const depositToken = async (
    tokenId: number,
    erc20Address: string,
    amount: number,
    installmentAmount: number
  ) => {
    if (!contract || !wallet) return;
    try {
      const tokenContract = new ethers.Contract(
        erc20Address,
        ERC20_abi.abi,
        wallet.library.getSigner(wallet.address)
      );
      const tx1 = await tokenContract.approve(
        contract.address,
        amount.toString()
      );
      await tx1.wait();
      const tx2 = await contract.deposit(
        tokenId.toString(),
        erc20Address,
        amount.toString(),
        installmentAmount.toString()
      );
      await tx2.wait();
      notify("Success", "Token deposited successfully!", "success");
      loadTrusts();
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error depositing token", false);
    }
  };
  const withdrawToken = async (
    tokenId: number,
    erc20Address: string,
    amount: number
  ) => {
    if (!contract || !wallet) return;
    try {
      const tx = await contract.withdraw(
        tokenId.toString(),
        erc20Address,
        amount.toString()
      );
      await tx.wait();
      notify("Success", "Token withdrawn successfully!", "success");
      loadTrusts();
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error withdrawing token", false);
    }
  };
  const updateTrust = async (
    trustId: string,
    startTime: number,
    frequencyInDays: number
  ) => {
    if (!contract) return;
    try {
      const tx = await contract.createTrust(
        trustId,
        startTime + "",
        frequencyInDays + ""
      );
      await tx.wait();
      notify("Success", "Trust updated successfully!", "success");
      loadTrusts();
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error updating trust", false);
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
        withdrawToken,
        updateTrust,
        trusts,
      }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return React.useContext(Web3Context);
}
