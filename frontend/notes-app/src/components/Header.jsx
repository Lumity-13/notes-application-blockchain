import React, { useState } from 'react';
import FileDropdown from './FileDropdown';
import EditDropdown from './EditDropdown';
// import AccountDropdown from './AccountDropdown';

const AccountDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      background: '#1a1f3a',
      border: '1px solid #2a2f55',
      borderRadius: '4px',
      padding: '8px 0',
      minWidth: '120px',
      zIndex: 1000
    }}>
      <div style={{ padding: '8px 16px', color: '#e7e9ff' }}>Profile</div>
      <div style={{ padding: '8px 16px', color: '#e7e9ff' }}>Settings</div>
      <div style={{ padding: '8px 16px', color: '#e7e9ff' }}>Logout</div>
    </div>
  );
};

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

  const headerStyles = {
    header: {
      background: '#1a1f3a',
      padding: '12px 16px',
      borderBottom: '1px solid #2a2f55',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    homeButton: {
      background: 'none',
      border: 'none',
      color: '#e7e9ff',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuBar: {
      display: 'flex',
      gap: '8px',
    },
    menuItem: {
      position: 'relative',
    },
    menuButton: {
      background: 'none',
      border: 'none',
      color: '#e7e9ff',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
    },
    accountSection: {
      position: 'relative',
    },
    accountButton: {
      background: 'none',
      border: 'none',
      color: '#e7e9ff',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.leftSection}>
        <button 
          style={headerStyles.homeButton}
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
        
        <div style={headerStyles.menuBar}>
          <div style={headerStyles.menuItem}>
            <button 
              style={headerStyles.menuButton}
              onClick={() => toggleDropdown('file')}
            >
              File
            </button>
            <FileDropdown 
              isOpen={activeDropdown === 'file'}
              onClose={closeDropdowns}
            />
          </div>
          
          <div style={headerStyles.menuItem}>
            <button 
              style={headerStyles.menuButton}
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

      <div style={headerStyles.accountSection}>
        <button 
          style={headerStyles.accountButton}
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