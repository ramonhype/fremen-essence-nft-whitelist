
import { supabase } from "@/integrations/supabase/client";

// Discord server that users need to join
export const DISCORD_SERVER_TO_JOIN = "GAIB's Discord";
export const DISCORD_SERVER_ID = "988467524149325824"; // This is the GAIB Discord server ID

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
    // First, get the user guilds (servers)
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!guildsResponse.ok) {
      console.error("Failed to fetch Discord guilds:", await guildsResponse.text());
      throw new Error("Failed to fetch Discord guilds");
    }
    
    const guilds = await guildsResponse.json();
    console.log("User Discord guilds:", guilds);
    
    // Check if any of the guilds matches the GAIB server ID
    return guilds.some((guild: any) => guild.id === DISCORD_SERVER_ID);
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
