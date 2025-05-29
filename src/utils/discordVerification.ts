
import { supabase } from "@/integrations/supabase/client";

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
      scopes: 'identify',
    }
  });
}

// Check if user has a valid Discord session
export async function checkDiscordVerification(): Promise<VerifyDiscordResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  console.log('Discord session check:', {
    hasSession: !!session,
    hasProviderToken: !!session?.provider_token,
    provider: session?.user?.app_metadata?.provider
  });
  
  if (!session?.provider_token || session?.user?.app_metadata?.provider !== 'discord') {
    return {
      verified: false,
      message: `Please verify with Discord to continue.`
    };
  }
  
  return {
    verified: true,
    message: `Successfully verified with Discord`
  };
}

export async function updateDiscordVerificationStatus(registrationId: string, verified: boolean) {
  return await supabase
    .from("whitelist_registrations")
    .update({ discord_verified: verified })
    .eq("id", registrationId);
}
