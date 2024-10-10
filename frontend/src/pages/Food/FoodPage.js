import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; // Import Link from react-router-dom
import Price from '../../components/Price/Price';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import { useCart } from '../../hooks/useCart';
import { getById, getRecommendations } from '../../services/foodService';
import classes from './foodPage.module.css';
import NotFound from '../../components/NotFound/NotFound';
import ShowReview from '../../components/ShowReview/ShowReview';

export default function FoodPage() {
  const [food, setFood] = useState({});
  const [recommendedFoods, setRecommendedFoods] = useState([]); // State for recommendations
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(food);
    navigate('/cart');
  };

  useEffect(() => {
    getById(id).then(setFood);

    // Fetch recommendations based on the current food item
    getRecommendations(id).then(setRecommendedFoods);
  }, [id]);

  return (
    <>
      {!food ? (
        <NotFound message="Food Not Found!" linkText="Back To Homepage" />
      ) : (
        <div className={classes.container}>
          <img
            className={classes.image}
            src={`${food.imageUrl}`}
            alt={food.name}
          />

          <div className={classes.details}>
            <div className={classes.header}>
              <span className={classes.name}>{food.name}</span>
              <span
                className={`${classes.favorite} ${
                  food.favorite ? '' : classes.not
                }`}
              >
                ❤
              </span>
            </div>
            <div className={classes.rating}>
              <StarRating stars={food.stars} size={25} />
            </div>

            <div className={classes.origins}>
              {food.origins?.map(origin => (
                <span key={origin}>{origin}</span>
              ))}
            </div>

            <div className={classes.tags}>
              {food.tags && (
                <Tags
                  tags={food.tags.map(tag => ({ name: tag }))}
                  forFoodPage={true}
                />
              )}
            </div>

            <div className={classes.cook_time}>
              <span>
                Time to cook about <strong>{food.cookTime}</strong> minutes
              </span>
            </div>

            <div className={classes.price}>
              <Price price={food.price} />
            </div>

            <button onClick={handleAddToCart}>Add To Cart</button>
          </div>

          {/* Recommendations Section */}
          <div className={classes.recommendations}>
            <h3>Recommended for You</h3>
            <div className={classes.recommendationList}>
              {recommendedFoods.map(recommendation => (
                <Link
                  to={`/food/${recommendation._id}`} // Navigate to food detail page when clicked
                  key={recommendation._id}
                  className={classes.recommendationItem}
                >
                  <img src={recommendation.imageUrl} alt={recommendation.name} />
                  <div className={classes.recommendationDetails}>
                    <span>{recommendation.name}</span>
                    <Price price={recommendation.price} />
                  </div>
                </Link>
              ))}
            </div>
            <ShowReview foodId={id} />
          </div>
        </div>
      )}

    
    </>
  );
}
