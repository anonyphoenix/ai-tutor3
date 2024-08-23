"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x...";
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "topUpCredits",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export default function Component() {
  const [credits, setCredits] = useState(100);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const calculateCost = (credits: number) => {
    if (credits < 2500) return credits * 0.09;
    if (credits < 5000) return credits * 0.085;
    if (credits < 10000) return credits * 0.075;
    if (credits < 20000) return credits * 0.07;
    if (credits < 50000) return credits * 0.065;
    if (credits < 100000) return credits * 0.06;
    return credits * 0.055;
  };

  const handleBuyCredits = async () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    const cost = calculateCost(credits);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "topUpCredits",
      args: [],
      value: parseEther(cost.toString()),
    });
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col items-center justify-center w-full p-8 space-y-4 md:w-1/2">
        <h2 className="text-2xl font-bold text-center">
          How many credits would you like to purchase?
        </h2>
        <p className="text-center text-muted-foreground">
          Calculate your credit cost
        </p>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="w-24 text-center border-2 border-blue-500 rounded-md"
          />
          <span>credits</span>
        </div>
        <div className="text-4xl font-bold text-center text-primary">
          ${calculateCost(credits).toFixed(2)}
        </div>
        <p className="text-center text-muted-foreground">one time</p>
        <Button
          className="w-full max-w-xs bg-red-600 hover:bg-red-700"
          onClick={handleBuyCredits}
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : isConnected
              ? "BUY CREDITS"
              : "Connect Wallet"}
        </Button>
        {isSuccess && (
          <p className="text-green-500">Credits purchased successfully!</p>
        )}
      </div>
      <div className="w-full p-8 md:w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credits</TableHead>
              <TableHead>Cost per Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-red-600">100 - 2,499</TableCell>
              <TableCell className="text-red-600">9.0¢</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2,500 - 4,999</TableCell>
              <TableCell>8.5¢</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5,000 - 9,999</TableCell>
              <TableCell>7.5¢</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10,000 - 19,999</TableCell>
              <TableCell>7.0¢</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>20,000 - 49,999</TableCell>
              <TableCell>6.5¢</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>50,000 - 99,999</TableCell>
              <TableCell>6.0¢</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>100,000 - 249,999</TableCell>
              <TableCell>5.5¢</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4 text-center">
          <Link
            href="#"
            className="text-blue-600 hover:underline"
            prefetch={false}
          >
            Have a group code?
          </Link>
        </div>
      </div>
    </div>
  );
}
