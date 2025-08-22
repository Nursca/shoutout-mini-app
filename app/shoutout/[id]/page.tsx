import { ShoutoutCard, sampleShoutoutData } from "@/components/shoutout-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share, Heart, Plus, MessageCircle, Calendar, User } from "lucide-react"
import Link from "next/link"

// Mock data - in real app, this would come from database
const shoutoutData = {
  ...sampleShoutoutData,
  id: "1",
  sender: { username: "alice", avatar: "/diverse-profile-avatars.png" },
  recipient: { username: "bob", avatar: "/diverse-profile-avatars.png" },
  category: { id: "congrats", label: "🎉 Congrats", emoji: "🎉" },
  customMessage:
    "Amazing work on the product launch! Your dedication and creativity really paid off. The whole team is inspired by your success!",
  amount: 5,
  totalTips: 12,
  tipCount: 3,
  timestamp: new Date("2024-01-20T10:30:00"),
}

const additionalTippers = [
  { username: "charlie", amount: 3, timestamp: new Date("2024-01-20T11:15:00") },
  { username: "diana", amount: 4, timestamp: new Date("2024-01-20T14:22:00") },
]

interface ShoutoutPageProps {
  params: {
    id: string
  }
}

export default function ShoutoutPage({ params }: ShoutoutPageProps) {
  const { id } = params

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/gallery">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-serif font-bold">Shoutout Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <div className="max-w-md mx-auto">
              <ShoutoutCard data={shoutoutData} size="portrait" interactive={false} showActions={false} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-6">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Tip
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Heart className="w-4 h-4" />
                Like
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {/* Shoutout Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Shoutout Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={shoutoutData.sender.avatar || "/placeholder.svg"}
                    alt={shoutoutData.sender.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">@{shoutoutData.sender.username}</p>
                    <p className="text-sm text-muted-foreground">Sender</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-2xl justify-center py-2">
                  <span className="text-muted-foreground">→</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={shoutoutData.recipient.avatar || "/placeholder.svg"}
                    alt={shoutoutData.recipient.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">@{shoutoutData.recipient.username}</p>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {shoutoutData.timestamp.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="gap-1">
                      {shoutoutData.category.emoji}{" "}
                      {shoutoutData.category.label.replace(shoutoutData.category.emoji + " ", "")}
                    </Badge>
                  </div>

                  {shoutoutData.customMessage && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm italic">"{shoutoutData.customMessage}"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tip Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Tip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-primary mb-1">${shoutoutData.totalTips}</div>
                  <div className="text-sm text-muted-foreground">
                    Total from {shoutoutData.tipCount} tip{shoutoutData.tipCount !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />@{shoutoutData.sender.username}
                    </span>
                    <span className="font-medium">${shoutoutData.amount}</span>
                  </div>

                  {additionalTippers.map((tipper, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />@{tipper.username}
                      </span>
                      <span className="font-medium">${tipper.amount}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full gap-2 mt-4">
                  <Plus className="w-4 h-4" />
                  Add Your Tip
                </Button>
              </CardContent>
            </Card>

            {/* Comments/Reactions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Community Love</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">🎉</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>@charlie:</strong> So well deserved! 🚀
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">❤️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>@diana:</strong> Amazing work indeed!
                      </p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                  <MessageCircle className="w-4 h-4" />
                  Add Reaction
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
