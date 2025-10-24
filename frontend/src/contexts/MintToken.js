import { ethers } from "ethers";


const CONTRACT_ADDRESS = "0x22967648f6d5e2DAece0dc230f6a86705be89346";
import gctabi from "../../../ABI/GreenCreditTokenAbi"; 

// ⚠️ Replace with your private key (keep this in .env.local, NEVER hardcode!)
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

export async function registerCredit(tokenId, creditType, projectTitle, location, certificateHash) {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) throw new Error("MetaMask not found");

    // Create provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = signer.getAddress();
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, gctabi, signer);

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

  await approveMint(userAddress,tokenId,1000,1861316834);
    console.log("✅ Aprooved Mint transaction successful")

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
    const contract = new ethers.Contract(CONTRACT_ADDRESS, gctabi, signer);

    console.log("⏳ Sending approveMint transaction...");

    // 4️⃣ Send transaction
    const tx = await contract.approveMint(user, tokenId, amount, expiryTimestamp);
    console.log("📡 Transaction sent:", tx.hash);

    // 5️⃣ Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);

    // 6️⃣ Optional: 2-minute gap before next transaction
    console.log("⏸️ Waiting for 2 minutes before next action...");
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 20000 ms = 20 sec

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
    const contract = new ethers.Contract(CONTRACT_ADDRESS, gctabi, signer);

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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // 2️⃣ Create contract instance (read-only is fine)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, gctabi, provider);

    // 3️⃣ Call balanceOf
    const balance = await contract.balanceOf(userAddress, tokenId);

    console.log(`💰 Balance for wallet ${userAddress} (Token ${tokenId}):`, balance.toString());

    return balance.toString();
  } catch (error) {
    console.error("❌ Error fetching balance:", error);
    throw error;
  }
}

export const fetchCreditInfo = async (tokenId) => {
  try {
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, gctabi, provider);


    // Call the function
    const creditInfo = await contract.getCreditInfo(tokenId);

    console.log('Credit Info:', creditInfo);
    return creditInfo;
  } catch (err) {
    console.error('Error fetching credit info:', err);
    throw err;
  }
};