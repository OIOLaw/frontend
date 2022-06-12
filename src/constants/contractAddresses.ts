import { ethers } from "ethers";
import contractConstants from "./contractConstants";

export const tokenAddresses = {
  WETH: "0x3f3fcc84ae7069fe4048f67dc02158ba10399242",
  DAI: "0x2bced6862b72ec4421f6c7412c040cec1364c043",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
};

// write addresses here, or read them from environment
const contractAddresses: Readonly<{
  [contractName: string]: { [chainId: number]: string | undefined };
}> = {
  [contractConstants.Counter.contractName]: {
    31337: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  [contractConstants.MyToken.contractName]: {
    31337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  },
};

/**
 * Gets the contract address, with respect to the contract name and chainId.
 *
 * @param {string} contractName name of the contract you want to connect
 * @param {number} chainId chainId of the chain where the contract is deployed at (e.g. 31337)
 * @throws
 *  if contract name does not exist,
 *  if the chainId is not listed under the contract name,
 *  if the address is explicitly undefined,
 *  if the address format is invalid
 */
function getContractAddress(contractName: string, chainId: number): string {
  // check if contract name is in the list
  if (!(contractName in contractAddresses))
    throw new Error("No such contract: " + contractName);

  // check if contract address is added
  if (!(chainId in contractAddresses[contractName]))
    throw new Error("Contract not in chainId: " + chainId);

  const addr = contractAddresses[contractName][chainId];

  // you might intentionally set address to undefined during development
  if (addr == undefined) throw new Error("Address not yet defined.");
  if (!ethers.utils.isAddress(addr)) throw new Error("Invalid address format.");

  return addr;
}

export default getContractAddress;
