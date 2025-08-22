'use client';

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Heart, TrendingUp } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"
import ErrorBoundary from './errorboundary';
import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { FarcasterSolanaProvider } from '@farcaster/mini-app-solana';

export default function HomePage() {
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sdk.actions.ready()
    .then(() => setSdkReady(true))
    .catch((err: Error) => {
      console.warn('SDK ready failed:', err);
      setError('Failed to initialize app');
        // Still show the app even if SDK fails
       setSdkReady(true);
    });
  }, []);


  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-amber-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <FarcasterSolanaProvider endpoint="https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY">
        {sdkReady && <MiniApp />}
      </FarcasterSolanaProvider>
    </ErrorBoundary>
  );
}

function MiniApp() {
  return (
    <div className="min-h-screen bg-amber-950">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Shoutout</h1>
            </div>
            <div className="flex items-center gap-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl text-white font-serif font-bold mb-6">
            Celebrate Others with
            <span className="text-white block">Crypto Tips</span>
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Send onchain shoutouts to recognize achievements, spread positivity, and build
            stronger communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button variant="outline" size="lg" className="gap-2 text-lg text-stone-200 bg-transparent px-8 py-6">
                <Plus className="w-5 h-5" />
                Send Your First Shoutout
              </Button>
            </Link>
            <Link href="/discover">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 text-stone-200 bg-transparent">
                Explore Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">How Shoutout Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Create</CardTitle>
                <CardDescription>
                  Design personalized cards with custom messages, themes, and payment amounts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Send</CardTitle>
                <CardDescription>Share your shoutout with crypto tips via Base Pay to celebrate others</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Share</CardTitle>
                <CardDescription>
                  Recipients can share their shoutouts and others can add additional tips
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-amber-950">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">$12.5K</div>
              <div className="text-muted-foreground">Tips Sent</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">2.1K</div>
              <div className="text-muted-foreground">Shoutouts</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">850</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Happy Recipients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-lg">Shoutout</span>
          </div>
          <p className="text-black">Spreading positivity, one shoutout at a time.</p>
        </div>
      </footer>
    </div>
  );
}