import express from 'express';
import { AIController } from './ai.controller';

const router = express.Router();

/**
 * Route: POST /api/ai/summarize
 * Description: Summarizes a paragraph of text using AI.
 */
router.post('/summarize', AIController.summarizeText);

export const AIRoutes = router;
