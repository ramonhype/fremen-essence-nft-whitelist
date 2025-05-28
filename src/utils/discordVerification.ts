
import { supabase } from "@/integrations/supabase/client";

// Discord server that users need to join
export const DISCORD_SERVER_TO_JOIN = "GAIB's Discord";
export const DISCORD_SERVER_ID = "1273697728014188664"; // Updated with the correct GAIB Discord server ID

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

// Check if user has a valid Discord session and is a member of the required server
export async function checkDiscordVerification(): Promise<VerifyDiscordResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  console.log('Discord session check:', {
    hasSession: !!session,
    hasProviderToken: !!session?.provider_token,
    provider: session?.user?.app_metadata?.provider
  });
  
  if (!session?.provider_token) {
    return {
      verified: false,
      message: `Please verify with Discord to continue.`
    };
  }
  
  try {
    // Check if user is a member of the GAIB Discord server
    const isServerMember = await checkDiscordServerMembership(session.provider_token);
    
    if (!isServerMember) {
      return {
        verified: false,
        message: `Please join the GAIB Discord server to continue.`
      };
    }
    
    return {
      verified: true,
      message: `Successfully verified that you are a Discord user and GAIB server member`
    };
  } catch (error) {
    console.error("Error checking Discord server membership:", error);
    return {
      verified: false,
      message: `Error verifying Discord server membership. Please try again.`
    };
  }
}

// Function to check if the user is a member of the GAIB Discord server
async function checkDiscordServerMembership(token: string): Promise<boolean> {
  try {
    console.log('Checking Discord server membership with token:', token ? 'Token present' : 'No token');
    
    // First, get the user guilds (servers)
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Discord API response status:', guildsResponse.status);
    console.log('Discord API response headers:', Object.fromEntries(guildsResponse.headers.entries()));
    
    if (!guildsResponse.ok) {
      const errorText = await guildsResponse.text();
      console.error("Failed to fetch Discord guilds:", {
        status: guildsResponse.status,
        statusText: guildsResponse.statusText,
        error: errorText
      });
      
      // If token is invalid/expired, we need to re-authenticate
      if (guildsResponse.status === 401) {
        console.log('Discord token appears to be invalid or expired');
        // Sign out the user so they can re-authenticate
        await supabase.auth.signOut();
      }
      
      throw new Error(`Discord API error: ${guildsResponse.status} - ${errorText}`);
    }
    
    const guilds = await guildsResponse.json();
    console.log("User Discord guilds:", guilds);
    console.log("Looking for server ID:", DISCORD_SERVER_ID);
    
    // Check if any of the guilds matches the GAIB server ID
    const isInServer = guilds.some((guild: any) => {
      console.log(`Comparing guild ${guild.id} (${guild.name}) with target ${DISCORD_SERVER_ID}`);
      return guild.id === DISCORD_SERVER_ID;
    });
    
    console.log('User is in GAIB server:', isInServer);
    return isInServer;
  } catch (error) {
    console.error("Error checking Discord server membership:", error);
    throw error;
  }
}

export async function updateDiscordVerificationStatus(registrationId: string, verified: boolean) {
  return await supabase
    .from("whitelist_registrations")
    .update({ discord_verified: verified })
    .eq("id", registrationId);
}
