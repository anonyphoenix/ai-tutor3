"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateLevelAndMaxXp } from "@/lib/utils";
import { Progress } from "@radix-ui/react-progress";
import { progress, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useUserContext } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://opencampus-codex.blockscout.com/api/v2";

interface AddressInfo {
  hash: string;
  name: string;
  implementation_name: string;
  is_contract: boolean;
  token: {
    name: string;
    symbol: string;
    total_supply: string;
    decimals: string;
  };
}

interface AddressCounters {
  transactions_count: string;
  token_transfers_count: string;
  gas_usage_count: string;
  validations_count: string;
}

interface TokenBalance {
  token: {
    name: string;
    symbol: string;
    address: string;
    type: string;
  };
  value: string;
}

interface Transaction {
  hash: string;
  block: number;
  value: string;
  gas_price: string;
  type: string;
}

interface CoinBalanceHistoryItem {
  date: string;
  value: string;
}

export default function StudentProfile() {
  const { address } = useAccount();
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [addressCounters, setAddressCounters] =
    useState<AddressCounters | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [coinBalanceHistory, setCoinBalanceHistory] = useState<
    CoinBalanceHistoryItem[]
  >([]);
  const { user } = useUserContext();
  const { data: xpData } = useQuery({
    queryKey: ["userStats", user?.xp],
    queryFn: () => {
      if (!user?.xp) {
        return null;
      }
      const { level, currentXp, maxXp } = calculateLevelAndMaxXp(
        Number(user.xp)
      );
      const progress = (currentXp / maxXp) * 100;
      return { level, currentXp, maxXp, progress };
    },
    enabled: !!user?.xp,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (address) {
      fetchAddressInfo();
      fetchAddressCounters();
      fetchTokenBalances();
      fetchTransactions();
      fetchCoinBalanceHistory();
    }
  }, [address]);

  const fetchAddressInfo = async () => {
    const response = await fetch(`${BASE_URL}/addresses/${address}`);
    const data = await response.json();
    setAddressInfo(data);
  };

  const fetchAddressCounters = async () => {
    const response = await fetch(`${BASE_URL}/addresses/${address}/counters`);
    const data = await response.json();
    setAddressCounters(data);
  };

  const fetchTokenBalances = async () => {
    const response = await fetch(
      `${BASE_URL}/addresses/${address}/token-balances`
    );
    const data = await response.json();
    setTokenBalances(data.items);
  };

  const fetchTransactions = async () => {
    const response = await fetch(
      `${BASE_URL}/addresses/${address}/transactions?limit=5`
    );
    const data = await response.json();
    setTransactions(data.items);
  };

  const fetchCoinBalanceHistory = async () => {
    const response = await fetch(
      `${BASE_URL}/addresses/${address}/coin-balance-history-by-day`
    );
    const data = await response.json();
    setCoinBalanceHistory(data.items);
  };

  if (!address) {
    return <div>Please connect your wallet to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Student Profile</h1>

      {xpData && user && (
        <Card>
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Level {xpData.level}</h2>
              <p className="text-sm text-muted-foreground">
                XP: {xpData.currentXp} / {xpData.maxXp}
              </p>
              <p className="text-xs text-muted-foreground">
                Total XP: {user.xp}
              </p>
            </div>
            <div className="relative pt-1">
              <Progress value={xpData.progress} className="h-4" />
              <motion.div
                className="absolute top-0 left-0 h-4 bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Address:</strong> {addressInfo?.hash}
          </p>
          <p>
            <strong>Name:</strong> {addressInfo?.name || "N/A"}
          </p>
          <p>
            <strong>Is Contract:</strong>{" "}
            {addressInfo?.is_contract ? "Yes" : "No"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Transactions:</strong> {addressCounters?.transactions_count}
          </p>
          <p>
            <strong>Token Transfers:</strong>{" "}
            {addressCounters?.token_transfers_count}
          </p>
          <p>
            <strong>Gas Used:</strong> {addressCounters?.gas_usage_count}
          </p>
          <p>
            <strong>Blocks Validated:</strong>{" "}
            {addressCounters?.validations_count}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="tokens">
        <TabsList>
          <TabsTrigger value="tokens">Token Balances</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="balance-history">Balance History</TabsTrigger>
        </TabsList>
        <TabsContent value="tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenBalances?.map((balance, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {balance.token.name} ({balance.token.symbol})
                  </TableCell>
                  <TableCell>{formatEther(BigInt(balance.value))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="transactions">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.hash.slice(0, 10)}...</TableCell>
                  <TableCell>{tx.block}</TableCell>
                  <TableCell>{formatEther(BigInt(tx.value))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="balance-history">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={coinBalanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}
