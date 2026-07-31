import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatRequestBody {
  message: string;
  systemPrompt?: string;
  eventId?: string;
}

const FRIENDLY_PERSONA_PROMPT = `You are the official CEV Campus AI Assistant — a helpful, energetic, and concise campus peer.
Provide direct, clear, and friendly answers (2 to 4 sentences max) using the event details below.
Do not output robotic or corporate preamble. If asked about something not covered in the event details, politely redirect the user back to the event session.`;

async function callGemini(message: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using ultra-fast gemini-1.5-flash model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 250,
      temperature: 0.7,
    },
  });

  const prompt = `${FRIENDLY_PERSONA_PROMPT}\n\nEvent Details:\n${systemPrompt}\n\nUser Question:\n${message}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function callGrok(message: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error('GROK_API_KEY is not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: `${FRIENDLY_PERSONA_PROMPT}\n${systemPrompt}` },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!res.ok) throw new Error(`Grok API error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response from Grok';
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callOpenRouter(message: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://whatsatcev.shibili.tech',
        'X-Title': 'Whats @CEV Event Manager',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: `${FRIENDLY_PERSONA_PROMPT}\n${systemPrompt}` },
          { role: 'user', content: message }
        ],
        max_tokens: 250,
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response from OpenRouter';
  } finally {
    clearTimeout(timeoutId);
  }
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

    // Fast-path provider execution with fallback
    try {
      reply = await callGemini(message, systemPrompt);
      providerUsed = 'gemini-1.5-flash';
    } catch {
      try {
        reply = await callGrok(message, systemPrompt);
        providerUsed = 'grok';
      } catch {
        try {
          reply = await callOpenRouter(message, systemPrompt);
          providerUsed = 'openrouter';
        } catch {
          reply = `Here is what I know about this session:\n\n${systemPrompt.slice(0, 250)}...\n\nFeel free to ask me about venue, timing, or registration details!`;
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