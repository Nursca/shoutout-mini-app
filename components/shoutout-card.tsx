"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share, Download, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ShoutoutData {
  id?: string
  sender: {
    username: string
    avatar?: string
  }
  recipient: {
    username: string
    avatar?: string
  }
  category: {
    id: string
    label: string
    emoji: string
  }
  customMessage?: string
  theme: {
    id: string
    emojis: string[]
  }
  background: {
    id: string
    class: string
    name: string
  }
  amount?: number
  timestamp?: Date
  totalTips?: number
  tipCount?: number
}

interface ShoutoutCardProps {
  data: ShoutoutData
  size?: "square" | "portrait" | "landscape"
  interactive?: boolean
  showActions?: boolean
  className?: string
  onShare?: () => void
  onLike?: () => void
  onAddTip?: () => void
}

export function ShoutoutCard({
  data,
  size = "square",
  interactive = false,
  showActions = false,
  className,
  onShare,
  onLike,
  onAddTip,
}: ShoutoutCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onShare) {
      onShare()
    } else if (navigator.share) {
      navigator.share({
        title: `Shoutout from @${data.sender.username}`,
        text: `Check out this shoutout I received!`,
        url: window.location.href,
      })
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, this would generate and download the card as an image
    console.log("Downloading card...")
  }

  const handleAddTip = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddTip) {
      onAddTip()
    } else {
      // In a real app, this would open the tip modal
      console.log("Adding tip...")
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onLike) {
      onLike()
    } else {
      console.log("Liking shoutout...")
    }
  }

  return (
    <div className={cn("group", className)}>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden border-2 border-border transition-all duration-300 bg-amber-900",
          sizeClasses[size],
          interactive && "cursor-pointer hover:scale-105 hover:shadow-lg",
          isHovered && "ring-2 ring-primary/20",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background */}
        <div className={cn("absolute inset-0", data.background.class)} />

        {/* Decorative Emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {data.theme.emojis.map((emoji, i) => (
            <span
              key={i}
              className={cn(
                "absolute text-2xl transition-all duration-500",
                isHovered ? "opacity-30 scale-110" : "opacity-20",
              )}
              style={{
                left: `${15 + i * 18}%`,
                top: `${10 + i * 20}%`,
                transform: `rotate(${i * 20 - 40}deg)`,
                animationDelay: `${i * 100}ms`,
              }}
            >
              {emoji}
            </span>
          ))}

          {/* Additional scattered emojis for larger cards */}
          {size !== "square" &&
            data.theme.emojis.map((emoji, i) => (
              <span
                key={`extra-${i}`}
                className="absolute text-lg opacity-10 transition-all duration-500"
                style={{
                  right: `${10 + i * 15}%`,
                  bottom: `${15 + i * 12}%`,
                  transform: `rotate(${-i * 25 + 30}deg)`,
                }}
              >
                {emoji}
              </span>
            ))}
        </div>

        {/* Hover Glow Effect */}
        {isHovered && <div className="absolute inset-0 bg-white/10 animate-pulse" />}

        {/* Card Content */}
        <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {data.sender.avatar ? (
                  <img
                    src={data.sender.avatar || "/placeholder.svg"}
                    alt={data.sender.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">{data.sender.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="text-sm opacity-90 font-medium">@{data.sender.username}</span>
            </div>

            {data.timestamp && <span className="text-xs opacity-70">{data.timestamp.toLocaleDateString()}</span>}
          </div>

          {/* Category Badge */}
          <div className="flex justify-center">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <span className="mr-1">{data.category.emoji}</span>
              {data.category.label.replace(data.category.emoji + " ", "")}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-3">
            {/* Arrow and Recipient */}
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-light opacity-90">→</div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {data.recipient.avatar ? (
                    <img
                      src={data.recipient.avatar || "/placeholder.svg"}
                      alt={data.recipient.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">{data.recipient.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="text-lg sm:text-xl font-bold">@{data.recipient.username}</div>
              </div>
            </div>

            {/* Custom Message */}
            {data.customMessage && (
              <p className="text-sm sm:text-base opacity-90 max-w-xs mx-auto leading-relaxed">"{data.customMessage}"</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Amount */}
            <div>
              {data.amount && (
                <div className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                  <span className="font-bold text-sm sm:text-base">${data.amount}</span>
                </div>
              )}
            </div>

            {/* Additional Tips */}
            <div className="text-right">
              {data.tipCount && data.tipCount > 1 && (
                <div className="text-xs opacity-80">
                  +{data.tipCount - 1} more tip{data.tipCount > 2 ? "s" : ""}
                </div>
              )}
              {data.totalTips && data.totalTips > (data.amount || 0) && (
                <div className="text-sm font-semibold">Total: ${data.totalTips}</div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Actions Overlay */}
        {interactive && isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white"
                onClick={handleLike}
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white"
                onClick={handleAddTip}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleAddTip} className="gap-1">
              <Plus className="w-4 h-4" />
              Add Tip
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLike} className="gap-1">
              <Heart className="w-4 h-4" />
              {data.tipCount || 0}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1">
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Sample data for testing
export const sampleShoutoutData: ShoutoutData = {
  id: "1",
  sender: {
    username: "alice",
    avatar: "/placeholder.svg?key=glsxt",
  },
  recipient: {
    username: "bob",
    avatar: "/placeholder.svg?key=kcwdq",
  },
  category: {
    id: "congrats",
    label: "🎉 Congrats",
    emoji: "🎉",
  },
  customMessage: "Amazing work on the product launch! You've been crushing it!",
  theme: {
    id: "celebration",
    emojis: ["🎉", "🎊", "✨", "🌟"],
  },
  background: {
    id: "orange",
    class: "bg-gradient-to-br from-orange-400 to-orange-600",
    name: "Sunset Orange",
  },
  amount: 5,
  timestamp: new Date(),
  totalTips: 12,
  tipCount: 3,
}
