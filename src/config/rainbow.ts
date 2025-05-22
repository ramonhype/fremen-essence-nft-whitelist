
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { chains } from './chains';

export const config = getDefaultConfig({
  appName: 'Fremen Essence NFT Whitelist',
  projectId: '36c5ad16a175c2225f0a7e61ed8592bf', // Get this from https://cloud.walletconnect.com
  chains,
  transports: {
    [chains[0].id]: http(),
    [chains[1].id]: http(),
  },
});
