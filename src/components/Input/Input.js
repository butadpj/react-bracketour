import React from 'react';
import './Input.css';

const Input = ({value = '', status='', onChange}) => {
  return (
    <>
      <label htmlFor="participant-input">Enter the number of participants</label>
      <input 
        id="participant-input"
        value={value}
        className={`input ${status}`}
        type="text" 
        placeholder="2" 
        onChange={onChange}
      />
    </>
  )
}

export default Input
