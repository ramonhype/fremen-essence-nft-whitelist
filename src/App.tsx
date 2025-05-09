
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { chains, RainbowKitProvider, WagmiConfig, darkTheme, wagmiConfig } from "@/lib/rainbowkit";

import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./components/auth/Auth";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import DiscordCallback from "./pages/DiscordCallback";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        theme={darkTheme({
          accentColor: '#6366f1',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
        })}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/admin" element={
                <AuthGuard>
                  <Admin />
                </AuthGuard>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/discord-callback" element={<DiscordCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </QueryClientProvider>
);

export default App;
