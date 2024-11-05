// Function to fetch reviews 
import axios from 'axios';

export const getReviews = async () => {
  try {
    const response = await axios.get(`/api/admin/analys/reviews`); // Ensure the URL matches your backend route
    return response.data; // Return the list of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Throw error to be handled in the component
  }


};

export const trackOrder = async () => {
  const { data } = await axios.get('/api/admin/analys/orders');
  return data;
};
