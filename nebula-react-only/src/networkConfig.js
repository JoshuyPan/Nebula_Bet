import React from 'react';
import { useSelector } from 'react-redux';
import '@mysten/dapp-kit/dist/index.css';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

const SuiNetwork = ({ children }) => {
  // Get the selected network from Redux state
  const network = useSelector((state) => state.betting.network);
  
  // Create network configuration based on the selected network
  const { networkConfig } = createNetworkConfig({
    devnet: { url: getFullnodeUrl('devnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
    testnet: { url: getFullnodeUrl('testnet') },
  });

  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
      <WalletProvider>
        {children} {/* Render children passed to SuiNetwork */}
      </WalletProvider>
    </SuiClientProvider>
  );
};

export default SuiNetwork;
