import { NextResponse } from 'next/server'
import { validateContract } from '@/lib/blockchain'
import { contractValidationSchema } from '@/lib/validation'

export async function POST(
  request: Request,
  { params }: { params: { chainId?: string } }
) {
  try {
    const body = await request.json()
    const result = contractValidationSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', errors: result.error.format() },
        { status: 400 }
      )
    }

    const { address, chainId: inputChainId } = result.data
    const chainId = Number(inputChainId)

    const validation = await validateContract(chainId, address)

    return NextResponse.json({
      success: validation.valid,
      data: validation.valid ? { bytecode: validation.bytecode } : null,
      error: validation.error,
    })
  } catch (error) {
    console.error('Contract validation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to validate contract' },
      { status: 500 }
    )
  }
}