"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Palette, DollarSign, Send, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { ShoutoutCard } from "@/components/shoutout-card"
import { PaymentModal } from "@/components/payment-modal"
import type { ShoutoutData } from "@/components/shoutout-card"
import { useRouter } from "next/navigation"
import { searchFarcasterUsers } from "@/lib/farcasterApi"
import { useShoutoutForm } from "@/hooks/useShoutoutForm"

const MESSAGE_CATEGORIES = [
  { id: "congrats", label: "🎉 Congrats", emoji: "🎉" },
  { id: "thanks", label: "🙏 Thank You", emoji: "🙏" },
  { id: "bigwin", label: "🚀 Big Win", emoji: "🚀" },
  { id: "gmvibes", label: "☀️ GM Vibes", emoji: "☀️" },
  { id: "keepgoing", label: "💪 Keep Going", emoji: "💪" },
  { id: "celebration", label: "🎂 Celebration", emoji: "🎂" },
  { id: "firework", label: "🔥 Fire Work", emoji: "🔥" },
  { id: "custom", label: "✨ Custom", emoji: "✨" },
]

const EMOJI_THEMES = [
  { id: "celebration", emojis: ["🎉", "🎊", "✨", "🌟"] },
  { id: "gratitude", emojis: ["🙏", "❤️", "💝", "🤗"] },
  { id: "motivation", emojis: ["💪", "🚀", "⚡", "🔥"] },
  { id: "success", emojis: ["🏆", "👑", "💎", "🌟"] },
  { id: "love", emojis: ["❤️", "💕", "💖", "🥰"] },
]

const BACKGROUND_COLORS = [
  { id: "orange", class: "bg-gradient-to-br from-orange-400 to-orange-600", name: "Sunset Orange" },
  { id: "pink", class: "bg-gradient-to-br from-pink-400 to-rose-500", name: "Rose Pink" },
  { id: "blue", class: "bg-gradient-to-br from-blue-400 to-blue-600", name: "Ocean Blue" },
  { id: "purple", class: "bg-gradient-to-br from-purple-400 to-purple-600", name: "Royal Purple" },
  { id: "green", class: "bg-gradient-to-br from-green-400 to-emerald-500", name: "Forest Green" },
  { id: "yellow", class: "bg-gradient-to-br from-yellow-400 to-amber-500", name: "Golden Sun" },
]

const PAYMENT_AMOUNTS = [
  { value: 0.1, label: "$0.10" },
  { value: 0.5, label: "$0.50" },
  { value: 1, label: "$1.00" },
  { value: 5, label: "$5.00" },
  { value: 10, label: "$10.00" },
]

