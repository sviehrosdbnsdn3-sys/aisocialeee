import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedTextContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textGenSchema = {
  type: Type.OBJECT,
  properties: {
    headline1: {
      type: Type.STRING,
      description: 'A very catchy, short headline for a social media news post, max 10 words.',
    },
    headline2: {
      type: Type.STRING,
      description: 'An alternative catchy headline, different in tone or angle from the first one, max 12 words.',
    },
    about: {
      type: Type.STRING,
      description: 'A concise summary of the content, about 2-3 sentences long, suitable for a social media post body.',
    },
    imagePrompt: {
      type: Type.STRING,
      description: 'A detailed, safe-for-work prompt for an AI image generator to create a compelling, photorealistic, high-resolution (1024x1024) visual for the news. It must follow specific rules: if the content mentions a person, describe a generic, non-identifiable individual in that context. If it mentions a country, describe its scenery or culture. Otherwise, represent the overall theme. The prompt must incorporate the requested image style.',
    },
  },
  required: ['headline1', 'headline2', 'about', 'imagePrompt'],
};

export const generateTextAndImagePrompt = async (content: string, tone: string, audience: string, imageStyle: string): Promise<GeneratedTextContent> => {
  let audienceInstruction = "a general audience";
  if (audience.trim()) {
      audienceInstruction = `an audience of ${audience.trim()}`;
  }
  
  const prompt = `Your task is to act as a social media manager. Based on the following news content, generate two distinct headlines, a short "about" summary, and a descriptive prompt for an image generator.

**Content Analysis Rules for Image Prompt:**
1.  **Detect Person's Name:** If the content mentions a specific person's name, the image prompt must describe a generic, non-identifiable person representing their role or context. DO NOT attempt to depict the actual person. For example, for a story about a specific tech CEO, describe "a confident tech executive presenting on a futuristic stage," not the specific person.
2.  **Detect Country Name:** If a country is mentioned, the image prompt should describe a photorealistic landscape, iconic scenery, or cultural element of that country.
3.  **General Theme:** If neither a person nor a country is detected, the image prompt should visually represent the main theme of the content.

**Output Style Rules:**
- **Tone:** The output must have a **${tone}** tone.
- **Target Audience:** The language and style must be tailored for **${audienceInstruction}**.
- **Image Style:** The image prompt's description must result in a **photorealistic** image, further enhanced by the user's selected style: **${imageStyle}**. The final image should be high-resolution (1024x1024 or higher).

**News Content:**
"${content}"

Generate the output according to the required JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: textGenSchema,
    },
  });

  try {
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed as GeneratedTextContent;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};

export const rewriteHeadline = async (originalContent: string, existingHeadlines: string[]): Promise<string> => {
    const prompt = `Based on the following news content, generate one new, catchy headline for a social media post.
It must be different from the provided existing headlines.

**News Content:**
"${originalContent}"

**Existing Headlines to Avoid:**
- ${existingHeadlines.join('\n- ')}

Provide only the new headline text, with no extra formatting or quotation marks.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
};

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  });
  
  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("Image generation failed, no images were returned.");
  }

  return response.generatedImages[0].image.imageBytes;
};