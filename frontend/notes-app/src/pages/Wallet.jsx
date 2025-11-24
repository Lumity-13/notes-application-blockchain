// FIX: Always expose Buffer in lazy loaded modules
import { Buffer as BufferPolyfill } from "buffer/";
window.Buffer = BufferPolyfill;

// Wallet.jsx — Simplified version for Blaze SDK 0.1.7
import React, { useState, useEffect, useMemo } from "react";
import { Blockfrost, WebWallet, Blaze, Core } from "@blaze-cardano/sdk";

// Read network + project id from Vite env
console.log("CARDANO_NETWORK =", import.meta.env.VITE_CARDANO_NETWORK);
console.log("PREPROD_ID =", import.meta.env.VITE_BLOCKFROST_PROJECT_ID_PREPROD);

const CARDANO_NETWORK = import.meta.env.VITE_CARDANO_NETWORK || "cardano-preprod";
const BLOCKFROST_PROJECT_ID =
  (CARDANO_NETWORK === "cardano-preprod" && import.meta.env.VITE_BLOCKFROST_PROJECT_ID_PREPROD) ||
  (CARDANO_NETWORK === "cardano-testnet" && import.meta.env.VITE_BLOCKFROST_PROJECT_ID_TESTNET) ||
  (CARDANO_NETWORK === "cardano-preview" && import.meta.env.VITE_BLOCKFROST_PROJECT_ID_PREVIEW) ||
  "";

if (!BLOCKFROST_PROJECT_ID) {
  console.warn(
    `[Wallet] No Blockfrost project id set in env for network=${CARDANO_NETWORK}. ` +
      `Set VITE_BLOCKFROST_PROJECT_ID_PREPROD (or matching var) in .env`
  );
}

// helper: parse amount to BigInt (lovelace)
const parseLovelace = (val) => {
  try {
    const s = typeof val === "string" ? val.trim() : String(val);
    if (s === "" || s == null) return null;
    if (s.includes(".") || s.includes(",")) return null;
    const bi = BigInt(s);
    if (bi < 0n) return null;
    return bi;
  } catch {
    return null;
  }
};

