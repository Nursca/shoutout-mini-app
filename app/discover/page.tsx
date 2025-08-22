"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Users, Award, Star, Zap } from "lucide-react"
import { ShoutoutCard, sampleShoutoutData } from "@/components/shoutout-card"

// Mock data for discovery features
const trendingShoutouts = [
  {
    id: "1",
    message: "Amazing work on the project launch! 🚀",
    amount: 0.05,
    sender: { name: "Alex Chen", avatar: "/diverse-profile-avatars.png", username: "alexc" },
    recipient: { name: "Sarah Kim", avatar: "/diverse-profile-avatars.png", username: "sarahk" },
    category: "Congrats",
    theme: "celebration",
    background: "gradient-orange",
    timestamp: "2 hours ago",
    likes: 24,
    shares: 8,
  },
  {
    id: "2",
    message: "Thank you for always being so helpful and kind!",
    amount: 0.02,
    sender: { name: "Mike Johnson", avatar: "/diverse-profile-avatars.png", username: "mikej" },
    recipient: { name: "Emma Davis", avatar: "/diverse-profile-avatars.png", username: "emmad" },
    category: "Thank You",
    theme: "gratitude",
    background: "solid-orange",
    timestamp: "4 hours ago",
    likes: 18,
    shares: 5,
  },
]

const topTippers = [
  { name: "Alex Chen", username: "alexc", avatar: "/diverse-profile-avatars.png", totalTipped: 2.45, shoutouts: 23 },
  { name: "Sarah Kim", username: "sarahk", avatar: "/diverse-profile-avatars.png", totalTipped: 1.89, shoutouts: 18 },
  { name: "Mike Johnson", username: "mikej", avatar: "/diverse-profile-avatars.png", totalTipped: 1.67, shoutouts: 15 },
  { name: "Emma Davis", username: "emmad", avatar: "/diverse-profile-avatars.png", totalTipped: 1.23, shoutouts: 12 },
]

const mostAppreciated = [
  { name: "Emma Davis", username: "emmad", avatar: "/diverse-profile-avatars.png", totalReceived: 3.21, shoutouts: 28 },
  { name: "Sarah Kim", username: "sarahk", avatar: "/diverse-profile-avatars.png", totalReceived: 2.87, shoutouts: 24 },
  { name: "Alex Chen", username: "alexc", avatar: "/diverse-profile-avatars.png", totalReceived: 2.34, shoutouts: 19 },
  {
    name: "Mike Johnson",
    username: "mikej",
    avatar: "/diverse-profile-avatars.png",
    totalReceived: 1.98,
    shoutouts: 16,
  },
]

const suggestedUsers = [
  {
    name: "Jordan Lee",
    username: "jordanl",
    avatar: "/diverse-profile-avatars.png",
    mutualConnections: 5,
    recentActivity: "Sent 3 shoutouts this week",
  },
  {
    name: "Taylor Swift",
    username: "taylors",
    avatar: "/diverse-profile-avatars.png",
    mutualConnections: 3,
    recentActivity: "Top tipper in Music category",
  },
  {
    name: "Chris Park",
    username: "chrisp",
    avatar: "/diverse-profile-avatars.png",
    mutualConnections: 7,
    recentActivity: "Most appreciated developer",
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("trending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Discover</h1>
          <p className="text-lg text-gray-600">Explore trending shoutouts and connect with the community</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users, shoutouts, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">5,832</div>
              <div className="text-sm text-gray-600">Shoutouts Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">$12,456</div>
              <div className="text-sm text-gray-600">Total Tipped</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">+23%</div>
              <div className="text-sm text-gray-600">Growth This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
            <TabsTrigger value="discover">Discover Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Shoutouts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingShoutouts.map((shoutout) => {
                  const data = {
                    ...sampleShoutoutData,
                    sender: {
                      username: shoutout.sender.username,
                      avatar: shoutout.sender.avatar,
                    },
                    recipient: {
                      username: shoutout.recipient.username,
                      avatar: shoutout.recipient.avatar,
                    },
                    customMessage: shoutout.message,
                    amount: shoutout.amount,
                  }
                  return <ShoutoutCard key={shoutout.id} data={data} size="square" interactive={true} />
                })}
              </div>
            </div>
          </TabsContent>

          {/* Leaderboards Tab */}
          <TabsContent value="leaderboards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Tippers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    Top Tippers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topTippers.map((user, index) => (
                    <div key={user.username} className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">@{user.username}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">${user.totalTipped}</div>
                        <div className="text-sm text-gray-600">{user.shoutouts} shoutouts</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Most Appreciated */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-600" />
                    Most Appreciated
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mostAppreciated.map((user, index) => (
                    <div key={user.username} className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">@{user.username}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">${user.totalReceived}</div>
                        <div className="text-sm text-gray-600">{user.shoutouts} received</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discover Users Tab */}
          <TabsContent value="discover" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((user) => (
                  <div key={user.username} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">@{user.username}</div>
                        <div className="text-sm text-gray-500">{user.mutualConnections} mutual connections</div>
                        <div className="text-sm text-orange-600">{user.recentActivity}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Congrats", count: 234, color: "bg-green-100 text-green-800" },
                { name: "Thank You", count: 189, color: "bg-blue-100 text-blue-800" },
                { name: "Good Job", count: 156, color: "bg-purple-100 text-purple-800" },
                { name: "Appreciation", count: 143, color: "bg-pink-100 text-pink-800" },
                { name: "Milestone", count: 98, color: "bg-yellow-100 text-yellow-800" },
                { name: "Support", count: 87, color: "bg-indigo-100 text-indigo-800" },
                { name: "Birthday", count: 76, color: "bg-red-100 text-red-800" },
                { name: "Other", count: 65, color: "bg-gray-100 text-gray-800" },
              ].map((category) => (
                <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Badge className={`${category.color} mb-2`}>{category.name}</Badge>
                    <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                    <div className="text-sm text-gray-600">shoutouts</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
