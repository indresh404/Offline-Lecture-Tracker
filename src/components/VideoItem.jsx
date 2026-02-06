import { useEffect, useState } from "react";

export default function VideoItem({ day, file, notifyChange }) {
  const key = `AIML::${day}::${file}`;
  const timeKey = `${key}_time`;
  const [done, setDone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    const doneStatus = localStorage.getItem(key) === "true";
    setDone(doneStatus);
    
    const savedTime = localStorage.getItem(timeKey);
    if (savedTime) {
      setTimestamp(new Date(savedTime));
    }
  }, []);

  function formatTimestamp(date) {
    if (!date) return "";
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  function toggleDone() {
    const newValue = !done;
    setDone(newValue);
    localStorage.setItem(key, newValue);
    
    if (newValue) {
      const now = new Date();
      localStorage.setItem(timeKey, now.toISOString());
      setTimestamp(now);
    } else {
      localStorage.removeItem(timeKey);
      setTimestamp(null);
    }
    
    notifyChange();
  }

  const getButtonText = () => {
    if (done) {
      return isHovered ? "Mark as Undone" : "Done";
    } else {
      return isHovered ? "Mark as Done" : "Mark";
    }
  };

  return (
    <div className={`video-item ${done ? "completed" : ""}`}>
      <div className="video-header">
        <button
          className={`done-button ${done ? "done" : ""} ${done && isHovered ? "undo" : ""}`}
          onClick={toggleDone}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {done ? (
            <>
              {isHovered ? (
                <div className="undo-icon">↺</div>
              ) : (
                <div className="done-icon">✓</div>
              )}
              <span className="button-text">{getButtonText()}</span>
            </>
          ) : (
            <span className="button-text">{getButtonText()}</span>
          )}
        </button>
        
        <div className="video-info">
          <div className="video-title-section">
            <span className="video-name">{file}</span>
            {done && <span className="completion-badge">Completed</span>}
          </div>
          
        </div>
      </div>
      
      <div className="video-container">
        <video
          controls
          src={`http://127.0.0.1:5000/lectures/${day}/${encodeURIComponent(file)}`}
          onEnded={() => {
            const now = new Date();
            setDone(true);
            setTimestamp(now);
            localStorage.setItem(key, true);
            localStorage.setItem(timeKey, now.toISOString());
            notifyChange();
          }}
        />
      </div>
      
      <div className="video-progress">
        <div className="video-progress-fill" />
      </div>
      
      {done && (
        <div className="auto-complete-message">
          <span className="auto-complete-icon">✓</span>
          Video marked as completed {timestamp && formatTimestamp(timestamp)}
        </div>
      )}
    </div>
  );
}