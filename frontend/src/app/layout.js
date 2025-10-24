// app/layout.js - CLEAN VERSION
import './globals.css';
import { Web3Provider } from '../contexts/Web3Context';
import LayoutWrapper from '../components/LayoutWrapper';
import Navigation from "../components/ui/Navigation"

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
            <Navigation/>
            {children}
          </LayoutWrapper>
       </Web3Provider>
      </body>
    </html>
  );
}