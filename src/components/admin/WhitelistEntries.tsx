
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface WhitelistEntry {
  id: string;
  wallet_address: string;
  discord_username: string;
  discord_verified: boolean;
  created_at: string;
}

const WhitelistEntries = () => {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchWhitelistEntries() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("whitelist_registrations")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Convert the data to match our WhitelistEntry interface
        const formattedEntries = data?.map(entry => ({
          id: entry.id,
          wallet_address: entry.wallet_address,
          discord_username: entry.discord_username || "Verified via OAuth",
          discord_verified: !!entry.discord_verified,
          created_at: entry.created_at
        })) || [];
        
        setEntries(formattedEntries);
      } catch (err) {
        console.error("Error fetching whitelist entries:", err);
        setError("Failed to load whitelist entries");
      } finally {
        setLoading(false);
      }
    }
    
    fetchWhitelistEntries();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatAddress = (address: string) => {
    return address.length > 10 
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : address;
  };
  
  return (
    <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Whitelist Registrations</CardTitle>
        <CardDescription>View all registered wallets for your whitelist</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-nft-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="rounded-md border border-nft-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-nft-muted/50">
                  <TableHead className="w-1/4">Wallet Address</TableHead>
                  <TableHead className="w-1/4">Discord</TableHead>
                  <TableHead className="w-1/4">Discord Verified</TableHead>
                  <TableHead className="w-1/4">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-nft-muted/50">
                    <TableCell className="font-mono text-xs">{formatAddress(entry.wallet_address)}</TableCell>
                    <TableCell>{entry.discord_username}</TableCell>
                    <TableCell>
                      {entry.discord_verified ? (
                        <div className="flex items-center text-green-500">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-500">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span>Not Verified</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(entry.created_at)}</TableCell>
                  </TableRow>
                ))}
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No registrations yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhitelistEntries;
