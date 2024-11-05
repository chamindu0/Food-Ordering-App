import React, { useState, useEffect, useRef } from 'react';
import { createOrder } from '../../services/orderService.js';
import { getAll } from '../../services/foodService.js';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import img from './bot.png'; // Chatbot image
import classes from './chatBot.module.css'; // Import CSS module

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [currentFood, setCurrentFood] = useState(null); // Track the current food item for quantity input
  const [isChatOpen, setIsChatOpen] = useState(false); // Track if the chatbot is open
  const messagesEndRef = useRef(null); // Ref for scrolling
  const navigate = useNavigate();
  const { addToCart, cart } = useCart(); // Destructure the addToCart method from useCart

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const items = await getAll(); // Fetch available food items
        setFoodItems(items);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom(); // Scroll to the bottom when a new message is added
    }
  }, [messages, isChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);

    await handleRegularFlow(userInput);

    setUserInput('');
  };

  const handleRegularFlow = async (userInput) => {
    let responseContent = "Sorry, I am having trouble understanding that.";

    try {
      // Check if the user is placing an order
      if (userInput.toLowerCase().includes("order")) {
        const foodName = userInput.split("order ")[1];
        const foodItem = foodItems.find(item => item.name.toLowerCase() === foodName.toLowerCase());

        if (foodItem) {
          setCurrentFood(foodItem); // Set the current food item for quantity input
          responseContent = `How many ${foodItem.name} would you like to order?`;
        } else {
          responseContent = "Sorry, I couldn't find that food item.";
        }
      }
      // Handle quantity input
      else if (currentFood && !isNaN(userInput)) {
        const quantity = Number(userInput);

        if (quantity > 0) {
          addToCart({ ...currentFood, quantity }); // Add food item with quantity to cart
          responseContent = `${currentFood.name} (x${quantity}) has been added to your cart. Would you like to checkout?`;
          setCurrentFood(null); // Reset current food item
        } else {
          responseContent = "Please enter a valid quantity.";
        }
      }
      // Handle checkout process
      else if (userInput.toLowerCase().includes("checkout") || userInput.toLowerCase().includes("yes")) {
        if (cart.items.length === 0) {
          responseContent = "Your cart is empty! Please add items before checking out.";
        } else {
      
              const order = { items: cart.items };
              await createOrder(order);
              navigate('/checkout');
              responseContent = "Order placed successfully! Redirecting to checkout...";
      
        }
      }
      // Display available food items
      else if (userInput.toLowerCase().includes("available food") || userInput.toLowerCase().includes("menu")) {
        responseContent = foodItems.length > 0
          ? `Here are the available food items:\n${foodItems.map((item, i) => `${i + 1}. ${item.name}`).join("\n")}\nPlease type the food name to order.`
          : "Sorry, no food items are available right now.";
      }
      // Handle other queries through the Gemini API
      else {
        responseContent = await getGeminiResponse(userInput);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      responseContent = "Sorry, there was an error processing your request.";
    }

    setMessages((prev) => [...prev, { role: "bot", content: responseContent }]);
  };

  

  const getGeminiResponse = async (userInput) => {
    const apiUrl = `http://localhost:5000/api/gemini`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: userInput }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(
        apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidateContent = response.data.candidates[0].content;
        if (candidateContent && candidateContent.parts && candidateContent.parts.length > 0) {
          return candidateContent.parts[0].text.trim();
        } else {
          return "Sorry, I couldn't understand your request.";
        }
      } else {
        return "Sorry, I couldn't understand your request.";
      }
    } catch (error) {
      console.error("Error calling Google Gemini API:", error.response ? error.response.data : error.message);
      return "Sorry, I couldn't understand your request.";
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle the chatbot visibility
  };

  return (
    <div>
      {/* Bot icon to open chat */}
      <img src={img} alt="bot-icon" onClick={toggleChat} className={classes.botIcon} />
      
      {/* Chat window */}
      {isChatOpen && (
        <div className={classes.chatbotContainer}>
          {/* Header */}
          <div className={classes.header}>
            <img src={img} alt="Foody" className={classes.headerBotImg} />
            <span className={classes.headerTitle}>Foody</span>
          </div>
          <div style={{ whiteSpace: 'pre-line' }} className={classes.messages}>
            {messages.map((message, index) => (
              <div key={index} className={`${classes.message} ${message.role === 'user' ? classes.userMessage : classes.botMessage}`}>
                <div className={classes.messageContent}>
                  {message.role === 'bot' && <img src={img} alt="bot" className={classes.botImg} />}
                  <span>{message.content}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Ensures auto-scrolling to the bottom */}
          </div>

          <form onSubmit={handleSendMessage} className={classes.inputContainer}>
            <input
              type="text"
              value={userInput}
              onChange={handleUserInputChange}
              placeholder="Type your message..."
              className={classes.input}
            />
            <button type="submit" className={classes.sendButton}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
