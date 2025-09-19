import React, { useState } from 'react';
import Header from '../components/Header';
import TabSystem from '../components/TabSystem';
import '../css/LandingPage.css';

const TextEditor = ({ content, onChange }) => {
  return (
    <div className="landing-text-editor-container">
      <textarea
        className="landing-text-editor"
        value={content}
        onChange={onChange}
        placeholder="Start typing your notes here..."
        spellCheck="false"
      />
    </div>
  );
};

const LandingPage = ({ onStartNotepad = () => {} }) => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: 'Untitled-1',
      content: '',
      hasUnsavedChanges: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);

  const getActiveTab = () => {
    return tabs.find(tab => tab.id === activeTabId);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    const currentTab = getActiveTab();
    
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTabId 
          ? { 
              ...tab, 
              content: newContent,
              hasUnsavedChanges: newContent !== '' && newContent !== currentTab?.originalContent
            }
          : tab
      )
    );
  };

  const handleTabSelect = (tabId) => {
    setActiveTabId(tabId);
  };

  const handleTabClose = (tabId) => {
    // Prevent closing the last tab
    if (tabs.length === 1) return;

    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If we're closing the active tab, switch to another tab
      if (tabId === activeTabId) {
        const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
        setActiveTabId(newActiveTab.id);
      }
      
      return newTabs;
    });
  };

  const handleAddTab = () => {
    const newTab = {
      id: nextTabId,
      title: `Untitled-${nextTabId}`,
      content: '',
      hasUnsavedChanges: false
    };
    
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(nextTabId);
    setNextTabId(prev => prev + 1);
  };

  const activeTab = getActiveTab();

  return (
    <div className="landing-page">
      <Header 
        onBackToHome={() => console.log('Back to home clicked')}
        onNewFile={handleAddTab}
      />
      <main className="landing-main">
        <section className="landing-full-preview">
          <TabSystem
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
            onAddTab={handleAddTab}
          />
          <div className="landing-editor-wrap">
            {activeTab && (
              <TextEditor
                content={activeTab.content}
                onChange={handleContentChange}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;