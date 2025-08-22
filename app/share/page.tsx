"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { ShareModal } from "@/components/share-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { postCastWithEmbed } from "@/lib/farcasterApi"

export default function SharePage() {
  const params = useSearchParams()
  const [text, setText] = useState("")
  const [embedUrl, setEmbedUrl] = useState<string | undefined>(undefined)
  const [isComposing, setIsComposing] = useState(false)

  // return (
  //   <Suspense fallback={<div>Loading...</div>}>
  //     <ShareModal isOpen={true} onClose={() => {}} shoutout={shoutout} />
  //   </Suspense>
  // );

  useEffect(() => {
    const t = params.get("text") || ""
    const e = params.get("embedUrl") || undefined
    setText(t)
    setEmbedUrl(e)
  }, [params])

  const handleCompose = async () => {
    setIsComposing(true)
    try {
      await postCastWithEmbed({ text, embedUrl })
    } finally {
      setIsComposing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-serif">Share to Farcaster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Text</div>
            <div className="p-3 border rounded-md bg-muted/30 text-sm">{text || "(empty)"}</div>
          </div>

          {embedUrl && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Embed</div>
              <a href={embedUrl} target="_blank" rel="noreferrer" className="text-primary text-sm break-all">
                {embedUrl}
              </a>
            </div>
          )}

          <Button onClick={handleCompose} disabled={isComposing} className="w-full">
            {isComposing ? "Opening composer..." : "Open Composer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


