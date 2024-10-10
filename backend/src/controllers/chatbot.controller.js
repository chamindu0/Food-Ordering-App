import { OrderModel } from '../models/order.model.js';
import { FoodModel } from '../models/food.model.js';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

// Controller to handle login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Without bcrypt, simply check if the provided password matches the stored password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for a protected route
export const protectedRoute = (req, res) => {
  res.json({ message: 'You are accessing a protected route', user: req.user });
};



// Greet the user
export const greetUser = (req, res) => {
  const message = req.body.message.toLowerCase();
  if (message.includes('hello') || message.includes('hi')) {
    return res.json({ response: 'Hello! How can I assist you with your food order today?' });
  }
  return res.status(400).json({ response: 'Sorry, I didn’t understand that.' });
};

// Get available foods
export const getAvailableFoods = async (req, res) => {
  try {
    const foods = await FoodModel.find({});
    console.log(foods);
    const foodList = foods.map(food => `${food.name} - $${food.price}`).join(', ');
    return res.json({ response: `Available foods: ${foodList}` });
  } catch (error) {
    console.error("Error fetching available foods:", error);
    return res.status(500).json({ response: 'Error fetching available foods.' });
  }
};

// Place an order
export const placeOrder = async (req, res) => {
  const { name, address, addressLatLng, items, userId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ response: 'Your order is empty!' });
  }

  const totalPrice = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  const newOrder = new OrderModel({
    name,
    address,
    addressLatLng,
    items,
    totalPrice,
    user: userId,
  });

  try {
    const savedOrder = await newOrder.save();
    return res.json({ response: `Order placed successfully! Your order ID is ${savedOrder._id}` });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ response: 'Error placing order.' });
  }
};

// Handle generic chatbot requests
export const handleChat = (req, res) => {
  const message = req.body.message.toLowerCase();
  if (message.includes('order status')) {
    return res.json({ response: 'Please provide your order ID.' });
  }
  return res.status(400).json({ response: 'Sorry, I didn’t understand that.' });
};
