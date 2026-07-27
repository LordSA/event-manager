import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatRequestBody {
  message: string;
  systemPrompt?: string;
  eventId?: string;
}

const FRIENDLY_PERSONA_PROMPT = `You are a super friendly, warm, and knowledgeable campus buddy at CEV. 
Talk like a real friend giving helpful advice — casual, clear, practical, and enthusiastic. 
Don't sound robotic, corporate, or formal. Be direct, cheerful, and super helpful!
Use the following event details to answer:`;

async function callGemini(message: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `${FRIENDLY_PERSONA_PROMPT}\n\nEvent Context:\n${systemPrompt}\n\nUser Question:\n${message}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function callGrok(message: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error('GROK_API_KEY is not configured');

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: `${FRIENDLY_PERSONA_PROMPT}\n${systemPrompt}` },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`Grok API returned status ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response from Grok';
}

async function callOpenRouter(message: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://whatsatcev.shibili.tech',
      'X-Title': 'Whats @CEV Event Manager',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-70b-instruct',
      messages: [
        { role: 'system', content: `${FRIENDLY_PERSONA_PROMPT}\n${systemPrompt}` },
        { role: 'user', content: message }
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API returned status ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response from OpenRouter';
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message, systemPrompt = 'General CEV campus event session' } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    let reply = '';
    let providerUsed = '';

    try {
      reply = await callGemini(message, systemPrompt);
      providerUsed = 'gemini';
    } catch {
      try {
        reply = await callGrok(message, systemPrompt);
        providerUsed = 'grok';
      } catch {
        try {
          reply = await callOpenRouter(message, systemPrompt);
          providerUsed = 'openrouter';
        } catch {
          reply = `Hey there! 👋 Here's what I know about this event:\n\n${systemPrompt.slice(0, 300)}...\n\nFeel free to ask me anything else about venue, timing, or prerequisites!`;
          providerUsed = 'offline-fallback';
        }
      }
    }

    return NextResponse.json({
      reply,
      providerUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}