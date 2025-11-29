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
        
        // Set next temp ID to avoid conflicts
        const maxId = Math.max(...notes.map(n => n.id));
        setNextTabId(maxId + 1);
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

      console.log('Saving note:', { id: tab.id, isSaved: tab.isSaved, noteData });

      let savedId = tab.id;

      if (tab.isSaved && !String(tab.id).startsWith('temp-')) {
        // Update existing note
        console.log('Updating existing note with ID:', tab.id);
        await updateNote(tab.id, noteData);
        
        // Mark as saved
        setTabs(prevTabs =>
          prevTabs.map(t =>
            t.id === tab.id
              ? { ...t, hasUnsavedChanges: false }
              : t
          )
        );
      } else {
        // Create new note
        console.log('Creating new note for user:', user.id);
        const response = await createNote(user.id, noteData);
        console.log('Create response:', response.data);
        savedId = response.data.id;
        
        const oldTabId = tab.id;
        
        // Update tab with real ID from backend and remove old temp tab
        setTabs(prevTabs => {
          // Replace the temp tab with the saved tab
          return prevTabs.map(t =>
            t.id === oldTabId
              ? { 
                  ...t, 
                  id: savedId, 
                  isSaved: true, 
                  hasUnsavedChanges: false 
                }
              : t
          );
        });
        
        // Update active tab ID if this was the active tab
        if (activeTabId === oldTabId) {
          setActiveTabId(savedId);
        }
        
        return savedId;
      }
      
      return savedId;
    } catch (error) {
      console.error('Error saving note:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
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
    const trimmedTitle = activeTab.title?.trim() || '';
    const trimmedContent = activeTab.content?.trim() || '';
    
    // Check if title starts with "Untitled" or is empty
    if (!trimmedTitle || trimmedTitle.startsWith('Untitled')) {
      alert('Please enter a proper title before saving (not "Untitled").');
      titleRef.current?.focus();
      return;
    }

    if (!trimmedContent) {
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
          ? { ...tab, title: newTitle || `Untitled-${tab.id}`, hasUnsavedChanges: true }
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
  
  const tabToClose = tabs.find(tab => tab. id === tabId);
  
  if (tabToClose?. isSaved && ! String(tabToClose.id). startsWith('temp-')) {
    if (tabToClose.hasUnsavedChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Close without saving?');
      if (!confirmClose) return;
    }
    
    try {
      await deleteNote(tabId);
    } catch (error) {
      console. error('Error deleting note:', error);
    }
  }
  
  setTabs(prevTabs => {
    const newTabs = prevTabs. filter(tab => tab.id !== tabId);
    
    // Fix: Only update activeTabId if we're closing the active tab
    if (tabId === activeTabId && newTabs.length > 0) {
      const tabIndex = prevTabs. findIndex(tab => tab.id === tabId);
      const newActiveTab = newTabs[Math. min(tabIndex, newTabs.length - 1)] || newTabs[0];
      if (newActiveTab) {
        setActiveTabId(newActiveTab.id);
      }
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