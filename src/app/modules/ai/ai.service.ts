import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../../config';

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Summarize the provided text using Google's gemini-1.5-flash model.
 * The summary should be 3-4 concise sentences.
 */
const summarizeText = async (text: string): Promise<string> => {
  try {
    const prompt = `Summarize the following text in 3–4 concise sentences:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary || 'Failed to generate summary';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const AIService = {
  summarizeText,
};
