import React, { useState } from 'react';
// Import your actual Header component with dropdowns
import Header from '../components/Header';

const TextEditor = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div style={styles.textEditorContainer}>
      <textarea
        style={styles.textEditor}
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your notes here..."
        spellCheck="false"
      />
    </div>
  );
};

const LandingPage = ({ onStartNotepad = () => {} }) => {
  return (
    <div className="landing-page" style={styles.page}>
      {/* Use the actual Header component with dropdowns */}
      <Header onBackToHome={() => console.log('Back to home clicked')} />

      {/* Fill the remaining viewport with the editor */}
      <main style={styles.main}>
        <section style={styles.fullPreview}>
          <h3 style={styles.previewTitle}>Live editor preview</h3>
          <div style={styles.editorWrap}>
            <TextEditor />
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0f1220',
    color: '#e7e9ff',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  // takes all space under the header
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    minHeight: 0, // Important: allows flex child to shrink
  },
  // no maxWidth; use 100%
  fullPreview: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 0,
    minHeight: 0, // Important: allows flex child to shrink
  },
  previewTitle: { 
    margin: '0 0 10px',
    fontSize: '14px',
    color: '#9ca3af',
  },
  editorWrap: {
    flex: 1,
    border: '1px solid #2a2f55',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    minHeight: 0, // Important: allows child to stretch in flex
  },
  // TextEditor container styles
  textEditorContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  textEditor: {
    flex: 1,
    width: '100%',
    height: '100%',
    background: '#0f1220',
    color: '#e7e9ff',
    border: 'none',
    outline: 'none',
    padding: '16px',
    fontSize: '14px',
    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    lineHeight: '1.5',
    resize: 'none',
    boxSizing: 'border-box',
  },
};

export default LandingPage;