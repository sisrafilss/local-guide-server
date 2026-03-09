import OpenAI from 'openai';
import config from '../../../config';

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: config.openai_api_key,
  timeout: 60 * 1000, // 60 seconds timeout
  maxRetries: 3,      // Automatically retry on connection errors
});

/**
 * Summarize the provided text using OpenAI's gpt-4o-mini model.
 * The summary should be 3-4 concise sentences.
 */
const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text. Summarize the following text in 3–4 concise sentences.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    return response.choices[0]?.message?.content || 'Failed to generate summary';
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    throw error; // Let the controller catch it with the full error info
  }
};

export const AIService = {
  summarizeText,
};
