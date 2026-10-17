'use client'

import { useState } from 'react'
import { Input } from './components-input'
import { Button } from './components-button'
import { { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatAddress } from '@/lib/validation'
import { getChainById } from '@/lib/chains'

export function HeroSection() {
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState(8453)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validated, setValidated] = useState(false)
  const router = useRouter()
  const chain = getChainById(chainId)

  const handleValidate = async () => {
    if (!address || !formatAddress(address).includes('...')) {
      setError('Please enter a valid Ethereum address')
      return
    }
    setValidating(true)
    setError(null)
    setValidated(false)

    try {
      const response = await fetch('/api/v1/contracts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chainId }),
      })

      const result = await response.json()
      
      if (result.success && result.data?.bytecode) {
        setValidated(true)
        // Store address for analysis
        localStorage.setItem('bytesleuth_address', address)
      } else {
        setError(result.error || 'Validation failed')
      }
    } catch (err) {
      setError('Failed to validate contract')
    } finally {
      setValidating(false)
    }
  }

  const handleAnalyze = () => {
    if (validated) {
      router.push(`/analyze?address=${encodeURIComponent(address)}&chainId=${chainId}`)
    }
  }

  return (
    <section className="bg-black/50 rounded-2xl p-6 md:p-8 mb-8 border border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Smart Contract Analysis
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Enter a contract address to analyze its bytecode, detect proxy patterns, 
              and examine permission mechanisms on Base mainnet.
            </p>
            
            {error && (
              <div className="bg-red-500/10 border-red-500/20 rounded-md p-4 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleValidate()
              }}
            >
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Contract address (e.g., 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={validating}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <select
                    value={chainId}
                    onChange={(e) => setChainId(Number(e.target.value))}
                    className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={8453}>Base Mainnet</option>
                    <option value={1}>Ethereum</option>
                  </select>
                </div>
                <Button type="submit" disabled={validating} className="flex-1">
                  {validating ? 'Analyzing...' : 'Validate & Analyze'}
                </Button>
              </div>
            </form>

            {validated && (
              <div className="mt-6 p-4 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Address validated: <span className="font-mono-hash">{formatAddress(address)}</span>
                </p>
                <Button onClick={handleAnalyze} variant="primary">
                  Start Analysis
                </Button>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <div className="p-4 bg-primary/5 rounded-md text-center">
              <svg className="h-6 w-6 text-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16l-4-4 4-4m0 0l4 4-4 4m0-8l4 4-4 4" />
              </svg>
              <p className="text-sm font-medium">Full analysis available on desktop</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <a href="/docs" className="text-primary hover:text-primary/90">Documentation</a> |
            <a href="https://basescan.org/address/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/90">Test with USDC on Base</a>
          </p>
        </div>
      </div>
    </section>
  )
}