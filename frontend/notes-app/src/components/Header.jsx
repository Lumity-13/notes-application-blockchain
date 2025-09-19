import React, { useState } from 'react';
import FileDropdown from './FileDropdown';
import EditDropdown from './EditDropdown';
import AccountDropdown from './AccountDropdown';
import LoginPopup from './LoginPopup';
import RegisterPopup from './RegisterPopup';

const Header = ({ onBackToHome }) => {
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
    const handleClickOutside = () => {
      closeDropdowns();
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
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownToggle('file');
              }}
            >
              File
            </button>
            <FileDropdown
              isOpen={openDropdown === 'file'}
              onClose={closeDropdowns}
            />
          </div>

          <div className="menu-item">
            <button 
              className="menu-button"
              onClick={(e) => {
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
            onClick={(e) => {
              e.stopPropagation();
              handleDropdownToggle('account');
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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