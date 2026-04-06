import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

type ReflectPayload = {
  content?: string;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const buildFallbackReflection = (content: string) => {
  const words = content.trim().split(/\s+/);
  const preview = words.slice(0, 14).join(' ');
  return `You captured something important today: "${preview}${words.length > 14 ? '...' : ''}". A helpful next step is naming one feeling and one small action you can take in the next hour.`;
};

const generateGroqReflection = async (content: string) => {
  const prompt = `
      You are a wise, empathetic journaling assistant for the StressLess app.
      Analyze the following journal entry and provide a brief, supportive reflection (2-3 sentences).
      Focus on identifying emotional themes and providing a gentle, constructive insight to help the user manage stress.
      Format your reflection using clean, concise Markdown (e.g., use bolding for emphasis or simple bullet points if suggesting actions) so the user can easily digest it.
      
      Journal Entry: "${content}"
      
      Reflection:
    `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
    });
    return completion.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    throw error;
  }
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

    const text = await generateGroqReflection(content);

    return NextResponse.json({ reflection: text || buildFallbackReflection(content) });
  } catch (error: unknown) {
    console.error('Groq Journal API Error:', error);
    return NextResponse.json({ reflection: buildFallbackReflection(rawContent) });
  }
}
