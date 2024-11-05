import React, { useEffect, useState, useRef } from "react";
import { getReviewsByFoodId } from "../../services/reviewService";
import StarRating from "../../components/StarRating/StarRating";
import classes from "./ShowReview.module.css";

export default function ShowReview({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(true); // For auto-sliding
  const [dragStartX, setDragStartX] = useState(null); // Track drag start
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);

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

  // Auto-slide every 3 seconds
  useEffect(() => {
    let interval;
    if (isSliding && reviews.length > 1) {
      interval = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSliding, reviews.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
    );
  };

  const handleReviewClick = () => {
    setIsSliding(false); // Stop sliding when clicked
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsSliding(false);
    const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    setDragStartX(startX);
  };

  const handleDragMove = (e) => {
    if (!isDragging || dragStartX === null) return;

    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = dragStartX - currentX;

    if (diff > 50) {
      // Dragging left
      handleNext();
      setIsDragging(false);
    } else if (diff < -50) {
      // Dragging right
      handlePrev();
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartX(null);
  };

  return (
    <div
      className={classes.container}
      ref={containerRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <h3>User Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className={classes.carousel} onClick={handleReviewClick}>
          <div
            className={classes.slides}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {reviews.map((review, index) => (
              <div className={classes.review} key={review._id}>
                <p>{review.userName}</p>
                <StarRating stars={review.rating} size={25} />
                <p>{review.comment}</p>
                <span className={classes.date}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
      
        </div>
      )}
    </div>
  );
}
