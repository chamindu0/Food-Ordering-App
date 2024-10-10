// components/ShowReview/ShowReview.js
import React, { useEffect, useState } from "react";
import { getReviewsByFoodId, submitReview } from "../../services/reviewService";
import StarRating from "../../components/StarRating/StarRating";
import classes from "./ShowReview.module.css";

export default function ShowReview({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByFoodId(foodId);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [foodId]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

    if (!userId) {
      console.error("User is not logged in");
      return; // Handle not logged in state
    }

    const reviewData = {
      foodId,
      userId,
      comment,
      rating,
    };

    try {
      await submitReview(reviewData);
      setComment(""); // Clear the comment field
      setRating(1); // Reset rating
      // Fetch reviews again to include the newly submitted review
      const fetchedReviews = await getReviewsByFoodId(foodId);
      setReviews(fetchedReviews);
      console.log("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className={classes.container}>
      <h3>User Reviews</h3>
      <form onSubmit={handleSubmitReview}>
        <StarRating
          stars={rating}
          size={25}
          onChange={(newRating) => setRating(newRating)}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Write your review..."
        />
        <button type="submit">Submit Review</button>
      </form>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className={classes.review}>
            <StarRating stars={review.rating} size={25} />
            <p>{review.comment}</p>
            <span className={classes.date}>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
