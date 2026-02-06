import VideoItem from "./VideoItem";

export default function DayCard({ day, notifyChange }) {
  return (
    <div className="day-content">
      {day.files
        .sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true })
        )
        .filter(f => f.endsWith(".mp4"))
        .map(file => (
          <VideoItem
            key={file}
            day={day.day}
            file={file}
            notifyChange={notifyChange}
          />
        ))}
    </div>
  );
}