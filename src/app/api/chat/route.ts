import { GoogleGenerativeAI } from '@google/generative-ai';
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

const generateGeminiChatResponse = async (
  messages: ChatMessage[],
  ageGroup: AgeGroup
) => {
  if (!genAI) return null;

  const systemPrompt = `
      You are StressLess AI, a calm, empathetic, and emotionally intelligent mental wellness assistant.
      Your tone should be: ${ageGroup === 'Senior' ? 'very clear, gentle, and respectful' : ageGroup === 'Teen' ? 'engaging, casual, and relatable' : 'professional yet warm and balanced'}.
      
      CORE GUIDELINES:
      - Be non-judgmental and supportive.
      - Provide science-backed wellness tips (breathing, mindfulness, cognitive framing).
      - If user intensity is high (mentioning self-harm, extreme distress), provide safety resources and a disclaimer that you are not a medical professional.
      - Keep responses concise (2-3 suggestions max).
      - DO NOT provide medical advice or diagnoses.
      
      CONTEXT:
      - The user is using the StressLess app to manage their daily stress.
    `;

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1]?.content ?? '';
  let lastError: unknown = null;

  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          {
            role: 'model',
            parts: [
              {
                text: 'Understood. I am StressLess AI, your empathetic wellness assistant. How can I support you today?',
              },
            ],
          },
          ...history,
        ],
      });
      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
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

    const text = await generateGeminiChatResponse(messages, ageGroup);

    return NextResponse.json({ 
      content: text || fallbackReply(lastMessage)
    });
  } catch (error: unknown) {
    console.error('Gemini Chat API Error:', error);
    return NextResponse.json({ content: fallbackReply(lastMessageForFallback) });
  }
}
