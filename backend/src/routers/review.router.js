// routes/review.routes.js
import express from 'express';
import { ReviewModel } from '../models/review.model.js';

const router = express.Router();

// Add a new review
router.post('/foods', async (req, res) => {
  const { foodId, userId, comment, rating } = req.body;

  try {
    const newReview = new ReviewModel({ foodId, userId, comment, rating });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
});

// Get reviews by food ID
router.get('/foods/:foodId', async (req, res) => {
  const { foodId } = req.params;

  try {
    const reviews = await ReviewModel.find({ foodId }).populate('userId', 'name'); // Populate user name if needed
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

export default router;
