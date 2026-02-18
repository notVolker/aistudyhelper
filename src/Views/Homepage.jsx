import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Homepage.css';
import { summarizeText } from '../services/aiService';

function Homepage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const MAX_CHARACTERS = 5000;

  const handleSummarize = async () => {
    // Check if user is logged in
    if (!currentUser) {
      alert('Please log in to use the summarizer!');
      navigate('/login');
      return;
    }

    // Check if email is verified (skip for Google sign-in users)
    if (!currentUser.emailVerified && currentUser.providerData[0].providerId === 'password') {
      alert('Please verify your email before using the summarizer. Check your inbox!');
      return;
    }

    if (!notes.trim()) {
      alert('Please enter some notes to summarize!');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await summarizeText(notes);
      setSummary(result);
    } catch (error) {
      alert('Error: ' + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  const handleClear = () => {
    setNotes('');
    setSummary('');
  };

  const handleSave = () => {
    // We'll implement Firebase save later
    alert('Save functionality coming soon!');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`homepage ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">📘</span>
          <span className="logo-text">Glade</span>
        </div>
        <div className="header-actions">
          {currentUser ? (
            <>
              <span className="user-email">{currentUser.email}</span>
              <button 
                className="logout-btn" 
                onClick={async () => {
                  await signOut(auth);
                  setSummary('');
                  setNotes('');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Text */}
        <div className="hero-section">
          <h1 className="hero-title">Transform Your Notes into Clear Summaries</h1>
          <p className="hero-subtitle">Paste your study notes and let AI do the work</p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="textarea-container">
            <textarea
              className="notes-input"
              placeholder="Paste your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={MAX_CHARACTERS}
            />
            <div className="character-counter">
              {notes.length} / {MAX_CHARACTERS}
            </div>
          </div>

          <button 
            className="summarize-button"
            onClick={handleSummarize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                🤖 Summarize with AI
              </>
            )}
          </button>
        </div>

        {/* Summary Output Section - Only shows after summarizing */}
        {summary && (
          <div className="output-section">
            <h2 className="output-title">✅ Your Summary</h2>
            <div className="summary-box">
              <p className="summary-text">{summary}</p>
            </div>
            <div className="action-buttons">
              <button className="action-btn save-btn" onClick={handleSave}>
                💾 Save
              </button>
              <button className="action-btn copy-btn" onClick={handleCopy}>
                📋 Copy
              </button>
              <button className="action-btn clear-btn" onClick={handleClear}>
                🗑️ Clear
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Homepage;