const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00", // Lunch break
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];
const LUNCH_BREAK_SLOT = "12:00";

function ScheduleDisplay({ schedule }) {
  if (!schedule || !schedule.timetable) {
    return (
      <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200">
        <p className="text-gray-700 font-medium">No schedule data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Timetable • Year {schedule.year}, {schedule.branch}, Division {schedule.division}
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Time</th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 border-r">
                    {timeSlot}
                  </td>
                  {DAYS.map((day) => {
                    // Check if this is lunch break time
                    if (timeSlot === LUNCH_BREAK_SLOT) {
                      return (
                        <td
                          key={`${day}-${timeSlot}`}
                          className="align-top px-6 py-4 text-sm text-gray-700 border-r bg-orange-50/60"
                        >
                          <div className="text-center">
                            <span className="inline-flex items-center text-orange-600 font-medium">
                              🍽️ Lunch Break
                            </span>
                          </div>
                        </td>
                      );
                    }

                    const slot = schedule.timetable.find(
                      (s) => s.day === day && s.startTime === timeSlot
                    );
                    const isLab = slot?.course?.lectureType === "lab";
                    const isTheory = slot?.course?.lectureType === "theory";
                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        className={`align-top px-6 py-4 text-sm text-gray-700 border-r ${
                          isLab ? "bg-blue-50/60" : ""
                        }`}
                      >
                        {slot ? (
                          slot.isFree ? (
                            <span className="inline-flex items-center text-gray-400">Free Period</span>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-baseline flex-wrap gap-2">
                                <span className="font-semibold text-gray-900">
                                  {slot.course?.name || "Unnamed Course"}
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                  ({slot.course?.code || "No Code"})
                                </span>
                              </div>
                              <div className="text-sm text-gray-700">
                                {slot.course?.instructor?.name || "No Instructor"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {slot.room?.name || "No Room"}
                              </div>
                              <div className="pt-1">
                                {isLab && (
                                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-lg">
                                    {slot.isLabFirst
                                      ? "Lab (First Hour)"
                                      : slot.isLabSecond
                                      ? "Lab (Second Hour)"
                                      : "Lab"}
                                  </span>
                                )}
                                {isTheory && (
                                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg">
                                    Theory
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-gray-400">No class scheduled</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDisplay;
