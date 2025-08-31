import { useAccount, useConnect } from 'wagmi'

export function ConnectMenu() {
  const { isConnected, address } = useAccount()
  const { connect, connectors, status } = useConnect()

  if (isConnected) {
    return (
      <div style={{ padding: '0.5rem 1rem', background: '#f5f5f5', borderRadius: 8, fontSize: 14 }}>
        <div>You're connected!</div>
        <div style={{ wordBreak: 'break-all' }}>Address: {address}</div>
      </div>
    )
  }

  return (
    <button
      type="button"
      style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#6366f1', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
      onClick={() => connect({ connector: connectors[0] })}
      disabled={status === "pending"}
    >
      {status === "pending" ? 'Connecting...' : 'Connect'}
    </button>
  )
}
