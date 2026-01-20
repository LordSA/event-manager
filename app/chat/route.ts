import { GoogleGenerativeAI } from "@google/generative-ai";
import { events } from "@/app/lib/data";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, eventId } = await req.json();
    const event = events.find((e) => e.id === eventId);
    if (!event) return NextResponse.json({ reply: "Event not found." });
    const systemPrompt = `
      You are the official AI Support for "${event.title}".
      Use ONLY this info to answer:
      """${event.ai_context}"""
      If the answer isn't there, say "I don't know."
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([systemPrompt, message]);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    return NextResponse.json({ reply: "Error connecting to AI." });
  }
}