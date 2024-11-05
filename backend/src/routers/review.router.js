import express from 'express';
import { ReviewModel } from '../models/review.model.js';
import { analyzeSentiment } from '../services/sentimentService.js';

const router = express.Router();

// Add a new review
router.post('/foods/:foodId', async (req, res) => {
  const { foodId, userName, comment, rating } = req.body;

  try {
    // Create the new review
    const newReview = new ReviewModel({ foodId, userName, comment, rating });
    await newReview.save();

    // Analyze sentiment and update the review with the sentiment score
    await analyzeSentiment(newReview._id, comment);

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error });
  }
});

// Get all reviews (to match the dashboard service)
router.get('/foods', async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

// Get reviews by food ID
router.get('/foods/:foodId', async (req, res) => {
  const { foodId } = req.params;

  try {
    const reviews = await ReviewModel.find({ foodId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

// Get reviews by food ID
router.get('/foods/:userName', async (req, res) => {
  const { userName } = req.params;

  try {
    const reviews = await ReviewModel.find({ userName });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

export default router;
