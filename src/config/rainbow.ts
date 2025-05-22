
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { chains } from './chains';

export const config = getDefaultConfig({
  appName: 'GAIB Whitelist',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Get this from https://cloud.walletconnect.com
  chains,
  transports: {
    [chains[0].id]: http(),
    [chains[1].id]: http(),
  },
});
