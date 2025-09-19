import React, { useState } from 'react';
import Header from '../components/Header';
import '../css/LandingPage.css';

const TextEditor = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="landing-text-editor-container">
      <textarea
        className="landing-text-editor"
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
    <div className="landing-page">
      <Header onBackToHome={() => console.log('Back to home clicked')} />
      <main className="landing-main">
        <section className="landing-full-preview">
          <h3 className="landing-preview-title">Live editor preview</h3>
          <div className="landing-editor-wrap">
            <TextEditor />
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;