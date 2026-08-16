import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Basic protection against unauthorized requests
    const appCheckToken = req.headers.get('X-Firebase-AppCheck');
    // In a full implementation, we would verify this token with Firebase Admin SDK
    // Example: await admin.appCheck().verifyToken(appCheckToken);
    
    // For this prototype, we'll just check if it was provided
    if (!appCheckToken && process.env.NODE_ENV === 'production') {
      console.warn("Missing Firebase App Check token");
      // Could return 401 here depending on strictness
    }

    const { prompt, systemInstruction, model } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { text: 'Note: GEMINI_API_KEY is not configured yet in .env.example.' },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: model || 'gemini-3.1-flash-lite',
      contents: prompt,
      config: systemInstruction ? { systemInstruction, thinkingConfig: { thinkingBudget: 1024 } } : undefined,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Error generating Gemini content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
