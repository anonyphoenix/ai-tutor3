"use client";

import FrontPage from "@/components/frontpage/index";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <FrontPage />
    </>
  );
}

export default App;
