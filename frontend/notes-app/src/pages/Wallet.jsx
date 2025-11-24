// FIX: Always expose Buffer in lazy loaded modules
import { Buffer as BufferPolyfill } from "buffer/";
window.Buffer = BufferPolyfill;

import React, { useState, useEffect } from "react";
import { Blockfrost, Lucid } from "lucid-cardano";

const CARDANO_NETWORK = import.meta.env.VITE_CARDANO_NETWORK || "Preprod";
const BLOCKFROST_PROJECT_ID = import.meta.env.VITE_BLOCKFROST_PROJECT_ID_PREPROD || "";

console.log("CARDANO_NETWORK =", CARDANO_NETWORK);
console.log("PREPROD_ID =", BLOCKFROST_PROJECT_ID);

export default function Wallet() {
  const [lucid, setLucid] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [address, setAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWallets = () => {
      if (window.cardano) setWallets(Object.keys(window.cardano));
    };
    loadWallets();
    const interval = setInterval(loadWallets, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setError("");
    if (!selectedWallet) return setError("Select a wallet first");
    
    try {
      setLoading(true);
      console.log("[Wallet] Initializing Lucid...");
      
      const lucidInstance = await Lucid.new(
        new Blockfrost(
          "https://cardano-preprod.blockfrost.io/api/v0",
          BLOCKFROST_PROJECT_ID
        ),
        "Preprod"
      );
      
      console.log("[Wallet] Connecting to", selectedWallet);
      const api = await window.cardano[selectedWallet].enable();
      lucidInstance.selectWallet(api);
      
      const addr = await lucidInstance.wallet.address();
      setAddress(addr);
      setLucid(lucidInstance);
      console.log("[Wallet] ✓ Connected:", addr);
    } catch (err) {
      console.error("[Wallet] Connection error:", err);
      setError("Connection failed: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setLucid(null);
    setAddress("");
    setSelectedWallet("");
    setTxHash("");
    setError("");
  };

  const handleSend = async () => {
    setError("");
    setTxHash("");
    if (!lucid) return setError("Connect your wallet first");
    if (!recipient) return setError("Enter recipient address");
    
    const lovelace = parseFloat(amount);
    if (isNaN(lovelace) || lovelace <= 0) return setError("Enter valid amount in Lovelace");

    try {
      setLoading(true);
      console.log("[Transaction] Building transaction...");
      
      const tx = await lucid
        .newTx()
        .payToAddress(recipient, { lovelace: BigInt(Math.floor(lovelace)) })
        .complete();
      
      console.log("[Transaction] Signing...");
      const signedTx = await tx.sign().complete();
      
      console.log("[Transaction] Submitting...");
      const hash = await signedTx.submit();
      
      console.log("[Transaction] ✓ Success! Hash:", hash);
      setTxHash(hash);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error("[Transaction] Error:", err);
      setError("Transaction failed: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui, Arial, sans-serif" }}>
      <h2>Cardano Wallet (Preprod) - Lucid</h2>

      <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f0f8ff", borderRadius: "4px" }}>
        <strong>Network:</strong> {CARDANO_NETWORK} <br />
        <strong>Blockfrost ID:</strong> {BLOCKFROST_PROJECT_ID ? BLOCKFROST_PROJECT_ID.slice(0, 8) + "..." : "(not set)"}
      </div>

      {!lucid ? (
        <div style={{ marginBottom: "1.5rem" }}>
          <label>
            Select Wallet:
            <select value={selectedWallet} onChange={(e) => setSelectedWallet(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">-- Select --</option>
              {wallets.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </label>
          <button onClick={handleConnect} disabled={!selectedWallet || loading} style={{ marginLeft: 12 }}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "green" }}>✓ Wallet Connected</p>
          <p><strong>Address:</strong> {address}</p>
          <button onClick={handleDisconnect}>Disconnect Wallet</button>
        </div>
      )}

      {lucid && (
        <div>
          <h3>Send ADA</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 480 }}>
            <input
              type="text"
              placeholder="Recipient address (addr_test1...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Amount in Lovelace (1 ADA = 1,000,000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !recipient || !amount}>
              {loading ? "Sending..." : "Send ADA"}
            </button>
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "1rem", padding: "0.75rem", backgroundColor: "#fee", borderRadius: "4px" }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {txHash && (
            <div style={{ color: "green", wordBreak: "break-all", marginTop: "1rem", padding: "0.75rem", backgroundColor: "#efe", borderRadius: "4px" }}>
              <strong>Success!</strong> Transaction submitted!<br />
              <strong>Hash:</strong> {txHash}
            </div>
          )}
        </div>
      )}
    </div>
  );
}