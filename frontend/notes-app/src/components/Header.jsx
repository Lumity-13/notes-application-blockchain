import React, { useState } from 'react';
import FileDropdown from './FileDropdown';
import EditDropdown from './EditDropdown';
import AccountDropdown from './AccountDropdown';
import LoginPopup from './LoginPopup';
import RegisterPopup from './RegisterPopup';

const Header = ({ onBackToHome, onNewFile }) => {
  // Existing state for dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // New state for auth popups
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  // Existing dropdown handlers
  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  // New auth popup handlers
  const handleLoginClick = () => {
    setShowLoginPopup(true);
    closeDropdowns();
  };

  const handleRegisterClick = () => {
    setShowRegisterPopup(true);
    closeDropdowns();
  };

  const handleCloseLogin = () => {
    setShowLoginPopup(false);
  };

  const handleCloseRegister = () => {
    setShowRegisterPopup(false);
  };

  const handleSwitchToRegister = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterPopup(false);
    setShowLoginPopup(true);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the header area
      const header = document.querySelector('.header');
      if (header && !header.contains(event.target)) {
        closeDropdowns();
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <>
      <header className="header">
        <div className="menu-bar">
          <div className="menu-item">
            <button 
              className="menu-button"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus change
                e.stopPropagation();
                handleDropdownToggle('file');
              }}
            >
              File
            </button>
            <FileDropdown
              isOpen={openDropdown === 'file'}
              onClose={closeDropdowns}
              onNewFile={onNewFile}
            />
          </div>

          <div className="menu-item">
            <button 
              className="menu-button"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus change
                e.stopPropagation();
                handleDropdownToggle('edit');
              }}
            >
              Edit
            </button>
            <EditDropdown
              isOpen={openDropdown === 'edit'}
              onClose={closeDropdowns}
            />
          </div>
        </div>

        <div className="account-section">
          <button 
            className="account-button"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent focus change
              e.stopPropagation();
              handleDropdownToggle('account');
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <AccountDropdown
            isOpen={openDropdown === 'account'}
            onClose={closeDropdowns}
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
          />
        </div>
      </header>

      {/* Auth Popups */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={handleCloseLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterPopup
        isOpen={showRegisterPopup}
        onClose={handleCloseRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Header;