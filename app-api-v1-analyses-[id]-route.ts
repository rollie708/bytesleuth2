import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const job = await db.analysisJob.findUnique({
      where: { id },
      include: {
        snapshot: true,
        findings: true,
        artifacts: true,
      },
    })

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        chainId: job.chainId,
        contractAddress: job.contractAddress,
        status: job.status,
        progressStage: job.progressStage,
        errorCode: job.errorCode,
        errorMessage: job.errorMessage,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        snapshot: job.snapshot ? {
          bytecodeHash: job.snapshot.bytecodeHash,
          blockNumber: job.snapshot.blockNumber,
          proxyMetadata: job.snapshot.proxyMetadata,
        } : null,
        findingsCount: job.findings.length,
        artifactsCount: job.artifacts.length,
      },
    })
  } catch (error) {
    console.error('Get analysis status error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get analysis status' },
      { status: 500 }
    )
  }
}