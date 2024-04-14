import { defineStore } from "pinia";
import { ref } from "vue";

import * as ethers from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';





// This whole <string, State> and the type exports below are to make sure that the objects that we push in this store are of the correct format.
export const useMetaStore = defineStore("metaStore", () => {
  const ethersSigner = ref<ethers.Signer | undefined>(undefined);
  const ethersProvider = ref<ethers.BrowserProvider>;
  const sapSigner = ref<ethers.ethers.Signer & sapphire.SapphireAnnex | undefined>(undefined);
  const sapProvider = ref<ethers.BrowserProvider & sapphire.SapphireAnnex>();
  const address = ref<string | undefined>(undefined);
  const sensorList = ref([])

  // Normally we should get these adresses from the factory
  const deviceAddresses = ref<string[]>([]);
  // deviceAddresses.value = [
  //   "0x19e616e7eFe3e501144152F0c907aD0B22D8e8DD",
  //   "0xe00402656Ea5F71AD172787335fd0B4347869ed4",
  //   "0xA03c4CDB6f1174F7efa649dD7F96E8ccdeC4a656"
  // ]
  deviceAddresses.value = [
    "0x83c53AE9344381294342E817bbA8f1A6a2AD5a90",
    "0x5971C881bc769AB0C71077e7d84Df30CD3ca53B2",
    "0xaf3fec2A795fc989BdA3032E771974f794a70cc0",
    "0xd48159f68189Be5824bc11d9020c5946252B5690",
    "0xCDF36bcD4b034011b8fF1cc14c990878A0653944"
  ]

  const deviceABI = ref<any[]>([]);
  deviceABI.value = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pricePerSecond",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_deviceAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_revenueRecipient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_metadata",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DataWritten",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getExpirationTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRating",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "upvotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "downvotes",
              "type": "uint256"
            }
          ],
          "internalType": "struct Rating",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSubscribers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "metadata",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "readData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            }
          ],
          "internalType": "struct DataEntry",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endTimestamp",
          "type": "uint256"
        }
      ],
      "name": "readDataRange",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            }
          ],
          "internalType": "struct DataEntry[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_deviceAddress",
          "type": "address"
        }
      ],
      "name": "setDeviceAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_metadata",
          "type": "string"
        }
      ],
      "name": "setMetadata",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_revenueRecipient",
          "type": "address"
        }
      ],
      "name": "setRevenueRecipient",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        }
      ],
      "name": "subscribe",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_upVote",
          "type": "bool"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_data",
          "type": "string"
        }
      ],
      "name": "writeData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]


  return { sapSigner, sapProvider, address, deviceAddresses, deviceABI, ethersSigner, ethersProvider, sensorList };
});

