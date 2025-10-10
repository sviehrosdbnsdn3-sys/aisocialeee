import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedTextContent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textGenSchema = {
  type: Type.OBJECT,
  properties: {
    headline1: {
      type: Type.STRING,
      description: 'A very catchy, short headline for a social media news post, max 10 words, in the same language as the source content.',
    },
    headline2: {
      type: Type.STRING,
      description: 'An alternative catchy headline, different in tone or angle from the first one, max 12 words, in the same language as the source content.',
    },
    about: {
      type: Type.STRING,
      description: 'A concise summary of the content, about 2-3 sentences long, suitable for a social media post body, in the same language as the source content.',
    },
    imagePrompt: {
      type: Type.STRING,
      description: 'A detailed, safe-for-work prompt in English for an AI image generator to create a compelling, photorealistic visual for the news. It must follow specific rules: if the content mentions a person, describe a generic, non-identifiable individual in that context. If it mentions a country, describe its scenery or culture. Otherwise, represent the overall theme. The prompt must incorporate the requested image style.',
    },
    hashtags: {
      type: Type.STRING,
      description: 'A single string containing 5-7 relevant and trending hashtags in English, each starting with # and separated by spaces (e.g., #Tech #News #Innovation).',
    },
  },
  required: ['headline1', 'headline2', 'about', 'imagePrompt', 'hashtags'],
};

export const generateTextAndImagePrompt = async (content: string, tone: string, audience: string, imageStyle: string): Promise<GeneratedTextContent> => {
  let audienceInstruction = "a general audience";
  if (audience.trim()) {
      audienceInstruction = `an audience of ${audience.trim()}`;
  }
  
  const prompt = `Your task is to act as an intelligent, multilingual social media manager for a news organization. Your primary goal is to process input content, identify its language, and generate social media copy in that same language.

**Core Task: Language-Specific Content Generation**
1.  **Language Detection:** First, automatically detect the primary language of the provided "News Content" (e.g., English, Urdu, Sindhi).
2.  **Matched-Language Generation:** Generate \`headline1\`, \`headline2\`, and the \`about\` summary **in the detected language**. Do NOT translate.
3.  **English-Only Generation:** The \`imagePrompt\` and \`hashtags\` MUST be generated in **English**, regardless of the input language, to ensure compatibility with image models and global platforms.

**Language-Specific Rules:**
-   **For Urdu or Sindhi content:**
    -   Use the correct script (e.g., Perso-Arabic script).
    -   Maintain a natural, journalistic writing tone.
    -   Headlines should be concise (10-12 words).
-   **For English content:**
    -   Use Title Case for headlines.
    -   Maintain a professional, journalistic tone.

**Content Analysis Rules for Image Prompt (Must be in English):**
1.  **Detect Person's Name:** If the content mentions a specific person's name, the image prompt must describe a generic, non-identifiable person representing their role or context. DO NOT attempt to depict the actual person. For example, for a story about a specific tech CEO, describe "a confident tech executive presenting on a futuristic stage," not the specific person.
2.  **Detect Country Name:** If a country is mentioned, the image prompt should describe a photorealistic landscape, iconic scenery, or cultural element of that country.
3.  **General Theme:** If neither a person nor a country is detected, the image prompt should visually represent the main theme of the content in an abstract or conceptual way.

**Output Style Rules:**
- **Tone:** The output must have a **${tone}** tone.
- **Target Audience:** The language and style must be tailored for **${audienceInstruction}**.
- **Image Style:** The English \`imagePrompt\`'s description must result in a **photorealistic** image, further enhanced by the user's selected style: **${imageStyle}**.

**News Content:**
"${content}"

Generate the output according to the required JSON schema. Remember: headlines and summary in the source language; image prompt and hashtags in English.`;

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
    const prompt = `You are an intelligent, multilingual headline writer for a news organization.
Your task is to:
1. Detect the language of the "News Content".
2. Generate one new, catchy headline **in that same language**. Do not translate.
3. The new headline must be different from the "Existing Headlines to Avoid".
4. Follow language-specific rules: Use Title Case for English headlines; use appropriate script for other languages like Urdu or Sindhi.

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

export const getContentFromURL = async (url: string): Promise<string> => {
  const prompt = `You are an expert web scraper bot. Your task is to fetch, parse, and extract the main article content from the given URL, simulating a standard web browser.

**URL to process:** ${url}

**Instructions:**
1.  **Simulate Browser:** When fetching, use a common desktop browser User-Agent (like Chrome on Windows) to ensure compatibility.
2.  **Identify Main Content Container:** Analyze the HTML to find the single element that holds the main article body. Look for semantic tags like \`<article>\` or \`<main>\`, or common container IDs/classes such as \`.article-body\`, \`.post-content\`, \`.description\`, or \`.detail-description\`.
3.  **Extract Paragraphs:** Once you've identified the main content container, extract the text **only from the \`<p>\` (paragraph) tags found within it.** This is the most critical step for getting clean article text.
4.  **Format Clean Text:**
    - Join the text from each paragraph with a double newline (\\n\\n) to preserve paragraph breaks.
    - **Crucially, exclude all non-essential elements**: headers, footers, navigation, sidebars, ads, comments, and "related articles" links.
5.  **Error Handling & Validation:**
    - If the URL is invalid, inaccessible (e.g., 404, paywall, connection error), return the single, specific error code: \`FETCH_FAILED_UNACCESSIBLE\`.
    - If the page loads but has no discernible main article (e.g., it's an index page, a gallery, a login page) OR the extracted text is less than 100 characters, return the single, specific error code: \`FETCH_FAILED_NO_ARTICLE\`.

If successful, return only the extracted article text. Do not add any introductory or concluding phrases.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const extractedText = response.text.trim();

    if (extractedText === 'FETCH_FAILED_UNACCESSIBLE') {
      throw new Error("The URL is invalid or the content is inaccessible. Please check the link and ensure it's a public page.");
    }
    if (extractedText === 'FETCH_FAILED_NO_ARTICLE') {
      throw new Error("No main article content could be found at this URL. It might be a homepage, gallery, or requires a login.");
    }
    if (!extractedText) {
        throw new Error("The AI couldn't extract any text from the URL. The page might be empty or formatted in an unusual way.");
    }

    return extractedText;
  } catch (error) {
    console.error("Failed to fetch content from URL:", error);
    // If it's one of our custom errors, re-throw it. Otherwise, throw a generic one.
    if (error instanceof Error && (error.message.includes("inaccessible") || error.message.includes("No main article") || error.message.includes("couldn't extract any text"))) {
        throw error;
    }
    throw new Error("The AI failed to retrieve content from the URL. This could be due to a network issue or website restrictions.");
  }
};