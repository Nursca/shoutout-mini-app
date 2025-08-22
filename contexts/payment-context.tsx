"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface PaymentTransaction {
  id: string
  amount: number
  recipient: string
  status: "pending" | "confirming" | "confirmed" | "failed"
  txHash?: string
  gasEstimate?: number
  timestamp: Date
}

interface PaymentContextType {
  transactions: PaymentTransaction[]
  isProcessing: boolean
  estimateGas: (amount: number, recipient: string) => Promise<number>
  processPayment: (amount: number, recipient: string) => Promise<PaymentTransaction>
  getTransaction: (id: string) => PaymentTransaction | undefined
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const estimateGas = async (amount: number, recipient: string): Promise<number> => {
    // Simulate gas estimation - in real app, this would call Base network
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Base gas estimate: ~$0.01-0.05 depending on network congestion
    const baseGas = 0.02
    const complexityMultiplier = amount > 10 ? 1.2 : 1.0
    return Number((baseGas * complexityMultiplier).toFixed(4))
  }

  const processPayment = async (amount: number, recipient: string): Promise<PaymentTransaction> => {
    setIsProcessing(true)

    const transaction: PaymentTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      recipient,
      status: "pending",
      timestamp: new Date(),
    }

    setTransactions((prev) => [...prev, transaction])

    try {
      // Simulate transaction submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // Update to confirming status
      const confirmingTx = { ...transaction, status: "confirming" as const, txHash }
      setTransactions((prev) => prev.map((tx) => (tx.id === transaction.id ? confirmingTx : tx)))

      // Simulate network confirmation time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Randomly simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1

      const finalStatus = isSuccess ? "confirmed" : "failed"
      const finalTx = { ...confirmingTx, status: finalStatus }

      setTransactions((prev) => prev.map((tx) => (tx.id === transaction.id ? finalTx : tx)))

      if (!isSuccess) {
        throw new Error("Transaction failed on network")
      }

      return finalTx
    } catch (error) {
      const failedTx = { ...transaction, status: "failed" as const }
      setTransactions((prev) => prev.map((tx) => (tx.id === transaction.id ? failedTx : tx)))
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const getTransaction = (id: string) => {
    return transactions.find((tx) => tx.id === id)
  }

  return (
    <PaymentContext.Provider
      value={{
        transactions,
        isProcessing,
        estimateGas,
        processPayment,
        getTransaction,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}
