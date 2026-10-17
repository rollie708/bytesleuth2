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
        { success: false, message: 'Report not found or analysis incomplete' },
        { status: 404 }
      )
    }

    // Parse artifacts
    const disassembly = job.artifacts.find(a => a.artifactType === 'disassembly')
    const functionSignatures = job.artifacts.find(a => a.artifactType === 'function_signatures')
    const aiExplanation = job.artifacts.find(a => a.artifactType === 'ai_explanation')

    return NextResponse.json({
      success: true,
      data: {
        job: {
          id: job.id,
          chainId: job.chainId,
          contractAddress: job.contractAddress,
          blockNumber: job.blockNumber,
          analysisVersion: job.analysisVersion,
          createdAt: job.createdAt,
          completedAt: job.completedAt,
        },
        snapshot: job.snapshot ? {
          address: job.snapshot.address,
          blockNumber: job.snapshot.blockNumber,
          bytecodeHash: job.snapshot.bytecodeHash,
          proxyMetadata: job.snapshot.proxyMetadata,
        } : null,
        disassembly: disassembly ? JSON.parse(disassembly.content) : [],
        functionSignatures: functionSignatures ? JSON.parse(functionSignatures.content) : [],
        findings: job.findings.map(f => ({
          id: f.id,
          category: f.category,
          title: f.title,
          description: f.description,
          severity: f.severity,
          confidence: f.confidence,
          evidenceIds: f.evidenceIds,
          limitations: f.limitations,
        })),
        aiExplanation: aiExplanation ? JSON.parse(aiExplanation.content) : null,
      },
    })
  } catch (error) {
    console.error('Get analysis report error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get analysis report' },
      { status: 500 }
    )
  }
}