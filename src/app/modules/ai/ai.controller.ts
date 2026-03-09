import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AIService } from './ai.service';

/**
 * Controller to handle text summarization requests.
 */
const summarizeText = catchAsync(async (req: Request, res: Response) => {
  const { text } = req.body;

  // Validate that "text" is not empty
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Text is required and cannot be empty',
    });
  }

  try {
    // Generate summary using the AI service
    const summary = await AIService.summarizeText(text);

    // Return the response in the requested format
    res.status(200).json({
      success: true,
      summary: summary,
    });
  } catch (error: any) {
    // Handle potential OpenAI or other errors
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message
    });
  }
});

export const AIController = {
  summarizeText,
};
