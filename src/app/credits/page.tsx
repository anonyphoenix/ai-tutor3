"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants";
import { use, useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

// Conversion rate from the smart contract
const CREDITS_PER_ETH = 10000;

export default function Component() {
  const [credits, setCredits] = useState(100);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const nativeCurrencySymbol = chain?.nativeCurrency.symbol || "ETH";
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const { writeContract, data: hash } = useWriteContract();
  const {
    isLoading,
    isSuccess,
    data: successData,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log("successData: ", successData);
    }
  }, [isSuccess]);

  const calculateCost = (credits: number) => {
    return parseFloat(
      formatEther((BigInt(credits) * BigInt(1e18)) / BigInt(CREDITS_PER_ETH))
    );
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
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
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
          {calculateCost(credits).toFixed(6)} {nativeCurrencySymbol}
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
      <div className="flex items-center justify-center w-full p-8 md:w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credits</TableHead>
              <TableHead>Cost in {nativeCurrencySymbol}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1,000</TableCell>
              <TableCell>
                {(1000 / CREDITS_PER_ETH).toFixed(4)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5,000</TableCell>
              <TableCell>
                {(5000 / CREDITS_PER_ETH).toFixed(4)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10,000</TableCell>
              <TableCell>
                {(10000 / CREDITS_PER_ETH).toFixed(4)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>50,000</TableCell>
              <TableCell>
                {(50000 / CREDITS_PER_ETH).toFixed(4)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>100,000</TableCell>
              <TableCell>
                {(100000 / CREDITS_PER_ETH).toFixed(4)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {/* <div className="w-full p-8 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Recent Purchases</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>ETH Paid</TableHead>
              <TableHead>Credits Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHistory.map((purchase, index) => (
              <TableRow key={index}>
                <TableCell>
                  {purchase.user.slice(0, 6)}...{purchase.user.slice(-4)}
                </TableCell>
                <TableCell>
                  {parseFloat(purchase.ethPaid).toFixed(4)}{" "}
                  {nativeCurrencySymbol}
                </TableCell>
                <TableCell>{purchase.creditsReceived}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
}
