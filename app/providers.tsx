"use client"

import { ReactNode, useState } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { base } from "wagmi/chains"
import '@rainbow-me/rainbowkit/styles.css'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const config = createConfig({
    connectors: [miniAppConnector()],
    chains: [base],
    transports: {
      [base.id]: http(),
    },
    ssr: true,
  })

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


