"use client"

import { useState } from "react"
import { ShoutoutCard, sampleShoutoutData } from "@/components/shoutout-card"
import { ShareModal } from "@/components/share-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Grid, List, Search, Calendar, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"

// Sample data for gallery
const sampleShoutouts = [
  {
    ...sampleShoutoutData,
    id: "1",
    sender: { username: "alice" },
    recipient: { username: "bob" },
    category: { id: "congrats", label: "🎉 Congrats", emoji: "🎉" },
    customMessage: "Amazing work on the product launch!",
    amount: 5,
    totalTips: 12,
    tipCount: 3,
    timestamp: new Date("2024-01-20"),
  },
  {
    ...sampleShoutoutData,
    id: "2",
    sender: { username: "charlie" },
    recipient: { username: "diana" },
    category: { id: "thanks", label: "🙏 Thank You", emoji: "🙏" },
    customMessage: "Thanks for all your help with the project!",
    background: {
      id: "pink",
      class: "bg-gradient-to-br from-pink-400 to-rose-500",
      name: "Rose Pink",
    },
    theme: {
      id: "gratitude",
      emojis: ["🙏", "❤️", "💝", "🤗"],
    },
    amount: 2,
    totalTips: 8,
    tipCount: 4,
    timestamp: new Date("2024-01-18"),
  },
  {
    ...sampleShoutoutData,
    id: "3",
    sender: { username: "eve" },
    recipient: { username: "frank" },
    category: { id: "bigwin", label: "🚀 Big Win", emoji: "🚀" },
    customMessage: "Incredible presentation today!",
    background: {
      id: "blue",
      class: "bg-gradient-to-br from-blue-400 to-blue-600",
      name: "Ocean Blue",
    },
    theme: {
      id: "success",
      emojis: ["🏆", "👑", "💎", "🌟"],
    },
    amount: 10,
    totalTips: 25,
    tipCount: 5,
    timestamp: new Date("2024-01-15"),
  },
]

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterCategory, setFilterCategory] = useState("all")
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedShoutout, setSelectedShoutout] = useState<(typeof sampleShoutouts)[0] | null>(null)

  const handleShare = (shoutout: (typeof sampleShoutouts)[0]) => {
    setSelectedShoutout(shoutout)
    setShareModalOpen(true)
  }

  // Filter and sort shoutouts
  const filteredShoutouts = sampleShoutouts
    .filter((shoutout) => {
      const matchesSearch =
        shoutout.sender.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoutout.recipient.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shoutout.customMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      const matchesCategory = filterCategory === "all" || shoutout.category.id === filterCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.timestamp.getTime() - a.timestamp.getTime()
        case "amount":
          return (b.totalTips || 0) - (a.totalTips || 0)
        case "popular":
          return (b.tipCount || 0) - (a.tipCount || 0)
        default:
          return 0
      }
    })

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "congrats", label: "🎉 Congrats" },
    { id: "thanks", label: "🙏 Thank You" },
    { id: "bigwin", label: "🚀 Big Win" },
    { id: "gmvibes", label: "☀️ GM Vibes" },
    { id: "keepgoing", label: "💪 Keep Going" },
    { id: "celebration", label: "🎂 Celebration" },
    { id: "firework", label: "🔥 Fire Work" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-serif font-bold">My Shoutouts</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">$47</div>
              <div className="text-sm text-muted-foreground">Total Received</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Shoutouts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">8</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">24</div>
              <div className="text-sm text-muted-foreground">Total Tips</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search shoutouts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Most Recent
                    </div>
                  </SelectItem>
                  <SelectItem value="amount">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Highest Amount
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchQuery || filterCategory !== "all" || sortBy !== "recent") && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find((c) => c.id === filterCategory)?.label}
                    <button
                      onClick={() => setFilterCategory("all")}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterCategory("all")
                    setSortBy("recent")
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredShoutouts.length} of {sampleShoutouts.length} shoutouts
          </p>
        </div>

        {/* Gallery Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShoutouts.map((shoutout) => (
              <div key={shoutout.id} className="group">
                <Link href={`/shoutout/${shoutout.id}`}>
                  <ShoutoutCard data={shoutout} size="square" interactive={true} showActions={false} />
                </Link>
                <div className="flex items-center justify-between mt-3 px-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                      <Heart className="w-3 h-3" />
                      {shoutout.tipCount}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      handleShare(shoutout)
                    }}
                    className="gap-1 h-8 px-2"
                  >
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShoutouts.map((shoutout) => (
              <Card key={shoutout.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <Link href={`/shoutout/${shoutout.id}`}>
                        <ShoutoutCard
                          data={shoutout}
                          size="square"
                          interactive={false}
                          showActions={false}
                          className="w-full h-full"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">
                            @{shoutout.sender.username} → @{shoutout.recipient.username}
                          </h3>
                          <p className="text-sm text-muted-foreground">{shoutout.timestamp.toLocaleDateString()}</p>
                        </div>
                        <Badge>
                          {shoutout.category.emoji} {shoutout.category.label.replace(shoutout.category.emoji + " ", "")}
                        </Badge>
                      </div>

                      {shoutout.customMessage && <p className="text-sm">{shoutout.customMessage}</p>}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>${shoutout.totalTips} total</span>
                          <span>{shoutout.tipCount} tips</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Heart className="w-3 h-3" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare(shoutout)}>
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredShoutouts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No shoutouts found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setFilterCategory("all")
                setSortBy("recent")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {selectedShoutout && (
        <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} shoutout={selectedShoutout} />
      )}
    </div>
  )
}
