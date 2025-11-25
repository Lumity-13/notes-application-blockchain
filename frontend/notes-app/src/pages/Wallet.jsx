import { Buffer as BufferPolyfill } from "buffer/";
window.Buffer = BufferPolyfill;

import React, { useState, useEffect } from "react";
import { Blockfrost, Lucid } from "lucid-cardano";
import "../css/Wallet.css";

const CARDANO_NETWORK = import.meta.env.VITE_CARDANO_NETWORK || "Preprod";
const BLOCKFROST_PROJECT_ID = import.meta.env.VITE_BLOCKFROST_PROJECT_ID_PREPROD || "";

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
      const lucidInstance = await Lucid.new(
        new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", BLOCKFROST_PROJECT_ID),
        "Preprod"
      );
      const api = await window.cardano[selectedWallet].enable();
      lucidInstance.selectWallet(api);
      const addr = await lucidInstance.wallet.address();
      setAddress(addr);
      setLucid(lucidInstance);
    } catch (err) {
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
      const tx = await lucid.newTx().payToAddress(recipient, { lovelace: BigInt(Math.floor(lovelace)) }).complete();
      const signedTx = await tx.sign().complete();
      const hash = await signedTx.submit();
      setTxHash(hash);
      setRecipient("");
      setAmount("");
    } catch (err) {
      setError("Transaction failed: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-wrapper">
      <h2>Cardano Wallet (Preprod) - Lucid</h2>

      <div className="wallet-info-box">
        <strong>Network:</strong> {CARDANO_NETWORK}
        <strong>Blockfrost ID:</strong> {BLOCKFROST_PROJECT_ID ? BLOCKFROST_PROJECT_ID.slice(0, 8) + "..." : "(not set)"}
      </div>

      {!lucid ? (
        <div className="wallet-section">
          <label>Select Wallet:</label>
          <select value={selectedWallet} onChange={(e) => setSelectedWallet(e.target.value)}>
            <option value="">-- Select --</option>
            {wallets.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <button onClick={handleConnect} disabled={!selectedWallet || loading}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div className="wallet-connected">
          <p>✓ Wallet Connected</p>
          <p><strong>Address:</strong> {address}</p>
          <button onClick={handleDisconnect}>Disconnect Wallet</button>
        </div>
      )}

      {lucid && (
        <div className="wallet-section">
          <h3>Send ADA</h3>
          <div className="wallet-input-group">
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

          {error && <div className="wallet-error"><strong>Error:</strong> {error}</div>}
          {txHash && <div className="wallet-success"><strong>Success!</strong> Transaction submitted!<br /><strong>Hash:</strong> {txHash}</div>}
        </div>
      )}
    </div>
  );
}
