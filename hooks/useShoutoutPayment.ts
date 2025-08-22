"use client"

import { useMemo, useState } from "react"
import { useSendTransaction, useAccount, useChainId } from "wagmi"
import { parseEther } from "viem"

export type PaymentStatus = "idle" | "pending" | "success" | "error"

export interface UseShoutoutPaymentResult {
  status: PaymentStatus
  txHash?: string
  error?: string
  isConnected: boolean
  chainId: number
  sendToken: (recipientAddress: `0x${string}`, amountEther: string) => Promise<string>
}

/**
 * Sends native ETH on Base chain using wagmi.
 * amountEther should be a string like "0.001".
 */
export function useShoutoutPayment(): UseShoutoutPaymentResult {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [status, setStatus] = useState<PaymentStatus>("idle")
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const { sendTransactionAsync } = useSendTransaction()

  const sendToken = async (recipientAddress: `0x${string}`, amountEther: string) => {
    setStatus("pending")
    setError(undefined)
    setTxHash(undefined)
    try {
      const hash = await sendTransactionAsync({
        to: recipientAddress,
        value: parseEther(amountEther),
      })
      setTxHash(hash)
      setStatus("success")
      return hash
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to send transaction"
      setError(message)
      setStatus("error")
      throw e
    }
  }

  return {
    status,
    txHash,
    error,
    isConnected,
    chainId,
    sendToken,
  }
}


