import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api";

function ConflictResolution() {
  const [conflicts, setConflicts] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConflicts();
    fetchRooms();
  }, []);

  const fetchConflicts = async () => {
    try {
      const response = await axios.get(`${API_URL}/schedule/conflicts`);
      setConflicts(response.data.conflicts);
      setSchedule(response.data.schedule);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch conflicts");
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/schedule/rooms`);
      setRooms(response.data);
    } catch (error) {
      toast.error("Failed to fetch rooms");
    }
  };

  const handleResolveConflict = async (conflictId, resolution) => {
    try {
      toast.loading("Resolving conflict...", { id: "resolve-conflict" });
      await axios.post(`${API_URL}/schedule/resolve-conflict`, {
        conflictId,
        resolution,
      });
      toast.success("Conflict resolved successfully!", {
        id: "resolve-conflict",
      });
      fetchConflicts();
    } catch (error) {
      toast.error("Failed to resolve conflict", { id: "resolve-conflict" });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleResolveAllConflicts = async () => {
    try {
      setLoading(true);

      // Resolve all conflicts automatically
      for (const conflict of conflicts) {
        if (conflict.type === "room") {
          // Auto-assign first available room
          const availableRoom = rooms.find(
            (room) => !conflicts.some((c) => c.suggestedRoom === room._id)
          );
          if (availableRoom) {
            await handleResolveConflict(conflict._id, {
              type: "changeRoom",
              roomId: availableRoom._id,
            });
          }
        } else {
          // Auto-reschedule to first available slot
          const availableSlot = schedule.availableSlots[0];
          if (availableSlot) {
            await handleResolveConflict(conflict._id, {
              type: "reschedule",
              slot: JSON.stringify(availableSlot),
            });
          }
        }
      }

      // Refresh conflicts after resolution
      await fetchConflicts();
      setLoading(false);
    } catch (error) {
      toast.error("Failed to resolve all conflicts");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Background Layers - matching HomePage */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-cyan-400/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-500/10 to-emerald-400/20"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Conflict Resolution
          </h1>
          <p className="text-blue-100 text-lg">
            Review and resolve scheduling conflicts automatically
          </p>
        </div>

        {/* Conflicts Summary */}
        {conflicts.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {conflicts.length} Conflict
                {conflicts.length !== 1 ? "s" : ""}
              </h2>
              <button
                onClick={handleResolveAllConflicts}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Resolving..." : "Resolve All Conflicts"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600 font-semibold">Room Conflicts</div>
                <div className="text-2xl font-bold text-red-700">
                  {conflicts.filter((c) => c.type === "room").length}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-orange-600 font-semibold">
                  Instructor Conflicts
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {conflicts.filter((c) => c.type === "instructor").length}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-600 font-semibold">Total Issues</div>
                <div className="text-2xl font-bold text-blue-700">
                  {conflicts.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {conflicts.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="text-green-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Conflicts Found!
            </h2>
            <p className="text-gray-600">
              Your timetable is conflict-free and ready to use.
            </p>
          </div>
        )}

        {/* Individual Conflicts */}
        {conflicts.map((conflict) => (
          <div
            key={conflict._id}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <div
                className={`w-4 h-4 rounded-full mr-3 ${
                  conflict.type === "room" ? "bg-red-500" : "bg-orange-500"
                }`}
              ></div>
              <h2 className="text-xl font-bold text-gray-900">
                {conflict.type === "room"
                  ? "Room Conflict"
                  : "Instructor Conflict"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-600">Day</div>
                <div className="text-lg text-gray-900">{conflict.day}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-600">Time</div>
                <div className="text-lg text-gray-900">
                  {conflict.startTime}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-600">
                  Affected Courses
                </div>
                <div className="text-sm text-gray-900">
                  {conflict.courses.map((c) => c.name).join(", ")}
                </div>
              </div>
            </div>
            {conflict.type === "room" && (
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select new room:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) =>
                    handleResolveConflict(conflict._id, {
                      type: "changeRoom",
                      roomId: e.target.value,
                    })
                  }
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Reschedule:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  handleResolveConflict(conflict._id, {
                    type: "reschedule",
                    slot: e.target.value,
                  })
                }
              >
                <option value="">Select a new time slot</option>
                {schedule.availableSlots.map((slot) => (
                  <option
                    key={`${slot.day}-${slot.startTime}`}
                    value={JSON.stringify(slot)}
                  >
                    {slot.day} - {slot.startTime}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConflictResolution;
