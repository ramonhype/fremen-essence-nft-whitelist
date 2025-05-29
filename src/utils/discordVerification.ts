
import { supabase } from "@/integrations/supabase/client";

export interface VerifyDiscordResult {
  verified: boolean;
  message: string;
  username?: string;
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
      scopes: 'identify',
    }
  });
}

// Check if user has a valid Discord session and get username
export async function checkDiscordVerification(): Promise<VerifyDiscordResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  console.log('Discord session check:', {
    hasSession: !!session,
    hasProviderToken: !!session?.provider_token,
    provider: session?.user?.app_metadata?.provider,
    userMetadata: session?.user?.user_metadata
  });
  
  if (!session?.provider_token || session?.user?.app_metadata?.provider !== 'discord') {
    return {
      verified: false,
      message: `Please verify with Discord to continue.`
    };
  }
  
  // Extract Discord username from user metadata
  const discordUsername = session?.user?.user_metadata?.preferred_username || 
                         session?.user?.user_metadata?.name || 
                         session?.user?.user_metadata?.full_name ||
                         'Unknown';
  
  return {
    verified: true,
    message: `Successfully verified with Discord`,
    username: discordUsername
  };
}

export async function updateDiscordVerificationStatus(registrationId: string, verified: boolean, username?: string) {
  const updateData: any = { discord_verified: verified };
  
  if (username) {
    updateData.discord_username = username;
  }
  
  return await supabase
    .from("whitelist_registrations")
    .update(updateData)
    .eq("id", registrationId);
}
