import React, { useState } from "react";
import { connectWallet, disconnectWallet, checkNetwork } from "./wallet";
import { fetchBalance } from "./stellar";
import { sendXLM } from "./transaction";

import "./index.css";

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const handleConnect = async () => {
    try {
      setError("");
      const key = await connectWallet();
      const net = await checkNetwork();
      if (net !== "TESTNET") {
        setError("Please switch Freighter to TESTNET");
        return;
      }
      const bal = await fetchBalance(key);
      setPublicKey(key);
      setNetwork(net);
      setBalance(bal);
    } catch (err) {
      setError(err.message || "Connection failed");
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setPublicKey(null);
    setNetwork(null);
    setBalance(null);
    setDestination("");
    setAmount("");
    setTxStatus("");
  };

  const handleSend = async () => {
    try {
      setError("");
      setTxStatus("");

      if (!publicKey) {
        setTxStatus("❌ Wallet not connected");
        return;
      }
      if (!destination || !amount) {
        setTxStatus("❌ Please enter destination and amount");
        return;
      }
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        setTxStatus("❌ Please enter a valid positive amount");
        return;
      }

      setTxStatus("⏳ Sending transaction...");
      const result = await sendXLM(publicKey, destination, amount);
      setTxStatus(`✅ Success! Hash: ${result.hash}`);

      const updatedBalance = await fetchBalance(publicKey);
      setBalance(updatedBalance);
      setDestination("");
      setAmount("");
    } catch (err) {
      console.error("FULL ERROR:", err);
      if (err.response && err.response.data) {
        setTxStatus("❌ " + JSON.stringify(err.response.data));
      } else {
        setTxStatus("❌ " + err.message);
      }
    }
  };

  return (
    <div className="container">
      <h1>STELLAR NEXUS</h1>

      {!publicKey ? (
        <button onClick={handleConnect} style={{ display: "block", margin: "0 auto" }}>
  Connect Freighter
</button>
      ) : (
        <>
          <p><strong>Connected:</strong> {publicKey}</p>
          <p><strong>Network:</strong> {network}</p>
          <p><strong>Balance:</strong> {balance} XLM</p>

          <button onClick={handleDisconnect}>Disconnect</button>

          <hr />

          <h3>Send XLM</h3>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  <input
    type="text"
    placeholder="Destination Address"
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
  />

  <input
    type="text"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />

  <button onClick={handleSend}>Send</button>
</div>
          {txStatus && <p>{txStatus}</p>}
        </>
      )}

      {error && <p className="error">{error}</p>}

      
    </div>
  );
}

export default App;