import { FoodModel } from '../models/food.model.js';

// Function to get food recommendations based on tags and stars (content-based)
export const getFoodRecommendations = async (req, res) => {
  try {
    const foodId = req.params.id;

    // Find the current food item by ID
    const currentFood = await FoodModel.findById(foodId);
    if (!currentFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Find similar foods based on matching tags or stars
    const recommendations = await FoodModel.find({
      _id: { $ne: currentFood._id }, // Exclude current food
      $or: [
        { tags: { $in: currentFood.tags } }, // Match on tags
        { stars: { $gte: currentFood.stars - 1, $lte: currentFood.stars + 1 } } // Match on similar star ratings
      ]
    }).limit(5); // Limit to 5 recommendations

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
};
