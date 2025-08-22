"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useConnect, useAccount, Connector } from "wagmi"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"

export interface User {
  id: string
  username: string
  walletAddress: string
  ensName?: string
  avatar?: string
  bio?: string
  joinedAt: Date
  stats: {
    shoutoutsSent: number
    shoutsReceived: number
    totalTipped: number
    totalReceived: number
    followers: number
    following: number
  }
}

interface AuthContextType {
  user: User | null
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demo
const mockUser: User = {
  id: "1",
  username: "cryptodev",
  walletAddress: "0x1234...5678",
  ensName: "cryptodev.eth",
  avatar: "/diverse-profile-avatars.png",
  bio: "Building the future of social tipping 🚀",
  joinedAt: new Date("2024-01-15"),
  stats: {
    shoutoutsSent: 47,
    shoutsReceived: 23,
    totalTipped: 125.5,
    totalReceived: 89.25,
    followers: 156,
    following: 89,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Wagmi hooks
  const { connect, connectors, isPending } = useConnect()
  const { address, isConnected } = useAccount()

  // Check for existing connection on mount
  useEffect(() => {
    if (isConnected && address) {
      // You may want to fetch user profile from Farcaster API here
      setUser({
        ...mockUser,
        walletAddress: address,
      })
      localStorage.setItem("shoutout-user", JSON.stringify({
        ...mockUser,
        walletAddress: address,
      }))
    } else {
      const savedUser = localStorage.getItem("shoutout-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [isConnected, address])

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Use Farcaster Miniapp connector if available
      const connector = connectors.find((c: Connector) => c.id === farcasterMiniApp().id) || connectors[0]
      await connect({ connector })
      // user state will be set by useEffect above
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setUser(null)
    localStorage.removeItem("shoutout-user")
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("shoutout-user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isConnecting,
        connectWallet,
        disconnectWallet,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
