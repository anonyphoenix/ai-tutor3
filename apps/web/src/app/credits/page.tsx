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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  extractEventAction,
  fetchPurchaseHistoryAction,
  Purchase,
} from "../actions/db";
import { useUserContext } from "../contexts/UserContext";
import {
  TOPUP_CONTRACT_ABI,
  TOPUP_CONTRACT_ADDRESS,
} from "@/utils/constants/topup";

const CREDITS_PER_ETH = 10000;

export default function Component() {
  const [credits, setCredits] = useState(100);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const nativeCurrencySymbol = chain?.nativeCurrency.symbol || "ETH";
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>();
  const { writeContract, data: hash } = useWriteContract();
  const {
    isLoading,
    isSuccess,
    data: successData,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const { refreshUser } = useUserContext();

  useEffect(() => {
    if (isSuccess && successData) {
      console.log("Transaction successful, extracting event data...");
      extractEventAction(successData.transactionHash).then((eventData) => {
        console.log("Extracted event data:", eventData);
        refreshUser(); // Refresh credits after successful purchase
      });
    }
  }, [isSuccess, successData]);

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (address) {
        try {
          const purchases = await fetchPurchaseHistoryAction(address);
          setPurchaseHistory(purchases || []);
        } catch (error) {
          console.error("Failed to fetch user credits:", error);
        }
      }
    };

    if (isConnected && address) {
      fetchUserCredits();
    }
  }, [isConnected, address, isSuccess]);

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
      address: TOPUP_CONTRACT_ADDRESS,
      abi: TOPUP_CONTRACT_ABI,
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
      <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Pricing</h2>
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
                {(1000 / CREDITS_PER_ETH).toFixed(2)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5,000</TableCell>
              <TableCell>
                {(5000 / CREDITS_PER_ETH).toFixed(2)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10,000</TableCell>
              <TableCell>
                {(10000 / CREDITS_PER_ETH).toFixed(2)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>50,000</TableCell>
              <TableCell>
                {(50000 / CREDITS_PER_ETH).toFixed(2)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>100,000</TableCell>
              <TableCell>
                {(100000 / CREDITS_PER_ETH).toFixed(2)} {nativeCurrencySymbol}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Cost ({nativeCurrencySymbol})</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHistory?.map((purchase: Purchase, index) => (
              <TableRow key={index}>
                <TableCell>
                  {purchase.purchasedAt &&
                    format(
                      new Date(purchase.purchasedAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                </TableCell>
                <TableCell>{purchase.creditsReceived}</TableCell>
                <TableCell>
                  {formatEther(BigInt(purchase.ethPaid))} {nativeCurrencySymbol}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
