"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user, isConnecting, connectWallet } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Shoutout</h1>
          </div>
          <p className="text-muted-foreground">Connect your wallet to start sending shoutouts</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-serif">Connect Wallet</CardTitle>
            <CardDescription>Connect your crypto wallet to create an account and start tipping</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={connectWallet} disabled={isConnecting} className="w-full gap-2 py-6 text-lg" size="lg">
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Supported wallets:</p>
              <div className="flex justify-center gap-4 mt-2">
                <span>MetaMask</span>
                <span>•</span>
                <span>WalletConnect</span>
                <span>•</span>
                <span>Coinbase</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground text-center">
                By connecting your wallet, you agree to our Terms of Service and Privacy Policy. Your wallet address
                will be used as your unique identifier.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-primary font-bold">$</span>
            </div>
            <h3 className="font-semibold text-sm">Crypto Tips</h3>
            <p className="text-xs text-muted-foreground">Send tips with Base Pay</p>
          </div>
          <div className="p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-primary font-bold">🎉</span>
            </div>
            <h3 className="font-semibold text-sm">Social Recognition</h3>
            <p className="text-xs text-muted-foreground">Celebrate achievements</p>
          </div>
        </div>
      </div>
    </div>
  )
}
