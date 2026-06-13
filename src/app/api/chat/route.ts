import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       console.warn("GEMINI_API_KEY is not set. Using mock response.");
       return NextResponse.json({
         text: "This is a mock response (GEMINI_API_KEY is missing). I am Achelon, your G.T.M.C.E assistant."
       });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format history for Gemini SDK
    // The google genai SDK expects contents array with role and parts
    const contents = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are Achelon, the official AI assistant for Gawthorpe Ting Music, Content & Entertainment (G.T.M.C.E). Your CEO is Jonathan Lokondo Djamba. You help users with navigating the music catalog, booking studio services, understanding royalty agreements, and merchandise. Keep responses concise, professional, yet energetic, occasionally using the catchphrase 'It's a Gawthorpe Ting!'. Do not use emojis."
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ text: "I'm having trouble connecting to my creative core right now." }, { status: 500 });
  }
}
