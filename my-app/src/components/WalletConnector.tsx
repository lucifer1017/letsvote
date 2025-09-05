import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { useState } from 'react'

export function WalletConnector() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  const [copied, setCopied] = useState(false)

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const chainName = {
    31337: 'Hardhat',
    11155111: 'Sepolia',
  }[chainId] || `Chain ${chainId}`

  return (
    <div className="p-4 border rounded-2xl shadow-sm flex items-center gap-4">
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700
          cursor-pointer"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono">{shortAddress}</span>
            <button
              onClick={handleCopy}
              className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <span className="text-sm text-gray-600">Network: {chainName}</span>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
