import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Clean base64 string by removing data URL prefix if present
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateMarketingImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  // Using gemini-2.5-flash-image (Nano Banana)
  const model = 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: `${prompt} Maintain strict visual consistency with the provided object. The product should look exactly like the source image but seamlessly integrated into the new environment.`
          },
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or generic image type handling
              data: cleanBase64(imageBase64)
            }
          }
        ]
      }
      // Note: gemini-2.5-flash-image doesn't support responseMimeType or extensive config yet per instructions
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const editGeneratedImage = async (
  imageBase64: string,
  editInstruction: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: `Edit the following image: ${editInstruction}. Return the modified image.`
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64(imageBase64)
            }
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};
