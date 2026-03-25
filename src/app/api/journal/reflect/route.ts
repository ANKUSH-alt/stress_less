import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

type ReflectPayload = {
  content?: string;
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const GEMINI_MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite-001',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
] as const;

const buildFallbackReflection = (content: string) => {
  const words = content.trim().split(/\s+/);
  const preview = words.slice(0, 14).join(' ');
  return `You captured something important today: "${preview}${words.length > 14 ? '...' : ''}". A helpful next step is naming one feeling and one small action you can take in the next hour.`;
};

const generateGeminiReflection = async (content: string) => {
  if (!genAI) return null;

  const prompt = `
      You are a wise, empathetic journaling assistant for the StressLess app.
      Analyze the following journal entry and provide a brief, supportive reflection (2-3 sentences).
      Focus on identifying emotional themes and providing a gentle, constructive insight to help the user manage stress.
      
      Journal Entry: "${content}"
      
      Reflection:
    `;

  let lastError: unknown = null;
  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export async function POST(req: Request) {
  let rawContent = '';
  try {
    const body = (await req.json()) as ReflectPayload;
    const content = body.content?.trim() ?? '';
    rawContent = content;
    if (!content) {
      return NextResponse.json(
        { error: 'Journal content is required.' },
        { status: 400 }
      );
    }

    const text = await generateGeminiReflection(content);

    return NextResponse.json({ reflection: text || buildFallbackReflection(content) });
  } catch (error: unknown) {
    console.error('Gemini Journal API Error:', error);
    return NextResponse.json({ reflection: buildFallbackReflection(rawContent) });
  }
}
