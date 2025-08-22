"use client"

// Intentionally light import to avoid heavy types for now

export interface FarcasterUserSuggestion {
  fid: number
  username: string
  displayName?: string
  pfpUrl?: string
  followerCount?: number
  followingCount?: number
}

export interface CastEmbedPayload {
  text: string
  embedUrl?: string
}

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY
const NEYNAR_BASE_URL = "https://api.neynar.com/v2/farcaster"

/**
 * Search Farcaster users by handle or display name.
 * Uses Neynar when NEXT_PUBLIC_NEYNAR_API_KEY is provided; falls back to a local mock otherwise.
 */
export async function searchFarcasterUsers(query: string): Promise<FarcasterUserSuggestion[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  if (!NEYNAR_API_KEY) {
    // Fallback mock data for local/dev without API key
    const mock: FarcasterUserSuggestion[] = [
      { fid: 1, username: "dwr", displayName: "DWR", pfpUrl: "/vercel.svg" },
      { fid: 2, username: "vitalik", displayName: "Vitalik", pfpUrl: "/next.svg" },
      { fid: 3, username: "you", displayName: "You", pfpUrl: "/globe.svg" },
    ]
    return mock.filter((u) => u.username.includes(trimmed) || u.displayName?.toLowerCase().includes(trimmed.toLowerCase()))
  }

  const url = `${NEYNAR_BASE_URL}/user/search?q=${encodeURIComponent(trimmed)}&limit=10`
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      api_key: NEYNAR_API_KEY,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    console.error("searchFarcasterUsers failed", await res.text())
    return []
  }

  const data = await res.json()
  const users = (data.result?.users || []) as Array<any>
  return users.map((u) => ({
    fid: u.fid,
    username: u.username,
    displayName: u.display_name,
    pfpUrl: u.pfp_url,
    followerCount: u.follower_count,
    followingCount: u.following_count,
  }))
}

/**
 * Resolve a user's verified ETH address by Farcaster username via Neynar.
 * Returns checksum address string if found, otherwise null.
 */
export async function resolveVerifiedEthAddressByUsername(
  username: string
): Promise<`0x${string}` | null> {
  if (!NEYNAR_API_KEY) return null
  const clean = username.replace(/^@/, "")
  const url = `${NEYNAR_BASE_URL}/user/by-username?username=${encodeURIComponent(clean)}`
  const res = await fetch(url, {
    headers: { accept: "application/json", api_key: NEYNAR_API_KEY },
    cache: "no-store",
  })
  if (!res.ok) return null
  const data = await res.json()
  const ethAddresses: string[] =
    data.result?.user?.verified_addresses?.eth_addresses || []
  const custody: string | undefined = data.result?.user?.custody_address
  const address = ethAddresses[0] || custody || null
  return address as `0x${string}` | null
}

/**
 * Open the Warpcast composer with text and optional embed URL.
 * Works universally without signer permissions.
 */
export function openCastComposer({ text, embedUrl }: CastEmbedPayload) {
  const params = new URLSearchParams()
  if (text) params.set("text", text)
  if (embedUrl) params.append("embeds[]", embedUrl)
  const url = `https://warpcast.com/~/compose?${params.toString()}`
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer")
  }
}

/**
 * Try posting a cast via Miniapp SDK if available; otherwise fall back to opening the composer.
 */
export async function postCastWithEmbed(payload: CastEmbedPayload) {
  // Prefer Miniapp SDK if present in Farcaster client
  const w = typeof window !== "undefined" ? (window as any) : undefined
  const sdk = w?.miniapp?.sdk
  if (sdk?.actions?.compose) {
    try {
      await sdk.actions.compose({ text: payload.text, embeds: payload.embedUrl ? [payload.embedUrl] : [] })
      return
    } catch (e) {
      console.warn("Miniapp compose failed, falling back to Warpcast composer", e)
    }
  }
  openCastComposer(payload)
}

/**
 * Helper to build a shoutout embed URL for a given ID.
 */
export function buildShoutoutEmbedUrl(origin: string, shoutoutId: string) {
  return `${origin}/shoutout/${encodeURIComponent(shoutoutId)}`
}


