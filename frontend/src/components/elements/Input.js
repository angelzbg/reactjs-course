import React from 'react';

const Input = ({ className, value, name, type, placeholder, setInput }) => (
  <input
    className={className}
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => setInput(name, e.target.value)}
  />
);

export default Input;
