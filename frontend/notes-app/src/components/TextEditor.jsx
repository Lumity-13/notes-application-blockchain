import React, { useState } from 'react';

const TextEditor = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const styles = {
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

  return (
    <div className="text-editor-container" style={styles.textEditorContainer}>
      <textarea
        className="text-editor"
        style={styles.textEditor}
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your notes here..."
        spellCheck="false"
      />
    </div>
  );
};

export default TextEditor;