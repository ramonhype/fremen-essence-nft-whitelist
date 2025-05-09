
import { supabase } from "@/integrations/supabase/client";

// Twitter handle that users need to follow
export const TWITTER_ACCOUNT_TO_FOLLOW = "YourTwitterHandle";

export interface VerifyTwitterResult {
  verified: boolean;
  message: string;
}

export async function verifyTwitterFollower(username: string): Promise<VerifyTwitterResult> {
  try {
    // This is a mock implementation for now
    // In a real app, we would call a Supabase Edge Function that uses Twitter API
    // to verify if the user actually follows the specified account
    
    // For demonstration purposes, we'll simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification - in real implementation we'd check against Twitter's API
    const verified = username.length > 3;
    
    if (verified) {
      return {
        verified: true,
        message: `Successfully verified that @${username} follows @${TWITTER_ACCOUNT_TO_FOLLOW}`
      };
    } else {
      return {
        verified: false,
        message: `Could not verify that @${username} follows @${TWITTER_ACCOUNT_TO_FOLLOW}. Please make sure you're following and try again.`
      };
    }
  } catch (error) {
    console.error("Twitter verification error:", error);
    return {
      verified: false,
      message: "Error during Twitter verification. Please try again later."
    };
  }
}

export async function updateTwitterVerificationStatus(registrationId: string, verified: boolean) {
  return await supabase
    .from("whitelist_registrations")
    .update({ twitter_verified: verified })
    .eq("id", registrationId);
}
