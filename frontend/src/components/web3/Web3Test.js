'use client';
import { useWeb3 } from '../../contexts/Web3Context';

export default function Web3Test() {
  const { isConnected, account, network } = useWeb3();
  
  return (
    <div className="fixed bottom-4 left-4 z-50 glass-panel rounded-lg p-4 text-xs">
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <div>Account: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'None'}</div>
      <div>Network: {network ? network.name : 'None'}</div>
    </div>
  );
}