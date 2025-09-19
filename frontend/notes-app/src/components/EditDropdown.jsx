import React from 'react';

const EditDropdown = ({ isOpen, onClose }) => {
  const editOptions = [
    'Undo',
    'Cut',
    'Copy',
    'Paste',
    '--- More options coming soon ---'
  ];

  const handleItemClick = (option) => {
    if (!option.includes('---')) {
      console.log('Edit option clicked:', option);
      onClose();
    }
  };

  const handleMouseDown = (e, option) => {
    e.preventDefault(); // Prevent focus change and selection loss
    handleItemClick(option);
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown show">
      {editOptions.map((option, index) => (
        <div 
          key={index}
          className={`dropdown-item ${option.includes('---') ? 'placeholder' : ''}`}
          onMouseDown={(e) => handleMouseDown(e, option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default EditDropdown;