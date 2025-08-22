"use client"

import { usePayment } from "@/contexts/payment-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { adapter } from "next/dist/server/web/adapter"
import sdk from '@farcaster/frame-sdk';

export function TransactionHistory() {
  const { transactions } = usePayment()
  const walletProvider = sdk.wallet.getEthereumProvider();

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {tx.status === "confirmed" && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {tx.status === "failed" && <XCircle className="w-4 h-4 text-red-600" />}
                  {(tx.status === "pending" || tx.status === "confirming") && (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    ${tx.amount} to @{tx.recipient}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={tx.status === "confirmed" ? "default" : tx.status === "failed" ? "destructive" : "secondary"}
                  className={cn(
                    tx.status === "confirmed" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  )}
                >
                  {tx.status}
                </Badge>
                {tx.txHash && (
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
