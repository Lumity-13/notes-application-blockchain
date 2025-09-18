import React from 'react';

const FileDropdown = ({ isOpen, onClose }) => {
  const fileOptions = [
    'New File',
    'Open File',
    'Save',
    'Save As',
    '--- More options coming soon ---'
  ];

  const handleItemClick = (option) => {
    console.log('File option clicked:', option);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown show">
      {fileOptions.map((option, index) => (
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

export default FileDropdown;