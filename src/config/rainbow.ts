
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Define the chains array correctly
export const chains = [mainnet, sepolia];

export const config = getDefaultConfig({
  appName: 'Fremen Essence NFT Whitelist',
  projectId: '36c5ad16a175c2225f0a7e61ed8592bf', // Get this from https://cloud.walletconnect.com
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
