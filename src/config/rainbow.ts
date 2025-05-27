
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Fremen Essence NFT Whitelist',
  projectId: '36c5ad16a175c2225f0a7e61ed8592bf', // Get this from https://cloud.walletconnect.com
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
