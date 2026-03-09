import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AIService } from './ai.service';

/**
 * Controller to handle text summarization requests using Google Gemini.
 * Replaces the previous OpenAI implementation while maintaining the same API interface.
 */
const summarizeText = catchAsync(async (req: Request, res: Response) => {
  const { text } = req.body;

  // 1. Validate that "text" is not empty
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Text is required and cannot be empty',
    });
  }

  try {
    // 2. Generate summary using the Gemini-powered AI service
    const summary = await AIService.summarizeText(text);

    // 3. Return the response in the existing format (success: true, summary: "...")
    res.status(200).json({
      success: true,
      summary: summary,
    });
  } catch (error: any) {
    // 4. Handle potential API or connection errors
    // Status 500 maintains consistency with the previous error handling
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message, // Include error message for easier debugging
    });
  }
});

export const AIController = {
  summarizeText,
};
