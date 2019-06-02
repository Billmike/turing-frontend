import React from 'react';
import './styles.scss';

const RadioButton = ({ labelText, name, toggleClick, index, categoryText, departmentText }) => (
  <label className="radio-button-container">
    <span className="text-span">{labelText}</span>
    <input
      type="radio"
      checked={name === 'category' ? (categoryText === labelText ? "checked" : "") : (departmentText === labelText ? "checked" : "")}
      name={name}
      onClick={() => toggleClick(labelText, index + 1)}
      />
    <span className="checkmark"></span>
  </label>
);

export default RadioButton;
