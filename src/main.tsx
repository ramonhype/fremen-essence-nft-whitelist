
import { createRoot } from 'react-dom/client';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { 
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import App from './App.tsx';
import './index.css';

const config = getDefaultConfig({
  appName: 'GAIB Whitelist',
  projectId: 'gaib-whitelist', // Get a project ID from walletconnect.org
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  },
});

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <RainbowKitProvider theme={lightTheme({
      accentColor: '#19E3E3',
      borderRadius: 'medium'
    })}>
      <App />
    </RainbowKitProvider>
  </WagmiProvider>
);
