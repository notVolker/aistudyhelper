import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSummaries, deleteSummary } from '../services/firestoreService';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './History.css';

function History() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    loadSummaries();
  }, [currentUser, navigate]);

  const loadSummaries = async () => {
    setLoading(true);
    try {
      const result = await getSummaries(currentUser.uid);
      if (result.success) {
        setSummaries(result.summaries);
      } else {
        alert('Failed to load summaries: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (summaryId) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) {
      return;
    }

    try {
      const result = await deleteSummary(currentUser.uid, summaryId);
      if (result.success) {
        // Remove from local state
        setSummaries(summaries.filter(s => s.id !== summaryId));
        alert('✅ Summary deleted!');
      } else {
        alert('❌ Failed to delete: ' + result.error);
      }
    } catch (error) {
      alert('Error deleting summary: ' + error.message);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredSummaries = summaries.filter(summary => 
    summary.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    summary.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`history-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">📘</span>
          <span className="logo-text">Glade</span>
        </div>
        <div className="header-actions">
          <span className="user-email">{currentUser?.email}</span>
          <button 
            className="logout-btn" 
            onClick={async () => {
              await signOut(auth);
              navigate('/login');
            }}
          >
            Logout
          </button>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="history-content">
        <div className="history-header">
          <h1>📚 Your Summary History</h1>
          <p className="subtitle">View and manage all your saved summaries</p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search your summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your summaries...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && summaries.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No summaries yet</h2>
            <p>Start by creating your first summary on the homepage!</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Create Summary
            </button>
          </div>
        )}

        {/* Summaries List */}
        {!loading && filteredSummaries.length > 0 && (
          <div className="summaries-list">
            <p className="result-count">
              Showing {filteredSummaries.length} of {summaries.length} summaries
            </p>
            
            {filteredSummaries.map((summary) => (
              <div key={summary.id} className="summary-card">
                <div className="summary-header">
                  <span className="summary-date">
                    📅 {formatDate(summary.createdAt)}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(summary.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
                
                <div className="summary-content">
                  <div className="notes-preview">
                    <strong>Original Notes:</strong>
                    <p>{summary.notes?.substring(0, 150)}...</p>
                  </div>
                  
                  <div className="summary-preview">
                    <strong>Summary:</strong>
                    <p>{summary.summary?.substring(0, 200)}...</p>
                  </div>
                </div>

                <button 
                  className="view-full-btn"
                  onClick={() => {
                    // We'll implement this in the next step
                    alert('View full summary - Coming soon!');
                  }}
                >
                  View Full Summary →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Search Results */}
        {!loading && summaries.length > 0 && filteredSummaries.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No results found</h2>
            <p>Try a different search term</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default History;