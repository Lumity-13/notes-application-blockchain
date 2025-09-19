import React from 'react';

const AccountDropdown = ({ isOpen, onClose, onLoginClick, onRegisterClick }) => {
  const accountOptions = [
    { label: 'Login', action: onLoginClick },
    { label: 'Register', action: onRegisterClick }
  ];

  const handleItemClick = (option) => {
    console.log('Account option clicked:', option.label);
    option.action();
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
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default AccountDropdown;