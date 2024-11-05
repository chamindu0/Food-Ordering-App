import React, { useState, useEffect } from 'react';
import { submitReview, getReviewsByUserName } from '../../services/reviewService'; // Import the function to fetch reviews
import StarRating from '../StarRating/StarRating';
import styles from './ReviewForm.module.css';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

export default function ReviewForm({ order }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1); // Default rating
  const [reviews, setReviews] = useState([]); // State to store fetched reviews
  const userName = user ? user.name : null; // Safely handle if user is not defined
  const foodId = order.items.length > 0 ? order.items[0].food._id : null;

  // Fetch reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByUserName(userName);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (foodId) {
      fetchReviews(); // Fetch reviews when the component is first rendered
    }
  }, [foodId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to submit a review.');
      return;
    }

    try {
      const newReview = { foodId, userName, comment, rating };
      
      // Submit the review
      await submitReview(newReview);
      toast.success('Review submitted successfully!');

      // Add the newly submitted review to the reviews list
      setReviews((prevReviews) => [...prevReviews, newReview]);

      // Clear the form fields
      setComment('');
      setRating(1);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  // Prevent rendering the component for admins
  if (!user || user.isAdmin === true) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2>Submit Your Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <StarRating stars={rating} onChange={setRating} size={30} />
        </div>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Write your comment here..."
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>

      {/* Display submitted reviews */}
      <div className={styles.reviewsSection}>
        <h3> My Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews you submited yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <p>{review.userName}</p>
              <StarRating stars={review.rating} size={25} />
              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
