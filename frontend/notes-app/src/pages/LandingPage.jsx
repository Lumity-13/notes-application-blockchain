import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import TabSystem from '../components/TabSystem';
import FindReplaceModal from '../components/FindReplaceModal';
import '../css/LandingPage.css';

const TextEditor = ({ content, onChange, editorRef }) => {
  return (
    <div className="landing-text-editor-container">
      <textarea
        ref={editorRef}
        className="landing-text-editor"
        value={content}
        onChange={onChange}
        placeholder="Start typing your notes here..."
        spellCheck="false"
      />
    </div>
  );
};

const LandingPage = () => {
  const [tabs, setTabs] = useState([
    { id: 1, title: 'Untitled-1', content: '', hasUnsavedChanges: false }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);

  const editorRef = useRef(null);

  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, content: newContent }
          : tab
      )
    );
  };

  const handleTabSelect = (tabId) => setActiveTabId(tabId);

  const handleTabClose = (tabId) => {
    if (tabs.length === 1) return;
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      if (tabId === activeTabId) {
        const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
        setActiveTabId(newActiveTab.id);
      }
      return newTabs;
    });
  };

  const handleAddTab = () => {
    const newTab = { id: nextTabId, title: `Untitled-${nextTabId}`, content: '', hasUnsavedChanges: false };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(nextTabId);
    setNextTabId(prev => prev + 1);
  };

  const handleFindReplace = (findText, replaceText) => {
    if (!findText) return;
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, content: tab.content.replace(new RegExp(findText, 'g'), replaceText) }
          : tab
      )
    );
    if (editorRef.current) {
      editorRef.current.value = editorRef.current.value.replace(new RegExp(findText, 'g'), replaceText);
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="landing-page">
      <Header
        onBackToHome={() => console.log('Back to home clicked')}
        onNewFile={handleAddTab}
        onFindReplaceClick={() => setIsFindReplaceOpen(true)}
        editorRef={editorRef}
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
                editorRef={editorRef}
              />
            )}
          </div>
        </section>
      </main>

      {isFindReplaceOpen && (
        <FindReplaceModal
          onClose={() => setIsFindReplaceOpen(false)}
          onFindReplace={handleFindReplace}
        />
      )}
    </div>
  );
};

export default LandingPage;
