// app/layout.js - CLEAN VERSION
import './globals.css';
import { Web3Provider } from '../components/contexts/Web3Context';
import LayoutWrapper from '../components/LayoutWrapper';

export const metadata = {
  title: 'GreenXchange - Carbon Credit Trading',
  description: 'Modern platform for carbon credit trading',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* NO bg class here */}
      <body className="antialiased">
        <Web3Provider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Web3Provider>
      </body>
    </html>
  );
}