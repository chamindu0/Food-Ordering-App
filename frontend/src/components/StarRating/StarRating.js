import React from 'react';
import classes from './starRating.module.css';

export default function StarRating({ stars, size, onChange }) {
  const styles = {
    width: size + 'px',
    height: size + 'px',
    marginRight: size / 6 + 'px',
  };

  function Star({ number }) {
    const halfNumber = number - 0.5;

    return stars >= number ? (
      <img
        src="/star-full.svg"
        style={styles}
        alt={number}
        onClick={() => onChange(number)} // Set rating on click
        role="button"
        tabIndex={0} // Make it focusable
        onKeyPress={(e) => e.key === 'Enter' && onChange(number)} // Handle keyboard accessibility
      />
    ) : stars >= halfNumber ? (
      <img
        src="/star-half.svg"
        style={styles}
        alt={number}
        onClick={() => onChange(number)} // Set rating on click
        role="button"
        tabIndex={0} // Make it focusable
        onKeyPress={(e) => e.key === 'Enter' && onChange(number)} // Handle keyboard accessibility
      />
    ) : (
      <img
        src="/star-empty.svg"
        style={styles}
        alt={number}
        onClick={() => onChange(number)} // Set rating on click
        role="button"
        tabIndex={0} // Make it focusable
        onKeyPress={(e) => e.key === 'Enter' && onChange(number)} // Handle keyboard accessibility
      />
    );
  }

  return (
    <div className={classes.rating}>
      {[1, 2, 3, 4, 5].map(number => (
        <Star key={number} number={number} />
      ))}
    </div>
  );
}

StarRating.defaultProps = {
  size: 18,
};
