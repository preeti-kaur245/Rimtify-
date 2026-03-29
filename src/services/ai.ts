import { GoogleGenAI } from "@google/genai";
import Anthropic from '@anthropic-ai/sdk';

export async function getAIResponse(
  prompt: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  anthropicKey?: string
) {
  // If Anthropic key is provided, use Claude
  if (anthropicKey) {
    try {
      const anthropic = new Anthropic({
        apiKey: anthropicKey,
        dangerouslyAllowBrowser: true // Required for client-side use
      });

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
          { role: "user", content: prompt }
        ],
      });

      // Anthropic response structure is different
      const text = response.content.find(c => c.type === 'text');
      return text && 'text' in text ? text.text : "No response from Claude.";
    } catch (error) {
      console.error("Anthropic Error:", error);
      return `Error calling Anthropic: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  // Fallback to Gemini (default)
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.content }] 
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are an academic assistant for 'rimtify', a university teacher portal. Help teachers with lesson planning, grading rubrics, and research. Be professional and concise."
      }
    });

    const response = await model;
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
}

export async function getSuggestContent(content: string, anthropicKey?: string) {
  const prompt = `Based on the following academic notes, suggest the next paragraph or section to continue the writing. Keep the tone consistent and academic.\n\nNotes:\n${content}`;
  return getAIResponse(prompt, [], anthropicKey);
}
