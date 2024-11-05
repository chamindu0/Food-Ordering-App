import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import chatRoutes from './routers/chatbot.router.js';
import recommendationRoutes from './routers/recommendations.router.js';
import reviewRoutes from './routers/review.router.js';
import analysRoutes from './routers/analys.router.js';
import { dbconnect } from './config/database.config.js';

import axios from 'axios';

dbconnect();

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}));





const apiKey = process.env.GEMINI_API_KEY; 

app.post('/api/gemini', async (req, res) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const requestBody = req.body;

    try {
        const response = await axios.post(apiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data); // Send the response back to the frontend
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to communicate with Gemini API" });
    }
});

app.use('/api/gemini', (req, res, next) => {
    console.log("Incoming request:", req.body);
    next();
});


app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/chatbot', chatRoutes);
app.use('/api/foods',recommendationRoutes);
app.use('/api/reviews',reviewRoutes);
app.use('/api/admin/analys', analysRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
