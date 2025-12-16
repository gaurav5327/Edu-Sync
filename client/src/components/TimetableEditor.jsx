"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  Edit3,
  Save,
  X,
  Eye,
  Clock,
  BookOpen,
  Building,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Move,
  GripVertical,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/schedule";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
];

// Draggable Slot Component
function DraggableSlot({
  id,
  slot,
  day,
  timeSlot,
  isSelected,
  isDragMode,
  onSlotClick,
  onDeleteSlot,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDragMode || !slot });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDeleteSlot) {
      onDeleteSlot(day, timeSlot);
    }
  };

  // Use droppable for empty slots
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: id,
    disabled: !isDragMode,
  });

  if (!slot) {
    // Empty slot - can be a drop target
    return (
      <td
        ref={isDragMode ? setDroppableRef : setNodeRef}
        className={`py-4 px-6 border-b border-gray-200 bg-gray-50 transition-all duration-200 min-h-[80px] ${
          isDragMode
            ? `border-2 border-dashed ${
                isOver 
                  ? "border-indigo-500 bg-indigo-100 scale-105" 
                  : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
              }`
            : ""
        } ${isSelected ? "ring-2 ring-indigo-500 bg-indigo-50" : ""} ${
          !isDragMode && onSlotClick ? "cursor-pointer hover:bg-indigo-100" : ""
        }`}
        onClick={() => !isDragMode && onSlotClick && onSlotClick(day, timeSlot)}
      >
        <div className="flex items-center justify-center h-full min-h-[60px]">
          <p className={`text-center text-sm transition-all duration-200 ${
            isDragMode && isOver 
              ? "text-indigo-600 font-semibold" 
              : "text-gray-400"
          }`}>
            {isDragMode 
              ? (isOver ? "Drop here!" : "Drop here") 
              : "No class scheduled"
            }
          </p>
        </div>
      </td>
    );
  }

  return (
    <td
      ref={setNodeRef}
      style={style}
      className={`py-4 px-6 border-b border-gray-200 transition-all duration-200 relative group ${
        slot.course?.lectureType === "lab"
          ? "bg-blue-50 border-l-4 border-blue-400"
          : "bg-green-50 border-l-4 border-green-400"
      } ${isSelected ? "ring-2 ring-indigo-500 bg-indigo-50" : ""} ${
        isDragMode ? "cursor-grab active:cursor-grabbing hover:shadow-lg" : ""
      } ${
        !isDragMode && onSlotClick ? "cursor-pointer hover:bg-indigo-100" : ""
      } ${isDragging ? "opacity-50 shadow-2xl scale-105 z-50" : ""}`}
      onClick={() => !isDragMode && onSlotClick && onSlotClick(day, timeSlot)}
      {...(isDragMode ? { ...attributes, ...listeners } : {})}
    >
      <div className="space-y-1 relative">
        {isDragMode && (
          <>
            <div className="absolute -top-1 -right-1 flex gap-1">
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                title="Delete this block"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <div className="bg-gray-500 text-white rounded-full p-1">
                <GripVertical className="w-3 h-3" />
              </div>
            </div>
          </>
        )}
        <p className="font-semibold text-gray-900 text-sm">
          {slot.course?.name || "Unnamed Course"}
        </p>
        <p className="text-xs text-gray-600">
          {slot.course?.instructor?.name || "No Instructor"}
        </p>
        <p className="text-xs text-gray-600 flex items-center">
          <Building className="w-3 h-3 mr-1" />
          {slot.room?.name || "No Room"}
        </p>
        {slot.course?.lectureType === "lab" && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">
            Lab
          </span>
        )}
      </div>
    </td>
  );
}

