import React, { useState } from 'react';
import { submitReview } from '../../services/reviewService';
import StarRating from '../StarRating/StarRating'; // Import StarRating
import styles from './ReviewForm.module.css'; // Import the CSS module

export default function ReviewForm({ foodId }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1); // Default rating

  // Parse the user object from localStorage
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null; // Safely parse JSON
  const userId = parsedUser ? parsedUser._id : null; // Access userId

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!userId) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      await submitReview({ foodId, userId, comment, rating });
      alert('Review submitted!');
      setComment(''); // Clear the comment after submission
      setRating(1); // Reset rating to default
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Submit Your Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <StarRating stars={rating} onChange={setRating} size={30} /> {/* Updated StarRating */}
        </div>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
