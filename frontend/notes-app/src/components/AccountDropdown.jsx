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

  const handleMouseDown = (e, option) => {
    e.preventDefault(); // Prevent focus change and selection loss
    handleItemClick(option);
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown show account-dropdown">
      {accountOptions.map((option, index) => (
        <div 
          key={index}
          className="dropdown-item"
          onMouseDown={(e) => handleMouseDown(e, option)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default AccountDropdown;