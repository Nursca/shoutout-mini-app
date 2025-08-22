import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoutoutCard, sampleShoutoutData } from "@/components/shoutout-card"
import { ArrowLeft, MapPin, Calendar, ExternalLink, Users, Heart, Send } from "lucide-react"
import Link from "next/link"

// Mock profile data
const profileData = {
  id: "1",
  username: "cryptodev",
  walletAddress: "0x1234...5678",
  ensName: "cryptodev.eth",
  avatar: "/diverse-profile-avatars.png",
  bio: "Building the future of social tipping 🚀 Love celebrating others' achievements!",
  location: "San Francisco, CA",
  joinedAt: new Date("2024-01-15"),
  website: "https://cryptodev.com",
  stats: {
    shoutoutsSent: 47,
    shoutsReceived: 23,
    totalTipped: 125.5,
    totalReceived: 89.25,
    followers: 156,
    following: 89,
  },
}

// Mock shoutouts data
const userShoutouts = [
  {
    ...sampleShoutoutData,
    id: "1",
    sender: { username: "alice" },
    recipient: { username: "cryptodev" },
    category: { id: "congrats", label: "🎉 Congrats", emoji: "🎉" },
    customMessage: "Amazing work on the new feature launch!",
    amount: 5,
    timestamp: new Date("2024-01-20"),
  },
  {
    ...sampleShoutoutData,
    id: "2",
    sender: { username: "bob" },
    recipient: { username: "cryptodev" },
    category: { id: "thanks", label: "🙏 Thank You", emoji: "🙏" },
    customMessage: "Thanks for helping with the code review!",
    background: {
      id: "blue",
      class: "bg-gradient-to-br from-blue-400 to-blue-600",
      name: "Ocean Blue",
    },
    amount: 2,
    timestamp: new Date("2024-01-18"),
  },
]

const sentShoutouts = [
  {
    ...sampleShoutoutData,
    id: "3",
    sender: { username: "cryptodev" },
    recipient: { username: "charlie" },
    category: { id: "bigwin", label: "🚀 Big Win", emoji: "🚀" },
    customMessage: "Incredible presentation today!",
    background: {
      id: "green",
      class: "bg-gradient-to-br from-green-400 to-emerald-500",
      name: "Forest Green",
    },
    amount: 10,
    timestamp: new Date("2024-01-19"),
  },
]

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params
  const isOwnProfile = username === "cryptodev" // In real app, check against current user

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-xl font-serif font-bold">@{username}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.username}
                  className="w-24 h-24 rounded-full border-4 border-primary/20 mb-4"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-serif font-bold mb-1">@{profileData.username}</h1>
                  {profileData.ensName && (
                    <Badge variant="secondary" className="mb-2">
                      {profileData.ensName}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mb-2">{profileData.walletAddress}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <p className="text-foreground mb-4">{profileData.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {profileData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {profileData.joinedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                  {profileData.website && (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>

                <div className="flex gap-4 text-sm mb-4">
                  <span>
                    <strong>{profileData.stats.following}</strong> Following
                  </span>
                  <span>
                    <strong>{profileData.stats.followers}</strong> Followers
                  </span>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <Link href={`/create?recipient=${username}`}>
                      <Button className="gap-2">
                        <Send className="w-4 h-4" />
                        Send Shoutout
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">{profileData.stats.shoutsReceived}</div>
              <div className="text-sm text-muted-foreground">Shoutouts Received</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">{profileData.stats.shoutoutsSent}</div>
              <div className="text-sm text-muted-foreground">Shoutouts Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">${profileData.stats.totalReceived}</div>
              <div className="text-sm text-muted-foreground">Total Received</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold text-primary mb-1">${profileData.stats.totalTipped}</div>
              <div className="text-sm text-muted-foreground">Total Tipped</div>
            </CardContent>
          </Card>
        </div>

        {/* Shoutouts Tabs */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="gap-2">
              <Heart className="w-4 h-4" />
              Received ({userShoutouts.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <Send className="w-4 h-4" />
              Sent ({sentShoutouts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userShoutouts.map((shoutout) => (
                <ShoutoutCard key={shoutout.id} data={shoutout} size="square" interactive={true} showActions={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sentShoutouts.map((shoutout) => (
                <ShoutoutCard key={shoutout.id} data={shoutout} size="square" interactive={true} showActions={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
