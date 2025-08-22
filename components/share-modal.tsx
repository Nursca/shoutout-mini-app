"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button"
import { postCastWithEmbed } from "@/lib/farcasterApi"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Share2, Download, MessageCircle, Twitter, Facebook, Linkedin } from "lucide-react"
import type { ShoutoutData } from "./shoutout-card"
import sdk from '@farcaster/frame-sdk';

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shoutout: ShoutoutData
}

function WalletConnect() {
  const { publicKey, connect, disconnect, connected } = useWallet();
  const walletProvider = sdk.wallet.getEthereumProvider();
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div>
      {connected ? (
        <button onClick={() => disconnect()}>
          Disconnect {publicKey?.toBase58().slice(0, 4)}...
        </button>
      ) : (
        <button onClick={handleConnect}>
          Connect Farcaster Wallet
        </button>
      )}
    </div>
  );
}

export function ShareModal({ isOpen, onClose, shoutout }: ShareModalProps) {
  const searchParams = useSearchParams()
  const [text, setText] = useState("")
  const [embedUrl, setEmbedUrl] = useState<string | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <ShareModal isOpen={true} 
      onClose={() => {}} 
      shoutout={
        {
        id: "123",
        sender: {
          username: "Unknown",
        },
        recipient: {
          username: 'Unknown',
        },
        customMessage: '',
        category: { id: "123", label: "Shared Cast", emoji: "🔗" },
        theme: { id: "123", emojis: ["🌞"] },
        background: { id: "123", class: "white", name: "White" }
      }} 
    />
  );

  useEffect(() => {
    const t = searchParams.get("text") || ""
    const e = searchParams.get("embedUrl") || undefined
    setText(t)
    setEmbedUrl(e)
  }, [searchParams])

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/shoutout/${shoutout.id}`
  const shareText = `Check out this shoutout from @${shoutout.sender.username} to @${shoutout.recipient.username}! ${shoutout.customMessage || shoutout.category.label}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shoutout from @${shoutout.sender.username}`,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Failed to share:", err)
      }
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // In a real app, this would generate and download the card as an image
      // For demo, we'll simulate the download
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a mock download
      const link = document.createElement("a")
      link.href = "/placeholder.svg?height=400&width=400&text=Shoutout+Card"
      link.download = `shoutout-${shoutout.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Failed to download:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  const socialShares = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-950",
    },
    {
      name: "Farcaster",
      icon: MessageCircle,
      url: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Share Shoutout</DialogTitle>
          <DialogDescription>Share this shoutout with your network</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex gap-2">
                <Input id="share-url" value={shareUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} variant="outline" className="gap-2 bg-transparent">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            {typeof window !== "undefined" && 'share' in navigator && (
              <Button onClick={handleNativeShare} className="w-full gap-2">
                <Share2 className="w-4 h-4" />
                Share via...
              </Button>
            )}

            <div className="text-xs text-muted-foreground">
              Anyone with this link can view the shoutout and add additional tips
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {socialShares.map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  className={`gap-2 h-auto py-3 ${platform.color} bg-transparent`}
                  onClick={() => window.open(platform.url, "_blank", "noopener,noreferrer")}
                >
                  <platform.icon className="w-4 h-4" />
                  <span className="text-sm">{platform.name}</span>
                </Button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              Share on your favorite social platforms to spread the positivity
            </div>
          </TabsContent>

          <TabsContent value="download" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Download as Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save this shoutout card as a high-quality PNG image
                </p>
              </div>
              <Button onClick={handleDownload} disabled={isDownloading} className="gap-2">
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PNG
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Perfect for sharing on Instagram, saving to your camera roll, or printing
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
