import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()
    const { contractAddress, chainId } = body

    if (!contractAddress || !chainId) {
      return NextResponse.json(
        { success: false, message: 'contractAddress and chainId are required' },
        { status: 400 }
      )
    }

    // Check if job already exists for this address/chain
    const existingJob = await db.analysisJob.findFirst({
      where: {
        contractAddress,
        chainId,
      },
    })

    if (existingJob) {
      return NextResponse.json({
        success: true,
        data: { id: existingJob.id, status: existingJob.status },
      })
    }

    // Create new analysis job
    const job = await db.analysisJob.create({
      data: {
        contractAddress,
        chainId,
        status: 'PENDING',
        progressStage: 'INITIALIZING',
      },
    })

    return NextResponse.json({
      success: true,
      data: { id: job.id, status: job.status },
    })
  } catch (error) {
    console.error('Create analysis error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create analysis job' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const jobs = await db.analysisJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        snapshot: true,
        findings: { take: 5 },
      },
    })

    return NextResponse.json({
      success: true,
      data: jobs.map(job => ({
        id: job.id,
        contractAddress: job.contractAddress,
        chainId: job.chainId,
        status: job.status,
        progressStage: job.progressStage,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        findingsCount: job.findings.length,
      })),
    })
  } catch (error) {
    console.error('Get analyses error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get analyses' },
      { status: 500 }
    )
  }
}