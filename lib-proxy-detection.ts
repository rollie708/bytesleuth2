import { PublicClient } from 'viem'

export interface ProxyDetectionResult {
  isProxy: boolean
  proxyType?: 'EIP-1967' | 'EIP-1822' | 'EIP-1167' | 'beacon' | 'custom'
  implementation?: string
  admin?: string
  beacon?: string
  confidence: 'high' | 'medium' | 'low'
}

// EIP-1967 storage slots
const EIP1967_IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
const EIP1967_ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'
const EIP1967_BEACON_SLOT = '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50'

// EIP-1822 (UUPS) storage slot
const EIP1822_LOGIC_SLOT = '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7'

export async function detectProxy(
  client: PublicClient,
  address: `0x${string}`
): Promise<ProxyDetectionResult> {
  // Check EIP-1967
  const eip1967Result = await checkEIP1967(client, address)
  if (eip1967Result.isProxy) return eip1967Result

  // Check EIP-1822
  const eip1822Result = await checkEIP1822(client, address)
  if (eip1822Result.isProxy) return eip1822Result

  // Check EIP-1167 (minimal proxy)
  const eip1167Result = await checkEIP1167(client, address)
  if (eip1167Result.isProxy) return eip1167Result

  // Check beacon proxy
  const beaconResult = await checkBeaconProxy(client, address)
  if (beaconResult.isProxy) return beaconResult

  return { isProxy: false, confidence: 'high' }
}

async function checkEIP1967(
  client: PublicClient,
  address: `0x${string}`
): Promise<ProxyDetectionResult> {
  try {
    const implementation = await client.getStorageAt({
      address,
      slot: EIP1967_IMPLEMENTATION_SLOT as `0x${string}`,
    })

    if (implementation && implementation !== '0x' + '0'.repeat(64)) {
      const implAddress = '0x' + implementation.slice(-40)

      const admin = await client.getStorageAt({
        address,
        slot: EIP1967_ADMIN_SLOT as `0x${string}`,
      })

      const adminAddress = admin && admin !== '0x' + '0'.repeat(64)
        ? '0x' + admin.slice(-40)
        : undefined

      return {
        isProxy: true,
        proxyType: 'EIP-1967',
        implementation: implAddress,
        admin: adminAddress,
        confidence: 'high',
      }
    }
  } catch (error) {
    console.error('EIP-1967 check error:', error)
  }

  return { isProxy: false, confidence: 'high' }
}

async function checkEIP1822(
  client: PublicClient,
  address: `0x${string}`
): Promise<ProxyDetectionResult> {
  try {
    const logic = await client.getStorageAt({
      address,
      slot: EIP1822_LOGIC_SLOT as `0x${string}`,
    })

    if (logic && logic !== '0x' + '0'.repeat(64)) {
      const implAddress = '0x' + logic.slice(-40)

      return {
        isProxy: true,
        proxyType: 'EIP-1822',
        implementation: implAddress,
        confidence: 'high',
      }
    }
  } catch (error) {
    console.error('EIP-1822 check error:', error)
  }

  return { isProxy: false, confidence: 'high' }
}

async function checkEIP1167(
  client: PublicClient,
  address: `0x${string}`
): Promise<ProxyDetectionResult> {
  try {
    const bytecode = await client.getBytecode({ address })

    if (bytecode && bytecode.length >= 44) {
      // EIP-1167 pattern: 363d3d373d3d3d363d73 [20 bytes address] 5af43d82803e903d91602b57fd5bf3
      if (bytecode.startsWith('0x363d3d373d3d3d363d73')) {
        const implAddress = '0x' + bytecode.slice(22, 62)

        return {
          isProxy: true,
          proxyType: 'EIP-1167',
          implementation: implAddress,
          confidence: 'high',
        }
      }
    }
  } catch (error) {
    console.error('EIP-1167 check error:', error)
  }

  return { isProxy: false, confidence: 'high' }
}

async function checkBeaconProxy(
  client: PublicClient,
  address: `0x${string}`
): Promise<ProxyDetectionResult> {
  try {
    const beacon = await client.getStorageAt({
      address,
      slot: EIP1967_BEACON_SLOT as `0x${string}`,
    })

    if (beacon && beacon !== '0x' + '0'.repeat(64)) {
      const beaconAddress = '0x' + beacon.slice(-40)

      // Try to get implementation from beacon
      try {
        const implementation = await client.readContract({
          address: beaconAddress as `0x${string}`,
          abi: [
            {
              name: 'implementation',
              type: 'function',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ type: 'address' }],
            },
          ],
          functionName: 'implementation',
        })

        return {
          isProxy: true,
          proxyType: 'beacon',
          beacon: beaconAddress,
          implementation: implementation as string,
          confidence: 'high',
        }
      } catch {
        return {
          isProxy: true,
          proxyType: 'beacon',
          beacon: beaconAddress,
          confidence: 'medium',
        }
      }
    }
  } catch (error) {
    console.error('Beacon proxy check error:', error)
  }

  return { isProxy: false, confidence: 'high' }
}
