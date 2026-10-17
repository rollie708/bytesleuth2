export interface ChainConfig {
  id: number
  name: string
  network: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: {
    default: { http: string[] }
    public: { http: string[] }
  }
  blockExplorers?: {
    default: { name: string; url: string }
  }
}

export const baseMainnet: ChainConfig = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.BASE_RPC_URL || 'https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
}

export const supportedChains: ChainConfig[] = [baseMainnet]

export function getChainById(chainId: number): ChainConfig | undefined {
  return supportedChains.find(chain => chain.id === chainId)
}

export function isSupportedChain(chainId: number): boolean {
  return supportedChains.some(chain => chain.id === chainId)
}
