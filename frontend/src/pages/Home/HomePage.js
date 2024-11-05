import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import { getAll, getAllByTag, getAllTags, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Chatbot from '../../components/ChatBot/ChatBot';
import classes from './HomePage.module.css';
import CategoryFilter from "../../components/categoryFilter/categoryFilter";


const initialState = { foods: [], tags: [], loading: true, error: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload, loading: false };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags, loading, error } = state;
  const { searchTerm, tag } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
  };

  useEffect(() => {
    dispatch({ type: 'FOODS_LOADED', payload: [] });
    getAllTags()
      .then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }))
      .catch(err => dispatch({ type: 'ERROR', payload: err.message }));

    const loadFoods = async () => {
      try {
        if (tag) {
          return await getAllByTag(tag);
        } 
        if (searchTerm) {
          return await search(searchTerm);
        }
        if (selectedCategory) {
          return await getAllByTag(selectedCategory);
        }
        return await getAll();
      } catch (err) {
        console.error("Failed to load foods:", err);
        throw err; // Rethrow to be caught in outer catch
      }
    };

    loadFoods()
      .then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }))
      .catch(err => {
        console.error(err);
        dispatch({ type: 'ERROR', payload: err.message });
      });
  }, [searchTerm, tag, selectedCategory]);

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={classes.error}>Error: {error}</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.searchBar}>
        <Search />
      </div>
      <div className={classes.tags}>
        <CategoryFilter onSelectCategory={handleCategorySelect} />
      </div>
      <div className={classes.tags}>
        <Tags tags={tags} />
      </div>
      {foods.length === 0 ? (
        <NotFound linkText="Reset Search" />
      ) : (
        <div className={classes.thumbnails}>
          <Thumbnails foods={foods} />
        </div>
      )}
      <div className={classes.chatbot}>
        <Chatbot />
      </div>
    </div>
  );
}
