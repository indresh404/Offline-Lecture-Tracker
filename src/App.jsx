import { useEffect, useState, useRef } from "react";
import DayCard from "./components/DayCard";
import ProgressCircle from "./components/ProgressCircle";
import "./App.css";
import "./styles/daycard.css";
import "./styles/progress.css";
import "./styles/video.css";

export default function App() {
  const [data, setData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const sidebarRef = useRef(null);
  const dayRefs = useRef([]);
  const [visibleDays, setVisibleDays] = useState(new Set());

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/lectures")
      .then(res => res.json())
      .then(json => {
        setData(json);
        if (json.days.length > 0) {
          setSelectedDay(json.days[0].day);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const newVisibleDays = new Set();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const sidebarCenter = sidebarRect.top + sidebarRect.height / 2;

      dayRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const dayRect = ref.getBoundingClientRect();
        const dayCenter = dayRect.top + dayRect.height / 2;
        const distanceFromCenter = Math.abs(dayCenter - sidebarCenter);
        const viewportThreshold = sidebarRect.height / 2;

        // If day is within the viewport center area
        if (distanceFromCenter < viewportThreshold) {
          newVisibleDays.add(index);
        }
      });

      setVisibleDays(newVisibleDays);
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll);
      // Initial check
      setTimeout(handleScroll, 100);
      return () => sidebar.removeEventListener('scroll', handleScroll);
    }
  }, [data]);

  useEffect(() => {
    // Reset refs when data changes
    dayRefs.current = dayRefs.current.slice(0, data?.days?.length || 0);
  }, [data]);

  if (!data) return <div className="loading-container"><div className="loading-spinner"></div></div>;

  // Calculate progress for each day
  const dayProgress = data.days.map(day => {
    const videos = day.files.filter(f => f.endsWith(".mp4"));
    const completedVideos = videos.filter(video => 
      localStorage.getItem(`AIML::${day.day}::${video}`) === "true"
    );
    return {
      day: day.day,
      progress: videos.length ? Math.round((completedVideos.length / videos.length) * 100) : 0,
      completed: videos.length > 0 && videos.length === completedVideos.length,
      videoCount: videos.length
    };
  });

  // Calculate dynamic styling based on visibility and selection
  const getDayStyle = (index) => {
    const dayInfo = dayProgress[index];
    const isActive = selectedDay === dayInfo.day;
    const isVisible = visibleDays.has(index);
    
    // Base scale: 0.94 for far away, up to 1.02 for center
    let scale = isVisible ? 1.0 : 0.94;
    
    // Boost scale for active day
    if (isActive) {
      scale = Math.max(scale, 1.02);
    }
    
    // Boost scale for very visible days (near center)
    if (isVisible) {
      scale += 0.02;
    }
    
    // Opacity based on visibility and selection
    let opacity = isVisible ? 0.9 : 0.7;
    if (isActive) {
      opacity = 1;
    }
    
    // Blur based on visibility
    let blur = isVisible ? 0.3 : 0.8;
    if (isActive) {
      blur = 0;
    }

    return {
      transform: `scale(${scale})`,
      opacity: opacity,
      filter: `blur(${blur}px)`,
      zIndex: isActive ? 10 : isVisible ? 5 : 1,
    };
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="course-info">
            <h2 className="course-title">{data.course}</h2>
            <p className="course-subtitle">Interactive Learning Platform<br/>Indresh404</p>
          </div>
          <div className="progress-summary">
            <ProgressCircle 
              data={data} 
              progressVersion={progressVersion} 
              size={140}
            />
          </div>
        </div>
        
        <div className="days-list-scroll">
          <div className="days-list">
            {dayProgress.map((dayInfo, index) => (
              <div 
                key={dayInfo.day}
                ref={el => dayRefs.current[index] = el}
                className={`day-nav-item ${selectedDay === dayInfo.day ? 'active' : ''} ${dayInfo.completed ? 'completed' : ''}`}
                onClick={() => setSelectedDay(dayInfo.day)}
                style={getDayStyle(index)}
              >
                <div className="day-nav-content">
                  <div className="day-title-container">
                    <span className={`day-title ${dayInfo.completed ? 'completed-text' : ''}`}>
                      {dayInfo.day}
                    </span>
                    {dayInfo.completed && (
                      <div className="completion-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="day-metadata">
                    <span className="video-count">{dayInfo.videoCount} lectures</span>
                    <span className="day-percent">{dayInfo.progress}%</span>
                  </div>
                  
                  <div className="day-progress-track">
                    <div 
                      className="day-progress-fill" 
                      style={{ width: `${dayInfo.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="scroll-hint">
            <span>Scroll to navigate days</span>
            <div className="scroll-animation">
              <div className="scroll-dot"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-scroll">
          <div className="content-area">
            {selectedDay && data.days
              .filter(day => day.day === selectedDay)
              .map(day => (
                <div key={day.day} className="selected-day-content">
                  <div className="day-header-glow">
                    <div className="glow-effect"></div>
                    <h1 className="day-title-main">{day.day}</h1>
                    <div className="day-stats">
                      <span className="stat">
                        <span className="stat-number">
                          {day.files.filter(f => f.endsWith('.mp4')).length}
                        </span>
                        <span className="stat-label">Videos</span>
                      </span>
                      <span className="stat-divider">•</span>
                      <span className="stat">
                        <span className="stat-number">
                          {day.files.filter(f => f.endsWith('.mp4')).filter(video => 
                            localStorage.getItem(`AIML::${day.day}::${video}`) === "true"
                          ).length}
                        </span>
                        <span className="stat-label">Completed</span>
                      </span>
                    </div>
                  </div>
                  
                  <DayCard
                    day={day}
                    notifyChange={() => setProgressVersion(prev => prev + 1)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}