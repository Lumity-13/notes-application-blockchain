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
    console.log('Edit option clicked:', option);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown show">
      {editOptions.map((option, index) => (
        <div 
          key={index}
          className={`dropdown-item ${option.includes('---') ? 'placeholder' : ''}`}
          onClick={() => !option.includes('---') && handleItemClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default EditDropdown;
