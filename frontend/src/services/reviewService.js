// services/reviewService.js

import axios from "axios";

// Base URL for your API
const API_URL = "/api/reviews";

// Function to submit a review
export const submitReview = async ({ foodId, userId, comment, rating }) => {
  try {
    const response = await axios.post(`${API_URL}/foods`, {
      foodId,
      userId,
      comment,
      rating,
    });
    return response.data; // Return the created review
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error; // Throw error to be handled in the component
  }
};

// Function to fetch reviews by food ID
export const getReviewsByFoodId = async (foodId) => {
  try {
    const response = await axios.get(`${API_URL}/foods/${foodId}`); // Ensure the URL matches your backend route
    return response.data; // Return the list of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Throw error to be handled in the component
  }
};