export default function CreateShoutoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const shoutoutForm = useShoutoutForm()
  const [recipient, setRecipient] = useState("")
  const [recipientSuggestions, setRecipientSuggestions] = useState<
    Array<{ fid: number; username: string; displayName?: string; pfpUrl?: string }>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("celebration")
  const [selectedBackground, setSelectedBackground] = useState("orange")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [cardSize, setCardSize] = useState<"square" | "portrait" | "landscape">("square")

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategoryData = MESSAGE_CATEGORIES.find((cat) => cat.id === selectedCategory)
  const selectedThemeData = EMOJI_THEMES.find((theme) => theme.id === selectedTheme)
  const selectedBackgroundData = BACKGROUND_COLORS.find((bg) => bg.id === selectedBackground)

  // Create preview data for the ShoutoutCard
  const previewData: ShoutoutData = {
    sender: {
      username: "you",
    },
    recipient: {
      username: recipient || "recipient",
    },
    category: selectedCategoryData || MESSAGE_CATEGORIES[0],
    customMessage: selectedCategory === "custom" ? customMessage : undefined,
    theme: selectedThemeData || EMOJI_THEMES[0],
    background: selectedBackgroundData || BACKGROUND_COLORS[0],
    amount: selectedAmount || undefined,
    timestamp: new Date(),
  }

  const handlePaymentSuccess = async (txHash: string) => {
    setShowPaymentModal(false)
    setIsSubmitting(false)

    // In a real app, you'd save the shoutout to the database here and get a real id
    const shoutoutId = `so_${Date.now().toString(36)}`
    await shoutoutForm.submitToFarcaster(shoutoutId)
    router.push("/gallery?success=true")
  }

  const handlePaymentError = (error: string) => {
    setShowPaymentModal(false)
    setIsSubmitting(false)
    console.error("Payment failed:", error)
  }

  const handleSendShoutout = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!recipient || !selectedCategory) {
      return
    }

    setIsSubmitting(true)

    if (selectedAmount && selectedAmount > 0) {
      // Show payment modal for paid shoutouts
      setShowPaymentModal(true)
    } else {
      // Handle free shoutouts
      ;(async () => {
        const shoutoutId = `so_${Date.now().toString(36)}`
        await shoutoutForm.submitToFarcaster(shoutoutId)
        setIsSubmitting(false)
        router.push("/gallery?success=true")
      })()
    }
  }

  return (
    <div className="min-h-screen bg-amber-950">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-serif font-bold">Create Shoutout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Creation Form */}
          <div className="space-y-6">
            {/* Recipient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Search className="w-5 h-5 text-primary" />
                  Who are you shouting out?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Search username or enter @handle"
                    value={recipient}
                    onChange={async (e) => {
                      const value = e.target.value
                      setRecipient(value)
                      try {
                        // Also update form state (strip optional leading @)
                        const clean = value.replace(/^@/, "")
                        shoutoutForm.setRecipient(clean)
                      } catch {}
                      if (value.length < 2) {
                        setRecipientSuggestions([])
                        return
                      }
                      setIsSearching(true)
                      try {
                        const results = await searchFarcasterUsers(value)
                        setRecipientSuggestions(results)
                      } finally {
                        setIsSearching(false)
                      }
                    }}
                    className="pl-8"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />

                  {/* Suggestions dropdown */}
                  {recipientSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full border rounded-md bg-popover shadow-sm">
                      {recipientSuggestions.map((u) => (
                        <button
                          key={u.fid}
                          type="button"
                          className="w-full flex items-center gap-3 p-2 hover:bg-muted text-left"
                          onClick={() => {
                            setRecipient(u.username)
                            shoutoutForm.setRecipient(u.username)
                            setRecipientSuggestions([])
                          }}
                        >
                          <img
                            src={u.pfpUrl || "/placeholder.svg"}
                            alt={u.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">@{u.username}</span>
                            {u.displayName && (
                              <span className="text-xs text-muted-foreground">{u.displayName}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Choose your vibe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {MESSAGE_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="justify-start gap-2 h-auto py-3"
                      onClick={() => {
                        setSelectedCategory(category.id)
                        shoutoutForm.setCategory(category.id as any)
                      }}
                    >
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-sm">{category.label.replace(category.emoji + " ", "")}</span>
                    </Button>
                  ))}
                </div>

                {selectedCategory === "custom" && (
                  <div className="mt-4">
                    <Label htmlFor="custom-message">Custom Message</Label>
                    <Textarea
                      id="custom-message"
                      placeholder="Write your personalized message..."
                      value={customMessage}
                      onChange={(e) => {
                        setCustomMessage(e.target.value)
                        shoutoutForm.setMessage(e.target.value)
                      }}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visual Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Palette className="w-5 h-5 text-primary" />
                  Customize your card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Card Size */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Card Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["square", "portrait", "landscape"] as const).map((size) => (
                      <Button
                        key={size}
                        variant={cardSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCardSize(size)}
                        className="capitalize"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Emoji Theme */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Emoji Theme</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {EMOJI_THEMES.map((theme) => (
                      <Button
                        key={theme.id}
                        variant={selectedTheme === theme.id ? "default" : "outline"}
                        size="sm"
                        className="h-12 p-1"
                        onClick={() => {
                          setSelectedTheme(theme.id)
                          shoutoutForm.setEmojiTheme(theme.id)
                        }}
                      >
                        <div className="flex gap-1 text-xs">
                          {theme.emojis.slice(0, 2).map((emoji, i) => (
                            <span key={i}>{emoji}</span>
                          ))}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Background Colors */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Background</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {BACKGROUND_COLORS.map((bg) => (
                      <Button
                        key={bg.id}
                        variant="outline"
                        className={`h-16 p-2 relative overflow-hidden ${
                          selectedBackground === bg.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => {
                          setSelectedBackground(bg.id)
                          shoutoutForm.setBackground(bg.id)
                        }}
                      >
                        <div className={`absolute inset-0 ${bg.class}`} />
                        <span className="relative text-xs font-medium text-white drop-shadow-sm">{bg.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Add a tip (optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PAYMENT_AMOUNTS.map((amount) => (
                    <Button
                      key={amount.value}
                      variant={selectedAmount === amount.value ? "default" : "outline"}
                      onClick={() => {
                        setSelectedAmount(amount.value)
                        shoutoutForm.setAmount(amount.value)
                      }}
                      className="h-12"
                    >
                      {amount.label}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (customAmount) {
                        const amt = Number.parseFloat(customAmount)
                        setSelectedAmount(amt)
                        shoutoutForm.setAmount(amt)
                      }
                    }}
                  >
                    Set
                  </Button>
                </div>

                {selectedAmount && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Sending <span className="font-semibold text-primary">${selectedAmount}</span> via Base Pay
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Network fees: ~$0.02 • Confirmation time: ~2 seconds
                    </p>
                  </div>
                )}

                {selectedAmount && !user && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm font-medium">Wallet required for payments</span>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Connect your wallet to send crypto tips with your shoutout
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Card */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ShoutoutCard data={previewData} size={cardSize} interactive={false} />

                <Button
                  className="w-full mt-6 gap-2 text-lg py-6"
                  size="lg"
                  disabled={!recipient || !selectedCategory || isSubmitting}
                  onClick={handleSendShoutout}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {selectedAmount ? "Processing Payment..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {selectedAmount ? `Send Shoutout + $${selectedAmount}` : "Send Shoutout"}
                    </>
                  )}
                </Button>

                {selectedAmount && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Powered by Base Pay • Secure crypto payments
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedAmount && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={selectedAmount}
          recipient={recipient}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  )
}
