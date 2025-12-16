// client/src/components/MobileTimetable.jsx
function MobileTimetable({ schedule }) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

  if (viewMode === 'day') {
    return (
      <div className="mobile-timetable">
        {/* Day selector */}
        <div className="flex overflow-x-auto space-x-2 p-4">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedDay === day 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Day view */}
        <div className="space-y-2 p-4">
          {TIME_SLOTS.map(timeSlot => {
            const slot = schedule.timetable.find(
              s => s.day === selectedDay && s.startTime === timeSlot
            );
            
            return (
              <div key={timeSlot} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600 mb-2">
                  {timeSlot}
                </div>
                {slot ? (
                  <div>
                    <div className="font-semibold">{slot.course?.name}</div>
                    <div className="text-sm text-gray-600">
                      {slot.course?.instructor?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {slot.room?.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Free Period</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <WeekView schedule={schedule} />;
}