import { ethers } from "ethers";


const CONTRACT_ADDRESS = "0xYourContractAddressHere";
import GreenCreditTokenAbi from "../../../ABI/GreenCreditTokenAbi.json"; 

// ⚠️ Replace with your private key (keep this in .env.local, NEVER hardcode!)
const PRIVATE_KEY = process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY;

export async function registerCredit(tokenId, creditType, projectTitle, location, certificateHash) {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) throw new Error("MetaMask not found");

    // Create provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenCreditTokenAbi, signer);

    // Call your smart contract function
    console.log("⏳ Sending transaction...");

    const tx = await contract.registerCredit(
      tokenId,
      creditType,          // enum value (e.g., 0 for Carbon, 1 for Water, etc.)
      projectTitle,
      location,
      certificateHash
    );

    console.log("📡 Transaction sent:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);

    return receipt;
  } catch (error) {
    console.error("❌ Error in registerCredit:", error);
    throw error;
  }
}


export async function approveMint(user, tokenId, amount, expiryTimestamp) {
  try {
    // 1️⃣ Connect to provider (e.g., Sepolia / mainnet)
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    // 2️⃣ Load signer using private key
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    // 3️⃣ Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenCreditTokenAbi, signer);

    console.log("⏳ Sending approveMint transaction...");

    // 4️⃣ Send transaction
    const tx = await contract.approveMint(user, tokenId, amount, expiryTimestamp);
    console.log("📡 Transaction sent:", tx.hash);

    // 5️⃣ Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);

    // 6️⃣ Optional: 2-minute gap before next transaction
    console.log("⏸️ Waiting for 2 minutes before next action...");
    await new Promise((resolve) => setTimeout(resolve, 120000)); // 120000 ms = 2 min

    console.log("⏰ Done waiting!");
    return receipt;

  } catch (error) {
    console.error("❌ Error in approveMint:", error);
    throw error;
  }
}

export async function mintApprovedToken(tokenId, amount) {
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");

    // 1️⃣ Create provider and signer (user's wallet)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    // 2️⃣ Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenCreditTokenAbi, signer);

    console.log("⏳ Sending mintApprovedToken transaction...");

    // 3️⃣ Send transaction
    const tx = await contract.mintApprovedToken(tokenId, amount);
    console.log("📡 Transaction sent:", tx.hash);

    // 4️⃣ Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);

    // 5️⃣ Optional: Wait for 2 minutes (as you wanted earlier)
    console.log("⏸️ Waiting 2 minutes before next step...");
    await new Promise((resolve) => setTimeout(resolve, 120000)); // 2 min delay
    console.log("⏰ 2-minute delay complete");

    return receipt;
  } catch (error) {
    console.error("❌ Error in mintApprovedToken:", error);
    throw error;
  }
}


export async function getBalanceOf(tokenId) {
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");

    // 1️⃣ Connect to user's wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // 2️⃣ Create contract instance (read-only is fine)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenCreditTokenAbi, provider);

    // 3️⃣ Call balanceOf
    const balance = await contract.balanceOf(userAddress, tokenId);

    console.log(`💰 Balance for wallet ${userAddress} (Token ${tokenId}):`, balance.toString());

    return balance.toString();
  } catch (error) {
    console.error("❌ Error fetching balance:", error);
    throw error;
  }
}
