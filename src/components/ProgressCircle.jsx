export default function ProgressCircle({ data, progressVersion, size = 140 }) {
  const allVideos = data.days.flatMap(d =>
    d.files.filter(f => f.endsWith(".mp4")).map(f => ({ day: d.day, file: f }))
  );

  const completedVideos = allVideos.filter(v =>
    localStorage.getItem(`AIML::${v.day}::${v.file}`) === "true"
  );

  const percent = allVideos.length
    ? Math.round((completedVideos.length / allVideos.length) * 100)
    : 0;

  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-circle-container">
      <div className="progress-circle-wrapper">
        <svg width={size} height={size}>
          {/* Background gradient circle */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth="4"
            fill="none"
          />
          
          {/* Progress circle with gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ 
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
            }}
          />
        </svg>
        
        <div className="circle-percentage">
          <span className="percentage">{percent}%</span>
          <span className="label">
            {completedVideos.length} of {allVideos.length}
          </span>
        </div>
      </div>
    </div>
  );
}