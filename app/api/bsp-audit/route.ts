/**
 * Breakthrough OS - NDIS BSP Quality & Safeguards Compliance Audit API Route
 * Endpoint: POST /api/bsp-audit
 */

import { NextRequest, NextResponse } from 'next/server';
import { evaluateBSPDocument } from '../../../lib/bsp-auditor/agent-evaluator';
import { BSPDocument } from '../../../types/bsp-audit';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { bsp, options } = body as {
      bsp?: BSPDocument;
      options?: {
        apiKey?: string;
        streamDeliberations?: boolean;
        auditorEngineVersion?: string;
      };
    };

    if (!bsp || !bsp.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required BSPDocument in request body.'
        },
        { status: 400 }
      );
    }

    const auditPackage = await evaluateBSPDocument(bsp, {
      apiKey: options?.apiKey || process.env.GEMINI_API_KEY,
      streamDeliberations: options?.streamDeliberations ?? false,
      auditorEngineVersion: options?.auditorEngineVersion || 'Breakthrough-NDIS-Auditor-v2.6'
    });

    const executionTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      auditPackage,
      executionTimeMs
    });
  } catch (error: any) {
    console.error('Error executing BSP Quality Audit:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error during BSP evaluation'
      },
      { status: 500 }
    );
  }
}
