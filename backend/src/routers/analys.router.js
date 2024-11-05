import express from 'express';
import { OrderModel } from '../models/order.model.js';
import { ReviewModel } from '../models/review.model.js';

const router = express.Router();

router.get('/reviews', async (req, res) => {
  try {  
    const reviews = await ReviewModel.find().populate('foodId');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});


router.get('/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find().populate('items.food');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

export default router;