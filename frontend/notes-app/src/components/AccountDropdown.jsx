import React from 'react';

const AccountDropdown = ({ isOpen, onClose }) => {
  const accountOptions = [
    'Login',
    'Register'
  ];

  const handleItemClick = (option) => {
    console.log('Account option clicked:', option);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown show account-dropdown">
      {accountOptions.map((option, index) => (
        <div 
          key={index}
          className="dropdown-item"
          onClick={() => handleItemClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default AccountDropdown;