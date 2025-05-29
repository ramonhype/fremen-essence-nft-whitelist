
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
                    className="bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white text-sm md:text-base px-3 md:px-4 py-2"
                  >
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm md:text-base px-3 md:px-4 py-2"
                  >
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Hide chain selector on mobile */}
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    className="border-[#19E3E3]/50 hover:bg-[#19E3E3]/10 hidden md:flex"
                  >
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white text-sm md:text-base px-3 md:px-4 py-2"
                  >
                    <span className="hidden sm:inline">
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </span>
                    <span className="sm:hidden">
                      {account.displayName}
                    </span>
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
