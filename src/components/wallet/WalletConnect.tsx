
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { Button } from '@/components/ui/button';

const WalletConnect: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    className="border-[#19E3E3]/50 hover:bg-[#19E3E3]/10"
                  >
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white"
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;
