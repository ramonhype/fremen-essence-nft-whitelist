
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { checkDiscordVerification } from "@/utils/discordVerification";
import { Loader2 } from 'lucide-react';

const DiscordCallback = () => {
  const [message, setMessage] = useState("Verifying Discord membership...");
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyDiscord = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          const { verified, message } = await checkDiscordVerification(code);
          setMessage(verified 
            ? "Discord verification successful! Redirecting..."
            : "Discord verification failed. Please try again.");
          
          // Redirect back to registration page with the code
          setTimeout(() => {
            navigate(`/?code=${code}`);
          }, 2000);
        } else {
          setMessage("No verification code found. Please try again.");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Error during Discord verification:", error);
        setMessage("An error occurred during verification. Please try again.");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    
    verifyDiscord();
  }, [navigate]);
  
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-nft-primary" />
          <h1 className="text-3xl font-bold">{message}</h1>
          <p className="text-muted-foreground">You will be redirected automatically...</p>
        </div>
      </div>
    </Layout>
  );
};

export default DiscordCallback;
