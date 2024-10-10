import express from 'express';
import { getFoodRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

// Route to get recommendations for a specific food item
router.get('/:id/recommendations', getFoodRecommendations);

export default router;
