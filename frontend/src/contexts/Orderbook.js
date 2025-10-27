import { ethers } from "ethers";
import orderbookAbi from "../../../ABI/GreenXchangeOrderbookAbi"
import greenCreditAbi from "../../../ABI/GreenCreditTokenAbi";


// ---- Contract addresses ----
const ORDERBOOK_ADDRESS = "0x5606f038a656684746f0F8a6e5eEf058de2fe05c";
const GREEN_CREDIT_ADDRESS = "0xa82fA397006c6314B0bfFCBAA06FbfbcC805b619";
const PYUSD_ADDRESS = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";

// ---- Helpers ----
async function getSigner() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

async function getContract(address, abi, useSigner = true) {
  const signerOrProvider = useSigner ? await getSigner() : new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(address, abi, signerOrProvider);
}

// ---------------- Contract Functions ----------------

// ✅ Approve GreenCreditToken (ERC1155)
export async function approveGreenCredit() {
  try {
    const contract = await getContract(GREEN_CREDIT_ADDRESS, greenCreditAbi);
    const tx = await contract.setApprovalForAll(ORDERBOOK_ADDRESS, true);
    console.log("Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Approved GreenCreditToken:", receipt);
    return receipt;
  } catch (err) {
    console.error("approveGreenCredit error:", err);
    throw err;
  }
}

// ✅ Approve PYUSD (ERC20)
export async function approvePYUSD(amount) {

const pyusdAbi = [
  "function approve(address spender, uint256 amount) public returns (bool)"
];

  try {
    const contract = await getContract(PYUSD_ADDRESS, pyusdAbi);
    const tx = await contract.approve(ORDERBOOK_ADDRESS, amount);
    console.log("Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Approved PYUSD:", receipt);
    return receipt;
  } catch (err) {
    console.error("approvePYUSD error:", err);
    throw err;
  }
}

// ✅ Place order
export async function placeOrder(tokenId, isBuy, price, amount, expiration = 0, minAmountOut = 0, referrer = ethers.constants.AddressZero) {
  try {
    const contract = await getContract(ORDERBOOK_ADDRESS, orderbookAbi);
    console.log("⏳ Sending placeOrder transaction...");
    const tx = await contract.placeOrder(tokenId, isBuy, price, amount, expiration, minAmountOut, referrer);
    console.log("Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Order placed:", receipt);
    return receipt;
  } catch (err) {
    console.error("placeOrder error:", err);
    throw err;
  }
}

// ✅ Fill order
export async function fillOrder(orderId, fillAmount) {
  try {
    const contract = await getContract(ORDERBOOK_ADDRESS, orderbookAbi);
    console.log("⏳ Sending fillOrder transaction...");
    const tx = await contract.fillOrder(orderId, fillAmount);
    console.log("Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Order filled:", receipt);
    return receipt;
  } catch (err) {
    console.error("fillOrder error:", err);
    throw err;
  }
}

// ✅ Get order info by ID
export async function getOrder(orderId) {
  try {
    const contract = await getContract(ORDERBOOK_ADDRESS, orderbookAbi, false);
    const order = await contract.orders(orderId);
    console.log("Order info:", order);
    return order;
  } catch (err) {
    console.error("getOrder error:", err);
    throw err;
  }
}

// ✅ Check if order is active
export async function isOrderActive(orderId) {
  try {
    const contract = await getContract(ORDERBOOK_ADDRESS, orderbookAbi, false);
    const active = await contract.orderActive(orderId);
    console.log(`Order ${orderId} active?`, active);
    return active;
  } catch (err) {
    console.error("isOrderActive error:", err);
    throw err;
  }
}




