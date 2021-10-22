import React from 'react';
import './Button.css';

const Button = (
    {
      children,
      type = 'button',
      classNames = [],
      disabled = false,
      onClick = () => {}
    }
  ) => {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      type={type} 
      className={`btn ${classNames.join(' ')}`}>
        {children}
    </button>
  )
}

export default Button
