
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
  rabbyWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// Use multiple providers for better reliability
const projectId = 'YOUR_PROJECT_ID'; // Replace with your WalletConnect project ID

// Configure chains with multiple providers for better reliability
const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    // Use alchemyProvider as a fallback or remove if you don't have an API key
    // alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), 
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      rabbyWallet({ chains }),
      metaMaskWallet({ chains, projectId }),
      coinbaseWallet({ chains, appName: 'NFT Whitelist Portal' }),
      walletConnectWallet({ chains, projectId }),
      injectedWallet({ chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export { chains, RainbowKitProvider, WagmiConfig, lightTheme, darkTheme };
