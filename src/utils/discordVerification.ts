
import { supabase } from "@/integrations/supabase/client";

// Discord server that users need to join
export const DISCORD_SERVER_TO_JOIN = "YourDiscordServer";

export interface VerifyDiscordResult {
  verified: boolean;
  message: string;
}

// Function to initiate Discord OAuth via Supabase
export async function signInWithDiscord() {
  // Get the current URL origin (works in both development and production)
  const origin = window.location.origin;
  
  // Set the correct redirect URL using the actual origin
  const redirectTo = `${origin}/auth/callback`;
  
  console.log('Discord redirect URL:', redirectTo);
  
  return await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: redirectTo,
      scopes: 'identify guilds',
    }
  });
}

// Check if user has a valid Discord session in Supabase
export async function checkDiscordVerification(): Promise<VerifyDiscordResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.provider_token) {
    return {
      verified: true,
      message: `Successfully verified that you are a Discord user`
    };
  }
  
  return {
    verified: false,
    message: `Please verify with Discord to continue.`
  };
}

export async function updateDiscordVerificationStatus(registrationId: string, verified: boolean) {
  return await supabase
    .from("whitelist_registrations")
    .update({ discord_verified: verified })
    .eq("id", registrationId);
}
