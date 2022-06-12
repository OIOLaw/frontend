import React, { Children, useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { genericErrorNotify, notify } from "../utils/notify";
import { BaseProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { hexToDecimal, truncateAddress } from "../utils/utility";
import OIOTrust_abi from "../abi/OIOTrust.json";
import ERC20_abi from "../abi/IERC20.json";
import { LoadingOverlay } from "@mantine/core";

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
  ) => Promise<number | void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      network: "ropsten",
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
    if (web3Modal?.cachedProvider) {
      connectWallet();
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

    try {
      const count = await contract.totalSupply();
      // For each trust, get the details
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(contract.tokenURI(i));
      }
      const resolveMetadata = promises.map(async (metadataURI, id) => {
        const returnedURI = await metadataURI;
        const metadata = JSON.parse(atob(returnedURI.split(",")[1]));
        metadata.id = id;
        metadata.owner = await contract.ownerOf(id);
        return metadata;
      });
      const newTrusts = await Promise.all(resolveMetadata);
      /*const newTrusts = [
        {
          creator: "0xcdbc5b7f658687e6ace363ee3dff9a71a97f3fd3",
          start_time: 1655386777,
          frequency_in_days: 1,
          installments_paid: 0,
          tokens: [
            {
              name: "Ethereum",
              amount: 1500000000000000000000,
              installment_amount: 10000000000000000000,
              decimals: 18,
              symbol: "ETH",
            },
            {
              name: "Bitcoin (Wrapped)",
              amount: 100000000000000000000,
              installment_amount: 100000000000000000,
              decimals: 18,
              symbol: "BTC",
            },
            {
              name: "Circle USD",
              amount: 1000000000000000000,
              installment_amount: 100000000000000,
              decimals: 10,
              symbol: "USDC",
            },
          ],
          id: 0,
          owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
      ];*/
      setTrusts(newTrusts);
    } catch (error) {
      console.log(error);
      setTrusts([]);
    }
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
      setIsLoading(true);
      const tx = await contract.createTrust(
        recipient,
        startTime + "",
        frequencyInDays + ""
      );
      const txId = await tx.wait();
      notify("Success", "Trust created successfully!", "success");
      loadTrusts();
      if (txId) {
        console.log(
          txId.events.find((it: any) => it.event === "Transfer").args.tokenId
        );
        return txId.events.find((it: any) => it.event === "Transfer").args
          .tokenId;
      }
    } catch (e) {
      console.log(e);
      genericErrorNotify(e, "Error creating trust", false);
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      const tokenContract = new ethers.Contract(
        erc20Address,
        ERC20_abi.abi,
        wallet.library.getSigner(wallet.address)
      );
      const allowance = await tokenContract.allowance(
        wallet.address,
        contract.address
      );
      if (allowance < amount) {
        const tx1 = await tokenContract.approve(
          contract.address,
          amount.toString()
        );
        await tx1.wait();
      }
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
    } finally {
      setIsLoading(false);
    }
  };
  const withdrawToken = async (
    tokenId: number,
    erc20Address: string,
    amount: number
  ) => {
    if (!contract || !wallet) return;
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const updateTrust = async (
    trustId: string,
    startTime: number,
    frequencyInDays: number
  ) => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const tx = await contract.updateTrust(
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
    } finally {
      setIsLoading(false);
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
      <LoadingOverlay visible={isLoading} overlayColor="black" />
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return React.useContext(Web3Context);
}
