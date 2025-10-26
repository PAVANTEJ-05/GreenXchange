"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { CheckCircle, Info, AlertCircle, X, RefreshCw, TrendingUp, Activity, DollarSign, Shield } from "lucide-react";

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

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>
);

// Notification Component
const Notification = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />
  };

  const bgColors = {
    success: "bg-emerald-500/10 border-emerald-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
    error: "bg-red-500/10 border-red-500/30"
  };

  return (
    <div className={`${bgColors[type]} border rounded-xl p-4 flex items-start gap-3 shadow-lg backdrop-blur-sm animate-slideIn`}>
      {icons[type]}
      <p className="flex-1 text-sm text-gray-100">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Transaction Log Component - Compact
const TransactionLog = ({ logs }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 p-4 h-40">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-100 flex items-center">
          <Activity className="w-4 h-4 text-cyan-400 mr-2" />
          Transaction Log
        </h4>
        <div className="text-xs text-gray-400">{logs.length} entries</div>
      </div>
      <div className="h-28 overflow-y-auto space-y-1">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-4 text-xs">
            No transactions yet
          </div>
        ) : (
          logs.slice(-8).map((log, idx) => (
            <div key={idx} className="text-xs font-mono bg-black/30 rounded-lg p-2 border border-gray-800">
              <span className="text-gray-400">[{log.timestamp}]</span>{" "}
              <span className={`${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-cyan-400'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Order Card Component - Compact
const OrderCard = ({ order, type, onFill, loading }) => {
  const isBuy = type === 'buy';
  const bgColor = isBuy ? 'from-emerald-500/10 to-emerald-500/5' : 'from-red-500/10 to-red-500/5';
  const borderColor = isBuy ? 'border-emerald-500/30' : 'border-red-500/30';
  const buttonColor = isBuy ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className={`bg-gradient-to-br ${bgColor} border ${borderColor} rounded-xl p-3 transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-white">#{order.id}</span>
          <span className={`text-xs px-2 py-1 rounded-lg ${isBuy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
            {isBuy ? 'BUY' : 'SELL'}
          </span>
        </div>
        <span className="text-xs text-gray-400">Token #{order.order.tokenId?.toString() || 'N/A'}</span>
      </div>
      
      <div className="text-xs text-gray-400 mb-2 truncate bg-black/20 rounded p-1 px-2">
        {order.order.maker.slice(0, 8)}...{order.order.maker.slice(-6)}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-black/20 rounded p-2">
          <div className="text-gray-400 text-xs">Price</div>
          <div className="text-white font-semibold">
            {ethers.utils.formatUnits(order.order.price, 6)}
          </div>
        </div>
        <div className="bg-black/20 rounded p-2">
          <div className="text-gray-400 text-xs">Available</div>
          <div className="text-white font-semibold">
            {order.order.amount.sub(order.order.filled).toString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          placeholder="Qty"
          defaultValue="1"
          id={`fillAmount-${type}-${order.id}`}
          className="w-16 bg-black/30 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          onClick={() => {
            const inputEl = document.getElementById(`fillAmount-${type}-${order.id}`);
            const qty = inputEl && inputEl.value ? Number(inputEl.value) : 1;
            onFill(order.id, qty);
          }}
          disabled={loading}
          className={`flex-1 ${buttonColor} disabled:bg-gray-600 text-white font-semibold py-2 px-2 rounded-lg text-xs transition-all duration-200 disabled:cursor-not-allowed`}
        >
          {isBuy ? 'Sell' : 'Buy'}
        </button>
      </div>
    </div>
  );
};

// PYUSD Notice Banner
const PYUSDNotice = () => (
  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-3 mb-4">
    <div className="flex items-center justify-center space-x-3 text-sm">
      <DollarSign className="w-4 h-4 text-blue-400" />
      <Shield className="w-4 h-4 text-cyan-400" />
      <span className="text-white font-semibold">All transactions on this marketplace are conducted in</span>
      <span className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold text-sm">PYUSD</span>
      <span className="text-white font-semibold">stablecoin</span>
      <Shield className="w-4 h-4 text-cyan-400" />
      <DollarSign className="w-4 h-4 text-blue-400" />
    </div>
  </div>
);

export default function MarketplaceClient() {
  const [tokenId, setTokenId] = useState(1);
  const [priceInput, setPriceInput] = useState("1");
  const [amountInput, setAmountInput] = useState("1");
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
    setTxLogs(prev => [...prev, { timestamp, message, type }].slice(-50));
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
    <div className="min-h-screen bg-black text-gray-100 py-4 pt-16 relative overflow-hidden">
      <AnimatedBackground />
      
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

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">GreenXchange Marketplace</h1>
          </div>
          <p className="text-gray-400 text-sm">Trade Green Credits on the blockchain</p>
        </div>

        {/* PYUSD Notice Banner */}
        <PYUSDNotice />

        {/* Main Content Grid - Optimized for single view */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left Column - Order Placement and History */}
          <div className="xl:col-span-8 space-y-4">
            {/* Place Order Card - Compact */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 p-4">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Place New Order
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token ID
                  </label>
                  <input
                    type="number"
                    value={tokenId}
                    onChange={(e) => handleTokenIdChange(Number(e.target.value))}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (PYUSD)
                  </label>
                  <input
                    type="text"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div className="flex space-x-2 items-end">
                  <button
                    onClick={handlePlaceSellOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? '...' : 'Sell'}
                  </button>
                  <button
                    onClick={handlePlaceBuyOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? '...' : 'Buy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Grid - Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sell Orders */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-bold text-red-400 flex items-center">
                    Sell Orders
                    <span className="ml-2 text-xs bg-red-500/20 text-red-300 rounded-full px-2 py-1">
                      {activeSellOrders.length}
                    </span>
                  </h3>
                  <button
                    onClick={loadActiveOrders}
                    disabled={loading}
                    className="bg-black/30 hover:bg-black/50 disabled:bg-gray-600 text-white p-2 rounded-lg text-xs transition-all duration-200 disabled:cursor-not-allowed border border-gray-600"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {loading && activeSellOrders.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 text-xs">
                      Loading...
                    </div>
                  ) : activeSellOrders.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 text-xs bg-black/20 rounded border border-gray-800">
                      No sell orders
                    </div>
                  ) : (
                    activeSellOrders.slice(0, 4).map((s) => (
                      <OrderCard
                        key={s.id}
                        order={s}
                        type="sell"
                        onFill={handleFillOrder}
                        loading={loading}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Buy Orders */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-bold text-emerald-400 flex items-center">
                    Buy Orders
                    <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 rounded-full px-2 py-1">
                      {activeBuyOrders.length}
                    </span>
                  </h3>
                  <button
                    onClick={loadActiveOrders}
                    disabled={loading}
                    className="bg-black/30 hover:bg-black/50 disabled:bg-gray-600 text-white p-2 rounded-lg text-xs transition-all duration-200 disabled:cursor-not-allowed border border-gray-600"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {loading && activeBuyOrders.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 text-xs">
                      Loading...
                    </div>
                  ) : activeBuyOrders.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 text-xs bg-black/20 rounded border border-gray-800">
                      No buy orders
                    </div>
                  ) : (
                    activeBuyOrders.slice(0, 4).map((b) => (
                      <OrderCard
                        key={b.id}
                        order={b}
                        type="buy"
                        onFill={handleFillOrder}
                        loading={loading}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Log - Compact */}
            <div className="xl:col-span-4">
              <TransactionLog logs={txLogs} />
            </div>
          </div>

          {/* Right Column - Order History */}
          <div className="xl:col-span-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-cyan-400 flex items-center">
                  Order History
                  <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-300 rounded-full px-2 py-1">
                    {completedOrders.length}
                  </span>
                </h3>
                <button
                  onClick={loadCompletedOrders}
                  disabled={loading}
                  className="bg-black/30 hover:bg-black/50 disabled:bg-gray-600 text-white p-2 rounded-lg text-xs transition-all duration-200 disabled:cursor-not-allowed border border-gray-600"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {completedOrders.length === 0 ? (
                  <div className="text-gray-500 text-center py-8 text-xs bg-black/20 rounded border border-gray-800">
                    No completed orders
                  </div>
                ) : (
                  completedOrders.slice(0, 6).map((c) => (
                    <div
                      key={c.id}
                      className="bg-black/20 border border-gray-700 rounded-lg p-3 text-xs"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-cyan-400">#{c.id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          c.order.isBuy 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {c.order.isBuy ? 'BUY' : 'SELL'}
                        </span>
                      </div>
                      <div className="text-gray-400 mb-1">
                        Token #{c.order.tokenId?.toString() || 'N/A'}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{ethers.utils.formatUnits(c.order.price, 6)} PYUSD</span>
                        <span>{c.order.filled.toString()}/{c.order.amount.toString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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