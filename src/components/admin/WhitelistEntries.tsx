
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
import { useState } from "react";

// Placeholder data until Supabase integration
const MOCK_ENTRIES = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    wallet: '0x1234...5678', 
    twitter: 'alexjohnson', 
    twitterVerified: true, 
    registeredAt: '2025-05-08 14:30' 
  },
  { 
    id: '2', 
    name: 'Sam Williams', 
    wallet: '0xabcd...efgh', 
    twitter: 'samwilliams', 
    twitterVerified: true, 
    registeredAt: '2025-05-08 15:45' 
  },
  { 
    id: '3', 
    name: 'Jamie Smith', 
    wallet: '0x9876...5432', 
    twitter: 'jamiesmith', 
    twitterVerified: false, 
    registeredAt: '2025-05-08 16:20' 
  },
];

const WhitelistEntries = () => {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  
  return (
    <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Whitelist Registrations</CardTitle>
        <CardDescription>View all registered wallets for your whitelist</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-nft-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-nft-muted/50">
                <TableHead className="w-1/5">Name</TableHead>
                <TableHead className="w-1/4">Wallet Address</TableHead>
                <TableHead className="w-1/5">Twitter</TableHead>
                <TableHead className="w-1/6">Twitter Verified</TableHead>
                <TableHead className="w-1/5">Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-nft-muted/50">
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell className="font-mono text-xs">{entry.wallet}</TableCell>
                  <TableCell>@{entry.twitter}</TableCell>
                  <TableCell>
                    <span className={entry.twitterVerified ? "text-green-500" : "text-amber-500"}>
                      {entry.twitterVerified ? "Verified" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell>{entry.registeredAt}</TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No registrations yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhitelistEntries;
