import { GoogleGenerativeAI } from "@google/generative-ai";
import { events } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, eventId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "Server Error: API Key missing." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const event = events.find((e) => e.id === eventId);
    
    if (!event) return NextResponse.json({ reply: "Event not found." });

    // --- UPDATED SMART PROMPT ---
    const systemPrompt = `
      You are the friendly AI Host for the event "${event.title}".

      Here is the OFFICIAL Event Data:
      """${event.ai_context}"""

      YOUR INSTRUCTIONS:
      1. **Event Questions:** If the user asks about the event (time, parking, food, rules, etc.), answer STRICTLY based on the Event Data above. Do not make up event details. If the info is missing, say "I don't have that info yet."
      
      2. **Normal Conversation:** If the user asks "normal things" (greetings, "how are you", "tell me a joke", or general tech questions), forget the strictness! Be conversational, witty, and helpful. You can use emojis and have a personality.

      3. **Tone:** Always be polite, helpful, and enthusiastic.
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent(message);
    const response = await result.response.text();

    return NextResponse.json({ reply: response });

  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ reply: "Sorry, I am having trouble connecting." });
  }
}