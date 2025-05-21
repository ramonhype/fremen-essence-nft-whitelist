
import { createRoot } from 'react-dom/client';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import App from './App.tsx';
import './index.css';

const { chains, publicClient } = createConfig({
  autoConnect: true,
  publicClient: publicProvider(),
});

const { connectors } = getDefaultWallets({
  appName: 'GAIB Whitelist',
  projectId: 'gaib-whitelist',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

createRoot(document.getElementById("root")!).render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
);
