import axios from "axios";


// Function to submit a review
export const submitReview = async ({ foodId, userName, comment, rating }) => {
  try {
    const response = await axios.post(`/api/reviews/foods/${foodId}`, {
      foodId,
      userName,
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
export const getReviewsByFood = async () => {
  try {
    const response = await axios.get(`/api/reviews/foods/`); // Ensure the URL matches your backend route
    return response.data; // Return the list of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Throw error to be handled in the component
  }


};

// Function to fetch reviews by food ID
export const getReviewsByFoodId = async (foodId) => {
  try {
    const response = await axios.get(`/api/reviews/foods/`+foodId); // Ensure the URL matches your backend route
    return response.data; // Return the list of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Throw error to be handled in the component
  }

};


export const getReviewsByUserName = async (userName) => {
  try {
    const response = await axios.get(`/api/reviews/foods/`+userName); // Ensure the URL matches your backend route
    return response.data; // Return the list of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Throw error to be handled in the component
  }

};

