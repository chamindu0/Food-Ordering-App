import express from 'express';
import { greetUser, getAvailableFoods, placeOrder, handleChat, loginUser, protectedRoute } from '../controllers/chatbot.controller.js';
import  verifyToken  from '../middleware/auth.mid.js';

const router = express.Router();

// Route to handle login
router.post('/login', loginUser);

// Protected route example (requires token verification)
router.get('/protected', verifyToken, protectedRoute);

// Other chatbot routes
router.post('/greet', greetUser);
router.get('/availablefoods', getAvailableFoods);
router.post('/placeorder', placeOrder);
router.post('/user', handleChat);

export default router;
