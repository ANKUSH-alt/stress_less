import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { detectCrisis } from '@/services/stressDetection';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AgeGroup = 'Teen' | 'Adult' | 'Senior';

type ChatPayload = {
  messages?: ChatMessage[];
  ageGroup?: string;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const crisisResponse =
  "It sounds like you're going through something really intense. You deserve immediate human support. If you might hurt yourself or are in danger, call your local emergency number right now. If you're in the U.S., call or text 988 for the Suicide & Crisis Lifeline.";

const fallbackReply = (message: string) => {
  if (detectCrisis(message)) {
    return crisisResponse;
  }

  return [
    'I hear you. Let’s take this one step at a time.',
    'Try this quick reset: inhale for 4, hold for 4, exhale for 6, for one minute.',
    'If helpful, tell me what feels hardest right now and we can break it down.',
  ].join(' ');
};

const isValidMessage = (value: unknown): value is ChatMessage => {
  if (typeof value !== 'object' || !value) return false;
  const maybe = value as { role?: unknown; content?: unknown };
  return (
    (maybe.role === 'user' || maybe.role === 'assistant') &&
    typeof maybe.content === 'string' &&
    maybe.content.trim().length > 0
  );
};

const parseAgeGroup = (value: string | undefined): AgeGroup => {
  if (value === 'Teen' || value === 'Adult' || value === 'Senior') return value;
  return 'Adult';
};

const generateGroqChatResponse = async (
  messages: ChatMessage[],
  ageGroup: AgeGroup
) => {
  const systemPrompt = `
      You are StressLess AI, a calm, empathetic, and emotionally intelligent mental wellness assistant.
      Your tone should be: ${ageGroup === 'Senior' ? 'very clear, gentle, and respectful' : ageGroup === 'Teen' ? 'engaging, casual, and relatable' : 'professional yet warm and balanced'}.
      
      CORE GUIDELINES:
      - Be non-judgmental and supportive.
      - Provide science-backed wellness tips (breathing, mindfulness, cognitive framing).
      - If user intensity is high (mentioning self-harm, extreme distress), provide safety resources and a disclaimer that you are not a medical professional.
      - Keep responses concise (2-3 suggestions max).
      - Format your response using rich Markdown so it's easy to read. Use bolding for emphasis and bullet points for actionable steps.
      - DO NOT provide medical advice or diagnoses.
      
      CONTEXT:
      - The user is using the StressLess app to manage their daily stress.
    `;

  const history: { role: 'user' | 'assistant'; content: string }[] = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const lastMessage = messages[messages.length - 1]?.content ?? '';

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'assistant',
          content: 'Understood. I am StressLess AI, your empathetic wellness assistant. How can I support you today?',
        },
        ...history,
        { role: 'user', content: lastMessage },
      ],
      model: GROQ_MODEL,
    });
    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    throw error;
  }
};

export async function POST(req: Request) {
  let lastMessageForFallback = '';
  try {
    const body = (await req.json()) as ChatPayload;
    const messages = body.messages?.filter(isValidMessage) ?? [];
    const ageGroup = parseAgeGroup(body.ageGroup);

    if (!messages.length) {
      return NextResponse.json(
        { error: 'At least one message is required.' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content ?? '';
    lastMessageForFallback = lastMessage;

    const text = await generateGroqChatResponse(messages, ageGroup);

    return NextResponse.json({ 
      content: text || fallbackReply(lastMessage)
    });
  } catch (error: unknown) {
    console.error('Groq Chat API Error:', error);
    return NextResponse.json({ content: fallbackReply(lastMessageForFallback) });
  }
}
