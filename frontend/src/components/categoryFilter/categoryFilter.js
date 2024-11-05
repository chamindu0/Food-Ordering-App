import React from "react";
import classes from "./categoryFilter.module.css"; // Import CSS module
import { categories } from "./data"; // Import your categories data

const CategoryFilter = ({ onSelectCategory }) => {
  return (
    <div className={classes.categoryFilter}>
      {categories.map((category) => (
        <div
          key={category.id}
          className={classes.categoryItem}
          onClick={() => onSelectCategory(category.label)}
        >
          <img
            src={category.image}
            alt={category.label}
            className={classes.categoryImage}
          />
          <span className={classes.categoryLabel}>{category.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
