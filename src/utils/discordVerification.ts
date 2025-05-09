
import { supabase } from "@/integrations/supabase/client";

// Discord server that users need to join
export const DISCORD_SERVER_TO_JOIN = "YourDiscordServer";

export interface VerifyDiscordResult {
  verified: boolean;
  message: string;
}

// Function to generate Discord OAuth URL
export function getDiscordAuthUrl() {
  // Replace this with your actual Discord Client ID from your Discord Developer Portal
  const CLIENT_ID = "REPLACE_WITH_YOUR_ACTUAL_DISCORD_CLIENT_ID"; 
  const REDIRECT_URI = encodeURIComponent(window.location.origin + "/discord-callback");
  const SCOPE = encodeURIComponent("identify guilds");
  
  return `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
}

// For demonstration, we'll simulate a successful verification
// In a real implementation, this would check if the user has authorized and joined the server
export async function checkDiscordVerification(code: string | null): Promise<VerifyDiscordResult> {
  // In production, this would exchange the code for a token and check the Discord API
  // For demo purposes, consider any code as successful
  if (code) {
    return {
      verified: true,
      message: `Successfully verified that you are a member of ${DISCORD_SERVER_TO_JOIN}`
    };
  }
  
  return {
    verified: false,
    message: `Could not verify that you are a member of ${DISCORD_SERVER_TO_JOIN}. Please authorize and try again.`
  };
}

export async function updateDiscordVerificationStatus(registrationId: string, verified: boolean) {
  return await supabase
    .from("whitelist_registrations")
    .update({ discord_verified: verified })
    .eq("id", registrationId);
}
