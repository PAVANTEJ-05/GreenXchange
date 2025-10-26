"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { CheckCircle, Info, AlertCircle, X } from "lucide-react";

import {
  approveGreenCredit,
  approvePYUSD,
  placeOrder,
  fillOrder,
  getOrder,
  isOrderActive,
} from "../../contexts/Orderbook";

import orderbookAbi from "../../../../ABI/GreenXchangeOrderbookAbi";
const ORDERBOOK_ADDRESS = "0x5606f038a656684746f0F8a6e5eEf058de2fe05c";

async function getReadOnlyContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(ORDERBOOK_ADDRESS, orderbookAbi, provider);
}

// Notification Component
const Notification = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />
  };

  const bgColors = {
    success: "bg-green-900/50 border-green-700",
    info: "bg-blue-900/50 border-blue-700",
    error: "bg-red-900/50 border-red-700"
  };

  return (
    <div className={`${bgColors[type]} border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-slideIn`}>
      {icons[type]}
      <p className="flex-1 text-sm text-gray-100">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Transaction Log Component
const TransactionLog = ({ logs }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-xl max-h-64 overflow-y-auto">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">Transaction Log</h4>
      {logs.length === 0 ? (
        <p className="text-gray-500 text-xs">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log, idx) => (
            <div key={idx} className="text-xs font-mono">
              <span className="text-gray-400">[{log.timestamp}]</span>{" "}
              <span className={`${
                log.type === 'success' ? 'text-green-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MarketplaceClient() {
  const [tokenId, setTokenId] = useState(null);
  const [priceInput, setPriceInput] = useState(null);
  const [amountInput, setAmountInput] = useState(null);
  const [pyusdDecimals] = useState(6);
  const [activeBuyOrders, setActiveBuyOrders] = useState([]);
  const [activeSellOrders, setActiveSellOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [txLogs, setTxLogs] = useState([]);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTxLogs(prev => [...prev, { timestamp, message, type }].slice(-50)); // Keep last 50 logs
  };

  const parseAmount = useCallback((val) => ethers.BigNumber.from(val), []);
  const parsePrice = useCallback((val) => ethers.utils.parseUnits(val, pyusdDecimals), [pyusdDecimals]);

  const loadActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      const contract = await getReadOnlyContract();
      const nextIdBN = await contract.nextOrderId();
      const nextId = nextIdBN.toNumber();

      const buys = [];
      const sells = [];
      const start = Math.max(1, nextId - 500);

      const orderPromises = [];
      for (let id = start; id < nextId; ++id) {
        orderPromises.push(
          (async () => {
            try {
              const active = await contract.orderActive(id);
              if (!active) return null;

              const order = await contract.orders(id);
              // if (order.tokenId.toNumber() !== tokenId) return null; //LEAVE THIS LINE DO NOT CHANGE THIS LINE

              return { id, order, isBuy: order.isBuy };
            } catch (err) {
              console.error(`Error fetching order ${id}:`, err);
              return null;
            }
          })()
        );
      }

      const results = await Promise.all(orderPromises);
      results.forEach((result) => {
        if (result) {
          if (result.isBuy) buys.push({ id: result.id, order: result.order });
          else sells.push({ id: result.id, order: result.order });
        }
      });

      setActiveBuyOrders(buys);
      setActiveSellOrders(sells);
    } catch (err) {
      console.error("Error loading active orders:", err);
      addNotification('error', "Error loading active orders: " + (err?.message || err));
      addLog("Error loading active orders: " + (err?.message || err), 'error');
    } finally {
      setLoading(false);
    }
  }, [tokenId]);

  const loadCompletedOrders = useCallback(async () => {
    try {
      setLoading(true);
      const contract = await getReadOnlyContract();
      const nextIdBN = await contract.nextOrderId();
      const nextId = nextIdBN.toNumber();

      const completed = [];
      const start = Math.max(1, nextId - 500);

      const orderPromises = [];
      for (let id = start; id < nextId; ++id) {
        orderPromises.push(
          (async () => {
            try {
              const active = await isOrderActive(id);
              if (!active) {
                const order = await getOrder(id);
                return { id, order };
              }
              return null;
            } catch (err) {
              console.error(`Error fetching completed order ${id}:`, err);
              return null;
            }
          })()
        );
      }

      const results = await Promise.all(orderPromises);
      results.forEach((result) => {
        if (result) completed.push(result);
      });

      completed.sort((a, b) => b.id - a.id);
      setCompletedOrders(completed);
    } catch (err) {
      console.error("Error loading completed orders:", err);
      addNotification('error', "Error loading completed orders: " + (err?.message || err));
      addLog("Error loading completed orders: " + (err?.message || err), 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlaceSellOrder = async () => {
    try {
      setLoading(true);
      
      addLog("Step 1: Approving ERC1155 (setApprovalForAll)...");
      addNotification('info', "Requesting ERC1155 approval...");
      await approveGreenCredit();
      addLog("ERC1155 approval granted", 'success');

      const price = parsePrice(priceInput);
      const amount = parseAmount(amountInput);

      addLog("Step 2: Placing sell order...");
      addNotification('info', "Placing sell order...");
      const receipt = await placeOrder(tokenId, false, price, amount, 0, 0, ethers.constants.AddressZero);
      
      addLog(`Sell order placed successfully. Tx: ${receipt.transactionHash}`, 'success');
      addNotification('success', "Sell order placed successfully!");
      
      await loadActiveOrders();
    } catch (err) {
      console.error("Error placing sell order:", err);
      addNotification('error', "Error placing sell order: " + (err?.message || err));
      addLog("Error placing sell order: " + (err?.message || err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBuyOrder = async () => {
    try {
      setLoading(true);
      const price = parsePrice(priceInput);
      const amount = parseAmount(amountInput);
      const total = price.mul(amount);

      addLog(`Step 1: Approving PYUSD for total: ${total.toString()}`);
      addNotification('info', "Requesting PYUSD approval...");
      await approvePYUSD(total);
      addLog("PYUSD approval granted", 'success');

      addLog("Step 2: Placing buy order...");
      addNotification('info', "Placing buy order...");
      const receipt = await placeOrder(tokenId, true, price, amount, 0, 0, ethers.constants.AddressZero);
      
      addLog(`Buy order placed successfully. Tx: ${receipt.transactionHash}`, 'success');
      addNotification('success', "Buy order placed successfully!");
      
      await loadActiveOrders();
    } catch (err) {
      console.error("Error placing buy order:", err);
      addNotification('error', "Error placing buy order: " + (err?.message || err));
      addLog("Error placing buy order: " + (err?.message || err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillOrder = async (orderId, fillAmountRaw) => {
    try {
      setLoading(true);
      const order = await getOrder(orderId);
      const isBuy = order.isBuy;
      const price = ethers.BigNumber.from(order.price.toString());
      const fillAmount = ethers.BigNumber.from(fillAmountRaw.toString());

      if (!isBuy) {
        const tradeValue = price.mul(fillAmount);
        addLog(`Order is SELL. Approving PYUSD for: ${tradeValue.toString()}`);
        addNotification('info', "Approving PYUSD for purchase...");
        await approvePYUSD(tradeValue);
        addLog("PYUSD approved for purchase", 'success');
      } else {
        addLog("Order is BUY. Approving ERC1155 (setApprovalForAll) for seller...");
        addNotification('info', "Approving credits for sale...");
        await approveGreenCredit();
        addLog("Credits approved for sale", 'success');
      }

      addLog(`Calling fillOrder on orderId: ${orderId}, fillAmount: ${fillAmount.toString()}`);
      addNotification('info', "Filling order...");
      const receipt = await fillOrder(orderId, fillAmount);
      
      addLog(`Order filled successfully. Tx: ${receipt.transactionHash}`, 'success');
      addNotification('success', "Order filled successfully!");
      
      await Promise.all([loadActiveOrders(), loadCompletedOrders()]);
    } catch (err) {
      console.error("Error filling order:", err);
      addNotification('error', "Error filling order: " + (err?.message || err));
      addLog("Error filling order: " + (err?.message || err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenIdChange = (newTokenId) => {
    setTokenId(newTokenId);
  };

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          addLog("Wallet connected successfully", 'success');
        } catch (e) {
          addLog("Wallet connection skipped: " + (e?.message || e), 'info');
        }
      }
    })();
  }, []);

  useEffect(() => {
    loadActiveOrders();
    loadCompletedOrders();
  }, [tokenId, loadActiveOrders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
      {/* Notifications Container */}
<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-11/12 max-w-md">


        {notifications.map(notif => (
          <Notification
            key={notif.id}
            type={notif.type}
            message={notif.message}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-20">
          <h2 className="text-3xl font-bold text-green-400 mb-2">GreenXchange Marketplace</h2>
          <p className="text-gray-400">Trade GreenXchange Available Credits on the blockchain</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6 shadow-xl">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Place Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token ID
              </label>
              <input
                type="number"
                value={tokenId || ''}
                onChange={(e) => handleTokenIdChange(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (PYUSD)
              </label>
              <input
                type="text"
                value={priceInput || ''}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (credits)
              </label>
              <input
                type="number"
                value={amountInput || ''}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePlaceSellOrder}
              disabled={loading}
              className="flex-1 min-w-[200px] bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Processing..." : "Approve Credit & Place Sell Order"}
            </button>
            <button
              onClick={handlePlaceBuyOrder}
              disabled={loading}
              className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Processing..." : "Approve PYUSD & Place Buy Order"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-400">Sell Orders</h3>
              <button
                onClick={loadActiveOrders}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading && activeSellOrders.length === 0 ? (
                <div className="text-gray-500 text-center py-8">Loading orders...</div>
              ) : activeSellOrders.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No active sell orders for token {tokenId}
                </div>
              ) : (
                activeSellOrders.map((s) => {
                  const o = s.order;
                  return (
                    <div
                      key={s.id}
                      className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-red-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-mono text-red-400">Order #{s.id}</span>
                        <span className="text-xs text-gray-400">Seller</span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-mono text-blue-400">
                          Token ID: #{o.tokenId ? o.tokenId.toString() : "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2 truncate">
                        {o.maker}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="text-gray-400">Price:</span>
                          <span className="ml-2 text-white font-semibold">
                            {ethers.utils.formatUnits(o.price, pyusdDecimals)} PYUSD
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Available:</span>
                          <span className="ml-2 text-white font-semibold">
                            {o.amount.sub(o.filled).toString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFillOrder(s.id, 1)}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Buy 1 Credit
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-400">Buy Orders</h3>
              <button
                onClick={loadActiveOrders}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading && activeBuyOrders.length === 0 ? (
                <div className="text-gray-500 text-center py-8">Loading orders...</div>
              ) : activeBuyOrders.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No active buy orders for token {tokenId}
                </div>
              ) : (
                activeBuyOrders.map((b) => {
                  const o = b.order;
                  return (
                    <div
                      key={b.id}
                      className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-green-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-mono text-green-400">Order #{b.id}</span>
                        <span className="text-xs text-gray-400">Buyer</span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-mono text-blue-400">
                          Token ID: #{o.tokenId ? o.tokenId.toString() : "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2 truncate">
                        {o.maker}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="text-gray-400">Price:</span>
                          <span className="ml-2 text-white font-semibold">
                            {ethers.utils.formatUnits(o.price, pyusdDecimals)} PYUSD
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Available:</span>
                          <span className="ml-2 text-white font-semibold">
                            {o.amount.sub(o.filled).toString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFillOrder(b.id, 1)}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Sell 1 Credit
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-400">Order History</h3>
            <button
              onClick={loadCompletedOrders}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Load History
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {completedOrders.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No completed orders loaded
              </div>
            )}
            {completedOrders.map((c) => (
              <div
                key={c.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-blue-400">#{c.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${c.order.isBuy ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {c.order.isBuy ? 'BUY' : 'SELL'}
                    </span>
                    <div className="text-sm text-blue-400">
                      Token ID: #{c.order.tokenId ? c.order.tokenId.toString() : "N/A"}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Price:</span>
                    <span className="ml-2 text-white font-semibold">
                      {ethers.utils.formatUnits(c.order.price, pyusdDecimals)} PYUSD
                    </span>
                    <span className="ml-4 text-gray-400">Filled:</span>
                    <span className="ml-2 text-white">
                      {c.order.filled.toString()}/{c.order.amount.toString()}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 truncate">
                  {c.order.maker}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Log */}
        <div className="mb-6 mt-3">
          <TransactionLog logs={txLogs} />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}