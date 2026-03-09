import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../../config';

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

/**
 * MODELS CAROUSEL
 * We list multiple models because each has its own quota pool on the Free Tier.
 * If one is exhausted, we switch to the next immediately to get a faster response.
 */
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-001'
];

/**
 * Extracts retry delay from Gemini error message.
 */
const getRetryDelay = (errorMessage: string): number | null => {
  const match = errorMessage.match(/retry in ([\d.]+)s/i) || errorMessage.match(/"retryDelay":\s*"(\d+)s"/i);
  return match ? (parseFloat(match[1]) + 1) * 1000 : null;
};

/**
 * Smart retry logic:
 * 1. Try a model.
 * 2. If it fails with 429, try the NEXT model in the list immediately (no wait).
 * 3. After cycling through all models, if still failing, wait for the suggested delay and repeat.
 */
const withRetry = async <T>(
  fn: (modelName: string) => Promise<T>,
  modelIndex = 0,
  totalAttempts = 6
): Promise<T> => {
  const currentModel = MODELS[modelIndex % MODELS.length];
  
  try {
    return await fn(currentModel);
  } catch (error: any) {
    const isRateLimit = error.message?.includes('429') || error.status === 429;
    const isNotFound = error.message?.includes('404') || error.status === 404;

    if (totalAttempts <= 1) throw error;

    // IF RATE LIMITED:
    if (isRateLimit) {
      // 1. Try the next model in the carousel IMMEDIATELY
      if (modelIndex < MODELS.length - 1) {
        console.log(`Rate limit on ${currentModel}. Switching to next model...`);
        return withRetry(fn, modelIndex + 1, totalAttempts - 1);
      } 
      
      // 2. If we've exhausted all models for this cycle, WAIT then try again
      const waitTime = getRetryDelay(error.message) || 10000; // Default 10s
      console.log(`All models rate limited. Waiting ${waitTime / 1000}s before new cycle...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      
      return withRetry(fn, 0, totalAttempts - 1); // Start from first model again
    }

    // IF MODEL NOT FOUND (404): Skip it permanently in this request
    if (isNotFound && modelIndex < MODELS.length - 1) {
      return withRetry(fn, modelIndex + 1, totalAttempts);
    }

    throw error;
  }
};

/**
 * Summarize text using Google Gemini with an intelligent "Model Carousel" strategy
 * to bypass Free Tier rate limits.
 */
const summarizeText = async (text: string): Promise<string> => {
  // Truncate to a very safe limit to prevent TPM (Tokens Per Minute) issues
  const optimizedText = text.length > 5000 ? text.substring(0, 5000) + "..." : text;

  try {
    const prompt = `Summarize the following text in 3–4 concise sentences:\n\n${optimizedText}`;

    return await withRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const resultText = response.text();
      return resultText || 'Failed to generate summary';
    });
  } catch (error: any) {
    console.error('Final AI Service Error after retries:', error.message);
    throw error;
  }
};

export const AIService = {
  summarizeText,
};
