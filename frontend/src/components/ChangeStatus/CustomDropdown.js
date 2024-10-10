import React, { useState } from 'react';
import classes from './ChangeStatus.module.css';

const customStyles = {
  NEW: { backgroundColor: '#d1e7dd', color: '#0f5132' },
  PAYED: { backgroundColor: '#fff3cd', color: '#856404' },
  SHIPPED: { backgroundColor: '#cce5ff', color: '#004085' },
  CANCELED: { backgroundColor: '#f8d7da', color: '#721c24' },
  REFUNDED: { backgroundColor: '#f5c6cb', color: '#721c24' },
};

const CustomDropdown = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={classes.dropdown}>
      <div className={classes.selected} onClick={() => setIsOpen(!isOpen)}>
        {status || 'Select Status'}
      </div>
      {isOpen && (
        <div className={classes.options}>
          {Object.keys(customStyles).map((key) => (
            <div
              key={key}
              className={classes.option}
              style={customStyles[key]}
              onClick={() => handleOptionClick(key)}
            >
              {key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
