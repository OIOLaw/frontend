import { ethers } from "ethers";
import contractConstants from "./contractConstants";

export const tokenAddresses: { [token: string]: { address: string, image: string } } = {
    "WETH": {
        address: "0x3f3fcc84ae7069fe4048f67dc02158ba10399242",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png'
    },
    "DAI": {
        address: "0x2bced6862b72ec4421f6c7412c040cec1364c043",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png'
    },
    "USDC": {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png'
    },
    "WBTC": {
        address: "0xa46dd1a3bf123fa6976c563acb432b533581eceb",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png'
    },
    "UNI": {
        address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png'
    },
    "MAKER": {
        address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png'
    },
    'MATIC': {
        address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
    }
}

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