// Delete Zone Component
function DeleteZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: "delete-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-6 p-6 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
        isOver
          ? "border-red-500 bg-red-200 scale-105"
          : "border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100"
      }`}
    >
      <div className="flex items-center justify-center space-x-2 text-red-600">
        <Trash2 className="w-6 h-6" />
        <span className="text-lg font-semibold">Delete Zone</span>
      </div>
      <p className="text-red-500 text-sm mt-2">
        {isOver
          ? "Release to delete this schedule block"
          : "Drag schedule blocks here to delete them, or use the delete button on each block"}
      </p>
    </div>
  );
}

// Drag Overlay Component
function DragOverlayContent({ slot }) {
  if (!slot) return null;

  return (
    <div
      className={`p-4 rounded-lg shadow-2xl border-2 border-indigo-400 cursor-grabbing z-50 ${
        slot.course?.lectureType === "lab" ? "bg-blue-100" : "bg-green-100"
      }`}
      style={{
        pointerEvents: 'none', // Prevent interference with drop detection
        position: 'fixed', // Ensure proper positioning
        zIndex: 9999, // Ensure it's on top
        transform: 'rotate(3deg) scale(1.05)', // Apply transform directly
        transformOrigin: 'center center',
      }}
    >
      <div className="space-y-1">
        <p className="font-semibold text-gray-900 text-sm">
          {slot.course?.name || "Unnamed Course"}
        </p>
        <p className="text-xs text-gray-600">
          {slot.course?.instructor?.name || "No Instructor"}
        </p>
        <p className="text-xs text-gray-600 flex items-center">
          <Building className="w-3 h-3 mr-1" />
          {slot.room?.name || "No Room"}
        </p>
      </div>
    </div>
  );
}

function TimetableEditor() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotData, setSlotData] = useState({
    courseId: "",
    roomId: "",
  });
  const [dragMode, setDragMode] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSchedule, setOriginalSchedule] = useState(null);

  // Configure sensors for drag and drop (desktop and mobile)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Minimal distance for immediate response
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50, // Minimal delay for better touch response
        tolerance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedSchedule) {
      fetchScheduleDetails(selectedSchedule);
    } else {
      setCurrentSchedule(null);
    }
  }, [selectedSchedule]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}/timetables`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Error fetching schedules. Please try again.");
    }
  };

  const fetchScheduleDetails = async (scheduleId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/timetables/${scheduleId}`);
      setCurrentSchedule(response.data);
      setOriginalSchedule(JSON.parse(JSON.stringify(response.data))); // Deep copy for comparison
      setHasChanges(false);
      setError("");
    } catch (error) {
      console.error("Error fetching schedule details:", error);
      setError("Error fetching schedule details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses-all`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error fetching courses. Please try again.");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Error fetching rooms. Please try again.");
    }
  };

  const handleSlotClick = (day, timeSlot) => {
    if (!editMode) return;

    const existingSlot = currentSchedule.timetable.find(
      (slot) => slot.day === day && slot.startTime === timeSlot
    );

    setSelectedSlot({ day, timeSlot });
    setSlotData({
      courseId: existingSlot?.course?._id || "",
      roomId: existingSlot?.room?._id || "",
    });
  };

  const handleSlotDataChange = (e) => {
    const { name, value } = e.target;
    setSlotData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSlot = async () => {
    if (!selectedSlot || !slotData.courseId || !slotData.roomId) {
      toast.error("Please select a course and room");
      return;
    }

    setLoading(true);
    try {
      toast.loading("Updating schedule...", { id: 'save-slot' });
      const changes = [
        {
          day: selectedSlot.day,
          timeSlot: selectedSlot.timeSlot,
          courseId: slotData.courseId,
          roomId: slotData.roomId,
        },
      ];

      await axios.post(`${API_URL}/manual-schedule-change`, {
        scheduleId: selectedSchedule,
        changes,
      });

      await fetchScheduleDetails(selectedSchedule);
      toast.success("Schedule updated successfully", { id: 'save-slot' });
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
      if (error.response?.data?.conflicts) {
        toast.error(
          `Error: ${
            error.response.data.message
          }. Conflicts detected: ${error.response.data.conflicts
            .map((c) => c.message)
            .join(", ")}`,
          { id: 'save-slot' }
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Error updating schedule. Please try again.",
          { id: 'save-slot' }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedSlot(null);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (selectedSlot) {
      setSelectedSlot(null);
    }
  };

  const handleToggleDragMode = () => {
    setDragMode(!dragMode);
    setEditMode(false);
    if (selectedSlot) {
      setSelectedSlot(null);
    }
  };

  // Delete slot handler
  const handleDeleteSlot = (day, timeSlot) => {
    if (!currentSchedule) return;

    // Remove the slot from the timetable
    const updatedTimetable = currentSchedule.timetable.filter(
      (slot) => !(slot.day === day && slot.startTime === timeSlot)
    );

    setCurrentSchedule({
      ...currentSchedule,
      timetable: updatedTimetable,
    });
    setHasChanges(true);
    toast.success(`Deleted schedule block from ${day} at ${timeSlot}`);
  };

  // Drag and Drop handlers
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    console.log("Drag started:", event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      console.log("Dragging over:", over.id);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    console.log("Drag ended:", { active: active?.id, over: over?.id });

    if (!over) {
      console.log("No drop target found");
      return;
    }

    if (active.id === over.id) {
      console.log("Dropped on same position");
      return;
    }

    // Handle delete zone
    if (over.id === "delete-zone") {
      const [sourceDay, sourceTime] = active.id.split("-");
      handleDeleteSlot(sourceDay, sourceTime);
      return;
    }

    // Parse the drag source and drop target
    const [sourceDay, sourceTime] = active.id.split("-");
    const [targetDay, targetTime] = over.id.split("-");

    console.log("Moving from:", sourceDay, sourceTime, "to:", targetDay, targetTime);

    // Find the source slot
    const sourceSlot = currentSchedule.timetable.find(
      (slot) => slot.day === sourceDay && slot.startTime === sourceTime
    );

    if (!sourceSlot) {
      console.log("Source slot not found");
      return;
    }

    // Check if target slot is occupied
    const targetSlot = currentSchedule.timetable.find(
      (slot) => slot.day === targetDay && slot.startTime === targetTime
    );

    // Validate the move (check for conflicts)
    const conflicts = validateMove(
      sourceSlot,
      targetDay,
      targetTime,
      targetSlot
    );
    if (conflicts.length > 0) {
      toast.error(`Cannot move: ${conflicts.join(", ")}`);
      return;
    }

    // Update the schedule
    const updatedTimetable = currentSchedule.timetable.map((slot) => {
      if (slot.day === sourceDay && slot.startTime === sourceTime) {
        // Update source slot to new position
        return { ...slot, day: targetDay, startTime: targetTime };
      }
      if (
        targetSlot &&
        slot.day === targetDay &&
        slot.startTime === targetTime
      ) {
        // Move target slot to source position (swap)
        return { ...slot, day: sourceDay, startTime: sourceTime };
      }
      return slot;
    });

    setCurrentSchedule({
      ...currentSchedule,
      timetable: updatedTimetable,
    });
    setHasChanges(true);
    toast.success(
      `Moved ${sourceSlot.course?.name} from ${sourceDay} ${sourceTime} to ${targetDay} ${targetTime}`
    );
  };

  // Validate if a move is allowed
  const validateMove = (sourceSlot, targetDay, targetTime, targetSlot) => {
    const conflicts = [];

    // Check for instructor conflicts
    const instructorConflict = currentSchedule.timetable.find(
      (slot) =>
        slot.day === targetDay &&
        slot.startTime === targetTime &&
        slot.course?.instructor?._id === sourceSlot.course?.instructor?._id &&
        slot !== targetSlot
    );

    if (instructorConflict) {
      conflicts.push(
        `Instructor ${sourceSlot.course?.instructor?.name} is already scheduled at this time`
      );
    }

    // Check for room conflicts (if not swapping)
    if (!targetSlot) {
      const roomConflict = currentSchedule.timetable.find(
        (slot) =>
          slot.day === targetDay &&
          slot.startTime === targetTime &&
          slot.room?._id === sourceSlot.room?._id
      );

      if (roomConflict) {
        conflicts.push(
          `Room ${sourceSlot.room?.name} is already occupied at this time`
        );
      }
    }

    return conflicts;
  };

  // Save all changes to backend
  const handleSaveAllChanges = async () => {
    if (!hasChanges) return;

    setLoading(true);
    try {
      toast.loading("Saving changes...", { id: 'save-changes' });
      await axios.put(`${API_URL}/timetables/${selectedSchedule}`, {
        timetable: currentSchedule.timetable,
      });

      setOriginalSchedule(JSON.parse(JSON.stringify(currentSchedule)));
      setHasChanges(false);
      toast.success("All changes saved successfully!", { id: 'save-changes' });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error(
        error.response?.data?.message ||
          "Error saving changes. Please try again.",
        { id: 'save-changes' }
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset changes
  const handleResetChanges = () => {
    if (originalSchedule) {
      setCurrentSchedule(JSON.parse(JSON.stringify(originalSchedule)));
      setHasChanges(false);
      toast.success("Changes reset successfully");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
          <Edit3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Timetable Editor
          </h2>
          <p className="text-gray-600 text-sm">
            Edit and modify existing timetables
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Schedule Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Select Schedule to Edit
          </h3>
        </div>

        <select
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">Select a schedule</option>
          {schedules.map((schedule) => (
            <option key={schedule._id} value={schedule._id}>
              Year {schedule.year} - {schedule.branch} - Division{" "}
              {schedule.division}
            </option>
          ))}
        </select>
      </div>

      {selectedSchedule && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleToggleEditMode}
              className={`group flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                editMode
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Exit Edit Mode</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Enter Edit Mode</span>
                </>
              )}
            </button>

            <button
              onClick={handleToggleDragMode}
              className={`group flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                dragMode
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              }`}
            >
              {dragMode ? (
                <>
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Exit Drag Mode</span>
                </>
              ) : (
                <>
                  <Move className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Enable Drag & Drop</span>
                </>
              )}
            </button>

            {hasChanges && (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAllChanges}
                  disabled={loading}
                  className={`group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetChanges}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>

          {editMode && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Click on any cell in the timetable to edit that time slot
              </p>
            </div>
          )}

          {dragMode && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 flex items-center">
                <Move className="w-4 h-4 mr-2" />
                Drag and drop schedule blocks to rearrange them. Empty cells can
                receive dropped items.
              </p>
            </div>
          )}

          {hasChanges && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                You have unsaved changes. Don't forget to save your
                modifications!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Timetable Display */}
      {!loading && currentSchedule ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2 text-green-600" />
              Year {currentSchedule.year} - {currentSchedule.branch} - Division{" "}
              {currentSchedule.division}
            </h3>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
                  <tr>
                    <th className="py-4 px-6 border-b border-gray-200 font-bold text-gray-700">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="py-4 px-6 border-b border-gray-200 font-bold text-gray-700"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <SortableContext
                    items={currentSchedule.timetable.map(
                      (slot) => `${slot.day}-${slot.startTime}`
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {TIME_SLOTS.map((timeSlot) => (
                      <tr
                        key={timeSlot.value}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                          {timeSlot.label}
                        </td>
                        {DAYS.map((day) => {
                          const slot = currentSchedule.timetable.find(
                            (s) =>
                              s.day === day && s.startTime === timeSlot.value
                          );
                          const isSelected =
                            selectedSlot &&
                            selectedSlot.day === day &&
                            selectedSlot.timeSlot === timeSlot.value;
                          const slotId = `${day}-${timeSlot.value}`;

                          return (
                            <DraggableSlot
                              key={slotId}
                              id={slotId}
                              slot={slot}
                              day={day}
                              timeSlot={timeSlot.value}
                              isSelected={isSelected}
                              isDragMode={dragMode}
                              onSlotClick={editMode ? handleSlotClick : null}
                              onDeleteSlot={dragMode ? handleDeleteSlot : null}
                            />
                          );
                        })}
                      </tr>
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </div>

            <DragOverlay>
              {activeId ? (
                <DragOverlayContent
                  slot={currentSchedule.timetable.find(
                    (slot) => `${slot.day}-${slot.startTime}` === activeId
                  )}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Delete Zone - Only visible in drag mode */}
          {dragMode && <DeleteZone />}

          {/* Edit Slot Modal */}
          {selectedSlot && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Slot: {selectedSlot.day} at {selectedSlot.timeSlot}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label
                    htmlFor="courseId"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Course
                  </label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={slotData.courseId}
                    onChange={handleSlotDataChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code}) - {course.lectureType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="roomId"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    <Building className="w-4 h-4 inline mr-1" />
                    Room
                  </label>
                  <select
                    id="roomId"
                    name="roomId"
                    value={slotData.roomId}
                    onChange={handleSlotDataChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.name} ({room.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="group flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveSlot}
                  disabled={loading}
                  className={`group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : !loading && selectedSchedule ? (
        <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200">
          <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Schedule
          </h3>
          <p className="text-gray-600">
            Please wait while we load the timetable...
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200">
          <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select a Schedule
          </h3>
          <p className="text-gray-600">
            Choose a schedule from the dropdown to view and edit.
          </p>
        </div>
      )}
    </div>
  );
}

export default TimetableEditor;
