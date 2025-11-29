import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { getNotesByUser, createNote, updateNote, deleteNote } from '../api/notes';
import Header from '../components/Header';
import TabSystem from '../components/TabSystem';
import FindReplaceModal from '../components/FindReplaceModal';
import '../css/NotesPage.css';

const NotesPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [nextTabId, setNextTabId] = useState(1);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  // Load notes from backend on mount
  useEffect(() => {
    if (user?.id) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await getNotesByUser(user.id);
      const notes = response.data;
      
      if (notes.length > 0) {
        const formattedTabs = notes.map(note => ({
          id: note.id,
          title: note.title || 'Untitled',
          content: note.content || '',
          hasUnsavedChanges: false,
          isSaved: true
        }));
        setTabs(formattedTabs);
        
        // Check if a specific note was requested from Landing page
        const requestedNoteId = location.state?.noteId;
        if (requestedNoteId) {
          setActiveTabId(requestedNoteId);
        } else {
          setActiveTabId(formattedTabs[0].id);
        }
        
        setNextTabId(Math.max(...notes.map(n => n.id)) + 1);
      } else {
        // Create first note if none exist
        await handleAddTab();
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      // Create first note on error
      await handleAddTab();
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers
  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  // Save note to backend
  const saveNote = async (tab) => {
    try {
      const noteData = {
        title: tab.title,
        content: tab.content
      };

      let savedId = tab.id;

      if (tab.isSaved) {
        // Update existing note
        await updateNote(tab.id, noteData);
      } else {
        // Create new note
        const response = await createNote(user.id, noteData);
        savedId = response.data.id;
        
        // Update tab with real ID from backend
        setTabs(prevTabs =>
          prevTabs.map(t =>
            t.id === tab.id
              ? { ...t, id: savedId, isSaved: true, hasUnsavedChanges: false }
              : t
          )
        );
        
        // Update active tab ID if this was the active tab
        if (activeTabId === tab.id) {
          setActiveTabId(savedId);
        }
        
        return savedId;
      }
      
      // Mark as saved
      setTabs(prevTabs =>
        prevTabs.map(t =>
          t.id === tab.id
            ? { ...t, hasUnsavedChanges: false }
            : t
        )
      );
      
      return savedId;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  };

  // Manual save handler
  const handleManualSave = async () => {
    const activeTab = getActiveTab();
    if (!activeTab) {
      alert('No active note to save.');
      return;
    }

    // Validate title and content
    if (!activeTab.title || activeTab.title.trim() === '' || activeTab.title === 'Untitled') {
      alert('Please enter a title before saving.');
      titleRef.current?.focus();
      return;
    }

    if (!activeTab.content || activeTab.content.trim() === '') {
      alert('Please enter some content before saving.');
      editorRef.current?.focus();
      return;
    }

    try {
      await saveNote(activeTab);
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  // Tab actions
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, title: newTitle || 'Untitled', hasUnsavedChanges: true }
          : tab
      )
    );
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, content: newContent, hasUnsavedChanges: true }
          : tab
      )
    );
  };

  const handleTabSelect = (tabId) => setActiveTabId(tabId);

  const handleTabClose = async (tabId) => {
    if (tabs.length === 1) return;
    
    const tabToClose = tabs.find(tab => tab.id === tabId);
    
    // Only delete from backend if it's a saved note (has a real ID from backend)
    if (tabToClose?.isSaved && !String(tabToClose.id).startsWith('temp-')) {
      // Check if there are unsaved changes
      if (tabToClose.hasUnsavedChanges) {
        const confirmClose = window.confirm('You have unsaved changes. Close without saving?');
        if (!confirmClose) return;
      }
      
      try {
        await deleteNote(tabId);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
    
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

  const handleAddTab = async () => {
    const newTab = { 
      id: `temp-${nextTabId}`, // Use temporary ID with prefix
      title: `Untitled-${nextTabId}`, 
      content: '', 
      hasUnsavedChanges: false,
      isSaved: false // Mark as not saved yet
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setNextTabId(prev => prev + 1);
  };

  const handleFindReplace = (findText, replaceText) => {
    if (!findText) return;
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { 
              ...tab, 
              content: tab.content.replace(new RegExp(findText, 'g'), replaceText),
              hasUnsavedChanges: true 
            }
          : tab
      )
    );
    if (editorRef.current) {
      editorRef.current.value = editorRef.current.value.replace(new RegExp(findText, 'g'), replaceText);
    }
  };

  const activeTab = getActiveTab();

  if (isLoading) {
    return (
      <div className="landing-page">
        <Header
          onBackToHome={() => console.log('Back to home clicked')}
          onNewFile={handleAddTab}
          onFindReplaceClick={() => setIsFindReplaceOpen(true)}
          editorRef={editorRef}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#9ca3af' 
        }}>
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Header with logo */}
      <Header
        onBackToHome={() => console.log('Back to home clicked')}
        onNewFile={handleAddTab}
        onFindReplaceClick={() => setIsFindReplaceOpen(true)}
        onSave={handleManualSave}
        editorRef={editorRef}
      />

      {/* Main layout */}
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
              <div className="landing-text-editor-container">
                {/* Title Input */}
                <input
                  ref={titleRef}
                  type="text"
                  className="landing-note-title"
                  value={activeTab.title}
                  onChange={handleTitleChange}
                  placeholder="Note title..."
                  spellCheck="false"
                />
                
                {/* Content Textarea */}
                <textarea
                  ref={editorRef}
                  className="landing-text-editor"
                  value={activeTab.content}
                  onChange={handleContentChange}
                  placeholder="Start typing your notes here..."
                  spellCheck="false"
                />
              </div>
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

export default NotesPage;