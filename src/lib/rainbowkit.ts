
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'NFT Whitelist Portal',
  projectId: 'YOUR_PROJECT_ID', // You'll need to replace this with your own WalletConnect project ID
  chains
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export { chains, RainbowKitProvider, WagmiConfig, lightTheme, darkTheme };
