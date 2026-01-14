
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AIAnalysisResult {
  foodName: string;
  confidence: number;
  estimatedWeight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reasoning: string;
}

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "The name of the food identified in Arabic" },
    confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 1" },
    estimatedWeight: { type: Type.NUMBER, description: "Estimated weight in grams" },
    calories: { type: Type.NUMBER, description: "Total calories for the estimated portion" },
    protein: { type: Type.NUMBER, description: "Protein in grams" },
    carbs: { type: Type.NUMBER, description: "Carbohydrates in grams" },
    fat: { type: Type.NUMBER, description: "Fat in grams" },
    reasoning: { type: Type.STRING, description: "Brief explanation of the identification" }
  },
  required: ["foodName", "confidence", "estimatedWeight", "calories", "protein", "carbs", "fat", "reasoning"]
};

export async function analyzeFoodImage(base64Image: string): Promise<AIAnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Identify the food in this image, estimate its weight in grams, and calculate its nutritional values. Return the food name in Arabic." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze image. Please check your internet connection and try again.");
  }
}
