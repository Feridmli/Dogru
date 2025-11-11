// SeaportUtils.js — BearHustle Marketplace üçün
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.0/dist/ethers.esm.min.js";
import { Seaport } from "https://cdn.jsdelivr.net/npm/@opensea/seaport-js@latest/dist/seaport.esm.min.js";
import WalletConnectProvider from "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js";

// ---------- KONTRAKT ADRESSLƏRİ ----------
export const PROXY_ADDRESS = "0x9656448941C76B79A39BC4ad68f6fb9F01181EC7";
export const NFT_CONTRACT_ADDRESS = "0x54a88333F6e7540eA982261301309048aC431eD5";

// ---------- CÜZDAN QOŞMA ----------
export async function connectWallet() {
  try {
    let provider;

    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else {
      const wcProvider = new WalletConnectProvider({
        rpc: {
          8453: "https://rpc.apecoin.io" // ApeChain RPC
        },
        chainId: 8453,
        qrcode: true
      });

      await wcProvider.enable();
      provider = new ethers.BrowserProvider(wcProvider);
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("✅ Wallet qoşuldu:", address);
    return { provider, signer, address };

  } catch (err) {
    console.error("❌ Wallet qoşulma xətası:", err);
    alert("Cüzdan qoşulmadı. Zəhmət olmasa icazə verin.");
    throw err;
  }
}

// ---------- NFT ALIŞI (FULFILL ORDER) ----------
export async function fulfillOrder(seaport, signer, order, options = {}) {
  try {
    if (!seaport)
      seaport = new Seaport(signer, { contractAddress: PROXY_ADDRESS });

    const tx = await seaport.fulfillOrder({
      order: order.seaportOrder,
      accountAddress: await signer.getAddress(),
      recipient: options.recipient || await signer.getAddress()
    });

    console.log("⏳ Transaction göndərildi:", tx.hash);
    await tx.wait();
    alert(`✅ NFT #${order.tokenId} uğurla alındı!`);
    return tx;
  } catch (e) {
    console.error("❌ Fulfill error:", e);
    alert("NFT alışı uğursuz oldu!");
    throw e;
  }
}

// ---------- KONTRAKT ÜNVANI ----------
export function getNFTContractAddress() {
  return NFT_CONTRACT_ADDRESS;
}