import { z } from 'zod'

export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

export const transactionHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')

export const chainIdSchema = z.number().int().positive()

export const contractValidationSchema = z.object({
  address: ethereumAddressSchema,
  chainId: chainIdSchema,
})

export function formatAddress(address: string, length: number = 6): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, length)}...${address.slice(-4)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}
