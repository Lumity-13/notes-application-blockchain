import React, { useState } from 'react';
import FileDropdown from './FileDropdown';
import EditDropdown from './EditDropdown';
import AccountDropdown from './AccountDropdown';
import './Header.css';

const Header = ({ onBackToHome }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    console.log('Dropdown button clicked:', dropdown);
    console.log('Current activeDropdown state:', activeDropdown);
    
    const newState = activeDropdown === dropdown ? null : dropdown;
    console.log('Setting activeDropdown to:', newState);
    
    setActiveDropdown(newState);
  };

  const closeDropdowns = () => {
    console.log('Closing all dropdowns');
    setActiveDropdown(null);
  };

  return (
    <header className="header">
      <div className="left-section">
        <button 
          className="home-button"
          onClick={() => {
            console.log('Home button clicked');
            onBackToHome();
          }} 
          title="Back to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        
        <div className="menu-bar">
          <div className="menu-item">
            <button 
              className="menu-button"
              onClick={() => toggleDropdown('file')}
            >
              File
            </button>
            <FileDropdown 
              isOpen={activeDropdown === 'file'}
              onClose={closeDropdowns}
            />
          </div>
          
          <div className="menu-item">
            <button 
              className="menu-button"
              onClick={() => toggleDropdown('edit')}
            >
              Edit
            </button>
            <EditDropdown 
              isOpen={activeDropdown === 'edit'}
              onClose={closeDropdowns}
            />
          </div>
        </div>
      </div>

      <div className="account-section">
        <button 
          className="account-button"
          onClick={() => toggleDropdown('account')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>
        <AccountDropdown 
          isOpen={activeDropdown === 'account'}
          onClose={closeDropdowns}
        />
      </div>
    </header>
  );
};

export default Header;