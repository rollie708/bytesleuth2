import { createPublicClient, http, PublicClient } from 'viem'
import { baseMainnet, getChainById } from './lib-chains'

const clients: Map<number, PublicClient> = new Map()

export function getBlockchainClient(chainId: number): PublicClient | null {
  if (clients.has(chainId)) {
    return clients.get(chainId)!
  }

  const chain = getChainById(chainId)
  if (!chain) {
    return null
  }

  const client = createPublicClient({
    chain: {
      id: chain.id,
      name: chain.name,
      network: chain.network,
      nativeCurrency: chain.nativeCurrency,
      rpcUrls: chain.rpcUrls,
    },
    transport: http(chain.rpcUrls.default.http[0]),
  })

  clients.set(chainId, client)
  return client
}

export async function validateContract(
  chainId: number,
  address: string
): Promise<{ valid: boolean; bytecode?: string; error?: string }> {
  try {
    const client = getBlockchainClient(chainId)
    if (!client) {
      return { valid: false, error: 'Unsupported chain' }
    }

    const bytecode = await client.getBytecode({
      address: address as `0x${string}`,
    })

    if (!bytecode || bytecode === '0x') {
      return { valid: false, error: 'No contract code at address' }
    }

    return { valid: true, bytecode }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    }
  }
}
