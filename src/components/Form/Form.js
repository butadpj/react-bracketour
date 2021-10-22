import React from 'react';
import './Form.css';

const Form = ({children, onSubmit}) => {
  return (
    <form onSubmit={onSubmit} className="participant-form">
      {children}
    </form>
  )
}

export default Form
