"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, ExternalLink, AlertTriangle } from "lucide-react"
import { useShoutoutPayment } from "@/hooks/useShoutoutPayment"
import { resolveVerifiedEthAddressByUsername } from "@/lib/farcasterApi"
import { adapter } from "next/dist/server/web/adapter"
import sdk from '@farcaster/frame-sdk';

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  recipient: string
  onSuccess: (txHash: string) => void
  onError: (error: string) => void
}

export function PaymentModal({ isOpen, onClose, amount, recipient, onSuccess, onError }: PaymentModalProps) {
  const { user } = useAuth()
  const { status, sendToken } = useShoutoutPayment()
  const [gasEstimate, setGasEstimate] = useState<number | null>(null)
  const [currentTxId, setCurrentTxId] = useState<string | null>(null)
  const [txStatus, setTxStatus] = useState<"idle" | "estimating" | "confirming" | "confirmed" | "failed">("idle")
  const [error, setError] = useState<string | null>(null)
  const walletProvider = sdk.wallet.getEthereumProvider();

  // Estimate network fees when modal opens (simple static for demo)
  useEffect(() => {
    if (isOpen && amount > 0) {
      setTxStatus("estimating")
      setError(null)
      setTimeout(() => {
        setGasEstimate(0.02)
        setTxStatus("idle")
      }, 300)
    }
  }, [isOpen, amount, recipient])

  const handlePayment = async () => {
    if (!user) {
      setError("Please connect your wallet first")
      return
    }

    try {
      setTxStatus("confirming")
      setError(null)
      const recipientAddress = await resolveVerifiedEthAddressByUsername(recipient)
      if (!recipientAddress) {
        throw new Error("Could not resolve recipient address")
      }

      // Approximate conversion USD -> ETH for demo only. Replace with oracle in production.
      const approximateEth = (amount / 3000).toFixed(6)
      const hash = await sendToken(recipientAddress, approximateEth)
      setCurrentTxId(hash)
      setTxStatus("confirmed")
      onSuccess(hash)
    } catch (err) {
      setTxStatus("failed")
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      setError(errorMessage)
      onError(errorMessage)
    }
  }

  const handleClose = () => {
    if (txStatus !== "confirming") {
      onClose()
      // Reset state
      setTimeout(() => {
        setTxStatus("idle")
        setError(null)
        setGasEstimate(null)
        setCurrentTxId(null)
      }, 300)
    }
  }

  const totalCost = gasEstimate ? amount + gasEstimate : amount

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Confirm Payment</DialogTitle>
          <DialogDescription>Review your transaction details before sending</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sending to:</span>
              <span className="font-medium">@{recipient}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">${amount}</span>
            </div>
            {gasEstimate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network fee:</span>
                <span className="text-sm">${gasEstimate}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-lg text-primary">
                ${txStatus === "estimating" ? "..." : totalCost.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Status Display */}
          {txStatus === "estimating" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Estimating network fees...</span>
            </div>
          )}

          {txStatus === "confirming" && (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Confirming transaction...</span>
            </div>
          )}

          {txStatus === "confirmed" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Transaction confirmed!</span>
            </div>
          )}

          {txStatus === "failed" && error && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Network Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Base Network</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Fast (~2s)
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={txStatus === "confirming"}
              className="flex-1 bg-transparent"
            >
              {txStatus === "confirmed" ? "Close" : "Cancel"}
            </Button>

            {txStatus !== "confirmed" && (
              <Button
                onClick={handlePayment}
                disabled={txStatus === "estimating" || txStatus === "confirming" || !gasEstimate}
                className="flex-1 gap-2"
              >
                {txStatus === "confirming" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  `Pay $${totalCost.toFixed(2)}`
                )}
              </Button>
            )}
          </div>

          {/* Transaction Hash */}
          {currentTxId && txStatus === "confirmed" && (
            <div className="pt-2 border-t">
              <Button variant="ghost" size="sm" className="w-full gap-2 text-xs">
                <ExternalLink className="w-3 h-3" />
                View on Base Explorer
              </Button>
            </div>
          )}

          {/* Warning for large amounts */}
          {amount > 50 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Large Amount Warning</p>
                <p>You're sending a large tip. Please double-check the recipient address.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
