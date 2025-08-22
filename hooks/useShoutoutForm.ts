"use client"

import { useState, useMemo } from "react"
import { postCastWithEmbed, buildShoutoutEmbedUrl } from "@/lib/farcasterApi"

export type ShoutoutCategory = "congrats" | "thanks" | "bigwin" | "gmvibes" | "keepgoing" | "celebration" | "firework" | "custom"

export interface ShoutoutFormState {
  recipientUsername: string
  category: ShoutoutCategory
  message?: string
  emojiThemeId: string
  backgroundId: string
  amountUsd?: number
}

export interface UseShoutoutFormResult {
  state: ShoutoutFormState
  setRecipient: (username: string) => void
  setCategory: (cat: ShoutoutCategory) => void
  setMessage: (msg: string | undefined) => void
  setEmojiTheme: (id: string) => void
  setBackground: (id: string) => void
  setAmount: (amount: number | undefined) => void
  submitToFarcaster: (shoutoutId: string) => Promise<void>
  isPosting: boolean
}

export function useShoutoutForm(initial?: Partial<ShoutoutFormState>): UseShoutoutFormResult {
  const [state, setState] = useState<ShoutoutFormState>({
    recipientUsername: initial?.recipientUsername ?? "",
    category: initial?.category ?? "congrats",
    message: initial?.message,
    emojiThemeId: initial?.emojiThemeId ?? "celebration",
    backgroundId: initial?.backgroundId ?? "orange",
    amountUsd: initial?.amountUsd,
  })

  const [isPosting, setIsPosting] = useState(false)

  const setRecipient = (username: string) => setState((s) => ({ ...s, recipientUsername: username }))
  const setCategory = (cat: ShoutoutCategory) => setState((s) => ({ ...s, category: cat }))
  const setMessage = (msg: string | undefined) => setState((s) => ({ ...s, message: msg }))
  const setEmojiTheme = (id: string) => setState((s) => ({ ...s, emojiThemeId: id }))
  const setBackground = (id: string) => setState((s) => ({ ...s, backgroundId: id }))
  const setAmount = (amount: number | undefined) => setState((s) => ({ ...s, amountUsd: amount }))

  const shareText = useMemo(() => {
    const base = `Shoutout to @${state.recipientUsername}!`
    const body = state.category === "custom" && state.message ? ` ${state.message}` : ""
    const tip = state.amountUsd ? ` (+$${state.amountUsd.toFixed(2)})` : ""
    return `${base}${body}${tip}`.trim()
  }, [state])

  const submitToFarcaster = async (shoutoutId: string) => {
    setIsPosting(true)
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const embedUrl = buildShoutoutEmbedUrl(origin, shoutoutId)
      await postCastWithEmbed({ text: shareText, embedUrl })
    } finally {
      setIsPosting(false)
    }
  }

  return {
    state,
    setRecipient,
    setCategory,
    setMessage,
    setEmojiTheme,
    setBackground,
    setAmount,
    submitToFarcaster,
    isPosting,
  }
}


