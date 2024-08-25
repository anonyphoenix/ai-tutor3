export const TOPUP_CONTRACT_ADDRESS =
  "0xd74a7CC422443ed6606a953B5428305Df23b1047";
export const TOPUP_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_treasury",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethPaid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "creditsReceived",
        type: "uint256",
      },
    ],
    name: "CreditsPurchased",
    type: "event",
  },
  {
    inputs: [],
    name: "CREDITS_PER_ETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkCredits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "topUpCredits",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "updateTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userCredits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