export default function Wallet() {
  const [walletApi, setWalletApi] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [walletAddressHex, setWalletAddressHex] = useState("");
  const [walletAddressBech32, setWalletAddressBech32] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // provider memoized with wrapped parameter fetching
  const provider = useMemo(() => {
    const baseProvider = new Blockfrost({
      network: CARDANO_NETWORK,
      projectId: BLOCKFROST_PROJECT_ID,
    });
    
    // Wrap getParameters to fix missing values
    const originalGetParameters = baseProvider.getParameters.bind(baseProvider);
    baseProvider.getParameters = async () => {
      const params = await originalGetParameters();
      console.log("[Provider] Raw params from Blockfrost:", params);
      
      // Fix missing parameters with Preprod defaults
      return {
        ...params,
        minFeeA: params.minFeeA ?? params.min_fee_a ?? 44,
        minFeeB: params.minFeeB ?? params.min_fee_b ?? 155381,
        coinsPerUtxoSize: params.coinsPerUtxoSize ?? params.coins_per_utxo_size ?? params.coins_per_utxo_word ?? 4310,
        maxTxSize: params.maxTxSize ?? params.max_tx_size ?? 16384,
        maxBlockHeaderSize: params.maxBlockHeaderSize ?? params.max_block_header_size ?? 1100,
        stakeKeyDeposit: params.stakeKeyDeposit ?? params.key_deposit ?? 2000000,
        poolDeposit: params.poolDeposit ?? params.pool_deposit ?? 500000000,
        minPoolCost: params.minPoolCost ?? params.min_pool_cost ?? 340000000,
        priceMem: params.priceMem ?? params.price_mem ?? 0.0577,
        priceStep: params.priceStep ?? params.price_step ?? 0.0000721,
      };
    };
    
    return baseProvider;
  }, []);

  useEffect(() => {
    const loadWallets = () => {
      if (window.cardano && typeof Object.keys === "function") {
        setWallets(Object.keys(window.cardano));
      }
    };
    loadWallets();
    const interval = setInterval(loadWallets, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWalletChange = (e) => setSelectedWallet(e.target.value);

  const handleConnectWallet = async () => {
    setError("");
    if (!selectedWallet) return setError("Select a wallet first");
    if (!window.cardano || !window.cardano[selectedWallet]) {
      return setError("Selected wallet extension not found in window.cardano");
    }

    try {
      setLoading(true);
      const api = await window.cardano[selectedWallet].enable();
      setWalletApi(api);

      const addressHex = await api.getChangeAddress();
      setWalletAddressHex(addressHex || "");

      try {
        const bech = Core.Address.fromBytes(Buffer.from(addressHex, "hex")).toBech32();
        setWalletAddressBech32(bech);
        console.log("[Wallet] connected address (bech32):", bech);
      } catch (convErr) {
        console.warn("[Wallet] failed to convert address to bech32:", convErr);
        setWalletAddressBech32("");
      }
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError("Failed to connect wallet: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletApi(null);
    setWalletAddressHex("");
    setWalletAddressBech32("");
    setSelectedWallet("");
    setTxHash("");
    setError("");
  };

  // SIMPLIFIED: Transaction submission with Blaze 0.1.7
  const handleSubmitTransaction = async () => {
    setError("");
    setTxHash("");
    if (!walletApi) return setError("Connect your wallet first");
    if (!recipient) return setError("Enter recipient address");
    const lovelace = parseLovelace(amount);
    if (!lovelace) return setError("Enter a valid integer amount in Lovelace");

    try {
      setLoading(true);

      console.log("[Transaction] Step 1: Creating WebWallet...");
      const wallet = new WebWallet(walletApi);

      console.log("[Transaction] Step 1.5: Checking wallet UTxOs...");
      try {
        const utxos = await wallet.getUnspentOutputs();
        console.log("[Transaction] UTxOs available:", utxos?.length);
        if (utxos && utxos.length > 0) {
          const firstUtxo = utxos[0];
          const output = firstUtxo.output();
          const amount = output.amount();
          console.log("[Transaction] First UTxO has:", amount.coin().to_str(), "lovelace");
        }
      } catch (e) {
        console.warn("[Transaction] Could not inspect UTxOs:", e);
      }

      console.log("[Transaction] Step 2: Creating Blaze instance...");
      const blaze = await Blaze.from(provider, wallet);
      console.log("[Transaction] Blaze instance created successfully");
      
      console.log("[Transaction] Step 2.5: Checking protocol parameters...");
      try {
        const params = await provider.getParameters();
        console.log("[Transaction] Protocol params:", {
          minFeeA: params.minFeeA,
          minFeeB: params.minFeeB,
          maxTxSize: params.maxTxSize,
          coinsPerUtxoSize: params.coinsPerUtxoSize,
        });
      } catch (e) {
        console.warn("[Transaction] Could not get parameters:", e);
      }

      console.log("[Transaction] Step 3: Parsing recipient address...");
      const recipientAddress = Core.Address.fromBech32(recipient);
      console.log("[Transaction] Recipient parsed:", recipientAddress.toBech32());

      console.log("[Transaction] Step 4: Building transaction...");
      const txBuilder = blaze.newTransaction();
      txBuilder.payLovelace(recipientAddress, BigInt(lovelace));

      console.log("[Transaction] Step 5: Completing transaction...");
      const tx = await txBuilder.complete();
      console.log("[Transaction] ✓ Transaction completed!");

      console.log("[Transaction] Step 6: Signing...");
      const witness = await blaze.signTransaction(tx);
      console.log("[Transaction] Witness created:", witness);
      console.log("[Transaction] Witness type:", typeof witness);
      console.log("[Transaction] Witness constructor:", witness?.constructor?.name);

      console.log("[Transaction] Step 7: Preparing transaction for submission...");
      
      // Try multiple methods to get the transaction hex
      let txHex = null;
      
      // Method 1: Direct serialization methods
      if (witness.toHex) {
        txHex = witness.toHex();
        console.log("[Transaction] Got hex via toHex()");
      } else if (witness.to_hex) {
        txHex = witness.to_hex();
        console.log("[Transaction] Got hex via to_hex()");
      } else if (witness.toCbor) {
        txHex = witness.toCbor();
        console.log("[Transaction] Got hex via toCbor()");
      } else if (witness.to_bytes) {
        const bytes = witness.to_bytes();
        txHex = Buffer.from(bytes).toString('hex');
        console.log("[Transaction] Got hex via to_bytes()");
      } else if (typeof witness === 'string') {
        txHex = witness;
        console.log("[Transaction] Witness was already a string");
      }
      
      if (!txHex) {
        console.error("[Transaction] Could not serialize witness. Available methods:", Object.keys(witness));
        throw new Error("Could not serialize signed transaction");
      }
      
      console.log("[Transaction] TX Hex length:", txHex.length);
      console.log("[Transaction] TX Hex (first 100 chars):", txHex.substring(0, 100));
      
      console.log("[Transaction] Step 8: Submitting to Blockfrost...");
      
      // Bypass Blaze's broken postTransactionToChain and submit directly to Blockfrost
      const response = await fetch(`https://cardano-preprod.blockfrost.io/api/v0/tx/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/cbor',
          'project_id': BLOCKFROST_PROJECT_ID,
        },
        body: Buffer.from(txHex, 'hex'),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Transaction] Blockfrost error:", errorText);
        throw new Error(`Transaction submission failed: ${response.status} ${errorText}`);
      }
      
      const hash = await response.text();
      console.log("[Transaction] Raw response:", hash);

      console.log("[Transaction] SUCCESS! Hash:", hash);
      setTxHash(hash);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error("❌ Transaction error:", err);
      console.error("Full error details:", {
        message: err?.message,
        stack: err?.stack,
        name: err?.name,
      });
      setError("Transaction failed: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui, Arial, sans-serif" }}>
      <h2>Cardano Wallet (Preprod) - Blaze 0.1.9</h2>

      <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f0f8ff", borderRadius: "4px" }}>
        <strong>Provider network:</strong> {CARDANO_NETWORK} <br />
        <strong>Blockfrost project id:</strong>{" "}
        {BLOCKFROST_PROJECT_ID ? BLOCKFROST_PROJECT_ID.slice(0, 8) + "..." : "(not set)"}
        <p style={{ fontSize: 12, color: "#666", marginTop: "0.5rem" }}>
          Make sure your Lace extension is set to <em>Preprod</em> and your .env uses the matching Preprod key.
        </p>
      </div>

      {!walletApi ? (
        <div style={{ marginBottom: "1.5rem" }}>
          <label>
            Select Wallet:
            <select value={selectedWallet} onChange={handleWalletChange} style={{ marginLeft: 8 }}>
              <option value="">-- Select --</option>
              {wallets.length > 0
                ? wallets.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))
                : null}
            </select>
          </label>
          <button onClick={handleConnectWallet} disabled={!selectedWallet || loading} style={{ marginLeft: 12 }}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "green" }}>✓ Wallet Connected</p>
          <p>
            <strong>Address (bech32):</strong>{" "}
            {walletAddressBech32 || (walletAddressHex ? Core.Address.fromBytes(Buffer.from(walletAddressHex, "hex")).toBech32() : "—")}
          </p>
          <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
        </div>
      )}

      {walletApi && (
        <div>
          <h3>Send ADA</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 480 }}>
            <input
              type="text"
              placeholder="Recipient Bech32 address (addr_test1...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Amount in Lovelace (1 ADA = 1,000,000 Lovelace)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleSubmitTransaction} disabled={loading || !recipient || !amount}>
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