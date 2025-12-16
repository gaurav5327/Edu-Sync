import { getRandomItem, shuffleArray } from "./arrayUtils.js"

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const LAB_TIME_SLOTS = ["15:00", "16:00"] // Labs should only be scheduled at these times
const LUNCH_BREAK_SLOT = "12:00" // Lunch break at 12:00 PM

let enrollmentMap = new Map()
let BLOCKED = new Set()

export async function generateSchedule(
  courses,
  rooms,
  teachers,
  year,
  branch,
  division,
  students = [],
  program = null,
  practicums = [],
  options = {},
) {
  try {
    console.log("Genetic algorithm starting with:", { courses: courses.length, rooms: rooms.length, teachers: teachers.length })
    
    const {
      enforceExpertise = true,
      enforceElectiveGroupNoClash = true,
      enforceWorkload = true,
      maxWeeklyLoad: overrideMaxWeeklyLoad = null,
      maxDailyLoad: overrideMaxDailyLoad = null,
    } = options

  // Check if we have enough courses to fill the schedule
  const totalSlots = DAYS.length * TIME_SLOTS.length

  // Group courses by their base code (removing any suffixes for lab variants)
  const courseGroups = {}

  courses.forEach((course) => {
    // Extract base code (assuming lab variants have the same code as theory)
    const baseCode = course.code.split("-")[0]
    if (!courseGroups[baseCode]) {
      courseGroups[baseCode] = []
    }
    courseGroups[baseCode].push(course)
  })

  // Calculate available slots (excluding lunch break)
  const availableSlots = totalSlots - DAYS.length // Subtract lunch break slots
  const courseGroupCount = Object.keys(courseGroups).length
  
  // Calculate sessions per course to fill all available slots
  const sessionsPerCourse = Math.floor(availableSlots / courseGroupCount)
  const extraSessions = availableSlots - sessionsPerCourse * courseGroupCount

  // Create a balanced schedule
  const schedule = []
  
  // Note: Lunch break slots are handled by excluding LUNCH_BREAK_SLOT from available time slots
  // No need to add them to the schedule as they don't require course/room assignments

  // Build enrollment map from student elective selections
  enrollmentMap = new Map()
  for (const s of students) {
    if (Array.isArray(s.selectedElectives)) {
      for (const cid of s.selectedElectives) {
        const key = cid.toString()
        enrollmentMap.set(key, (enrollmentMap.get(key) || 0) + 1)
      }
    }
  }

  // Blocked slots from practicum/fieldwork for this cohort
  BLOCKED = new Set()
  for (const p of practicums) {
    for (const d of p.days || []) {
      for (const t of p.timeSlots || []) {
        BLOCKED.add(`${d}-${t}`)
      }
    }
  }

  // First, schedule all lab sessions (they have more constraints)
  for (const baseCode in courseGroups) {
    const coursesInGroup = courseGroups[baseCode]
    const labCourse = coursesInGroup.find((c) => c.lectureType === "lab")
    const theoryCourse = coursesInGroup.find((c) => c.lectureType === "theory")

    if (labCourse) {
      // Schedule one lab session (2 consecutive hours) for this course
      let labScheduled = false

      // Try to schedule in lab time slots
      for (const day of shuffleArray([...DAYS])) {
        if (labScheduled) break

        // Use preferred time slots if specified, otherwise use default lab time slots
        const preferredSlots = labCourse.preferredTimeSlots && labCourse.preferredTimeSlots.length > 0 
          ? labCourse.preferredTimeSlots 
          : LAB_TIME_SLOTS
        
        // Try each preferred time slot systematically instead of randomly
        for (const labStartTime of preferredSlots) {

          // Find suitable lab rooms
          const labRooms = rooms.filter(
            (room) =>
              room.type === "lab" &&
              room.isAvailable &&
              (room.department === labCourse.branch || room.department === "All") &&
              (room.allowedYears.includes(labCourse.year) || room.allowedYears.length === 0),
          )

          if (labRooms.length === 0) continue

          // Use systematic room selection instead of random
          const room = labRooms[0]

          // Check if both consecutive slots are available
          const timeIndex = TIME_SLOTS.indexOf(labStartTime)
          const nextTimeSlot = TIME_SLOTS[timeIndex + 1]
          
          if (!nextTimeSlot || nextTimeSlot === LUNCH_BREAK_SLOT) continue // Skip if no next slot or lunch break
          
          const firstSlotFree = !schedule.some((slot) => slot.day === day && slot.startTime === labStartTime)
          const secondSlotFree = !schedule.some((slot) => slot.day === day && slot.startTime === nextTimeSlot)

          if (firstSlotFree && secondSlotFree) {
            // Add the lab session (spans two time slots)
            const slot1 = {
              course: labCourse,
              day,
              startTime: labStartTime,
              room,
              isLabFirst: true,
            }

            const slot2 = {
              course: labCourse,
              day,
              startTime: nextTimeSlot,
              room,
              isLabSecond: true,
            }

            if (
              safePush(schedule, slot1, teachers, {
                enforceExpertise,
                enforceElectiveGroupNoClash,
                enforceWorkload,
                overrideMaxWeeklyLoad,
                overrideMaxDailyLoad,
              }) &&
              safePush(schedule, slot2, teachers, {
                enforceExpertise,
                enforceElectiveGroupNoClash,
                enforceWorkload,
                overrideMaxWeeklyLoad,
                overrideMaxDailyLoad,
              })
            ) {
              labScheduled = true
              break // Break out of the time slot loop
            }
          }
        } // End of time slot loop
      }

      // If we couldn't schedule the lab with all constraints, try with fewer constraints
      if (!labScheduled) {
        for (const day of shuffleArray([...DAYS])) {
          if (labScheduled) break

          // Use preferred time slots if specified, otherwise use default lab time slots
          const preferredSlots = labCourse.preferredTimeSlots && labCourse.preferredTimeSlots.length > 0 
            ? labCourse.preferredTimeSlots 
            : LAB_TIME_SLOTS
          
          // Try each preferred time slot systematically
          for (const labStartTime of preferredSlots) {
          const availableLabRooms = rooms.filter((r) => r.type === "lab" && r.isAvailable)
          const room = availableLabRooms[0] // Use first available room instead of random

          if (!room) continue

          // Check if both consecutive slots are available
          const timeIndex = TIME_SLOTS.indexOf(labStartTime)
          const nextTimeSlot = TIME_SLOTS[timeIndex + 1]
          
          if (!nextTimeSlot || nextTimeSlot === LUNCH_BREAK_SLOT) continue
          
          const firstSlotFree = !schedule.some((slot) => slot.day === day && slot.startTime === labStartTime)
          const secondSlotFree = !schedule.some((slot) => slot.day === day && slot.startTime === nextTimeSlot)

          if (firstSlotFree && secondSlotFree) {
            // Add the lab session (spans two time slots)
            const slot1 = {
              course: labCourse,
              day,
              startTime: labStartTime,
              room,
              isLabFirst: true,
            }

            const slot2 = {
              course: labCourse,
              day,
              startTime: nextTimeSlot,
              room,
              isLabSecond: true,
            }

            if (
              safePush(schedule, slot1, teachers, {
                enforceExpertise,
                enforceElectiveGroupNoClash,
                enforceWorkload,
                overrideMaxWeeklyLoad,
                overrideMaxDailyLoad,
              }) &&
              safePush(schedule, slot2, teachers, {
                enforceExpertise,
                enforceElectiveGroupNoClash,
                enforceWorkload,
                overrideMaxWeeklyLoad,
                overrideMaxDailyLoad,
              })
            ) {
              labScheduled = true
              break // Break out of time slot loop
            }
          }
          } // End of time slot loop
        }
      }
    }
  }

  // Now schedule theory sessions
  for (const baseCode in courseGroups) {
    const coursesInGroup = courseGroups[baseCode]
    const theoryCourse = coursesInGroup.find((c) => c.lectureType === "theory")

    if (!theoryCourse) continue

    // Determine how many theory sessions this course should have
    let sessionsToSchedule = sessionsPerCourse

    // Distribute extra sessions if needed
    if (extraSessions > 0) {
      sessionsToSchedule++
      extraSessions--
    }

    // Schedule the theory sessions
    let sessionsScheduled = 0

    // Try to distribute across different days
    const availableDays = [...DAYS]

    while (sessionsScheduled < sessionsToSchedule && availableDays.length > 0) {
      const day = availableDays.shift() // Take the next day

      // Find available time slots on this day (excluding lab slots)
      const availableSlots = TIME_SLOTS.filter(
        (slot) => slot !== LUNCH_BREAK_SLOT && !schedule.some((s) => s.day === day && s.startTime === slot),
      )

      if (availableSlots.length === 0) continue

      // Pick the first available slot for systematic scheduling
      const startTime = availableSlots[0]

      // Find suitable rooms
      const suitableRooms = rooms.filter(
        (room) =>
          (room.type === "classroom" || room.type === "lecture-hall") &&
          room.isAvailable &&
          (room.department === theoryCourse.branch || room.department === "All") &&
          (room.allowedYears.includes(theoryCourse.year) || room.allowedYears.length === 0),
      )

      if (suitableRooms.length === 0) continue

      // Use systematic room selection
      const room = suitableRooms[0]

      // Add the theory session
      const slot = {
        course: theoryCourse,
        day,
        startTime,
        room,
      }

      if (
        safePush(schedule, slot, teachers, {
          enforceExpertise,
          enforceElectiveGroupNoClash,
          enforceWorkload,
          overrideMaxWeeklyLoad,
          overrideMaxDailyLoad,
        })
      ) {
        sessionsScheduled++
      }
    }

    // If we couldn't schedule all sessions with day distribution,
    // fill in the remaining sessions wherever possible
    while (sessionsScheduled < sessionsToSchedule) {
      // Find any available slot
      let slotFound = false

      for (const day of shuffleArray([...DAYS])) {
        if (slotFound) break

        for (const startTime of TIME_SLOTS) { // Remove shuffling for systematic scheduling
          if (startTime === LUNCH_BREAK_SLOT) continue // Skip lunch break slot

          // Check if slot is available
          const slotAvailable = !schedule.some((s) => s.day === day && s.startTime === startTime)

          if (slotAvailable) {
            const availableRooms = rooms.filter((r) => (r.type === "classroom" || r.type === "lecture-hall") && r.isAvailable)
            const room = availableRooms[0] // Use first available room

            if (!room) continue

            // Add the theory session
            const slot = {
              course: theoryCourse,
              day,
              startTime,
              room,
            }

            if (
              safePush(schedule, slot, teachers, {
                enforceExpertise,
                enforceElectiveGroupNoClash,
                enforceWorkload,
                overrideMaxWeeklyLoad,
                overrideMaxDailyLoad,
              })
            ) {
              sessionsScheduled++
              slotFound = true
              break
            }
          }
        }
      }

      // If we can't find any more slots, break to avoid infinite loop
      if (!slotFound) break
    }
  }

  // Create a systematic schedule that uses time slots properly
  const finalSchedule = createSystematicSchedule(courses, rooms, teachers, year, branch, division)

  console.log("Genetic algorithm completed successfully")
  return finalSchedule
  } catch (error) {
    console.error("Error in genetic algorithm:", error)
    console.error("Error stack:", error.stack)
    throw error
  }
}

function fillRemainingSlots(schedule, courses, rooms, year, branch, division, teachers, opts) {
  const filledSchedule = [...schedule]

  // Create a map to track which slots are already filled
  const filledSlots = {}

  for (const slot of schedule) {
    const key = `${slot.day}-${slot.startTime}`
    filledSlots[key] = true
  }

  // Get all theory courses to distribute in empty slots
  const theoryCourses = courses.filter((course) => course.lectureType === "theory")

  if (theoryCourses.length === 0) return filledSchedule

  console.log(`fillRemainingSlots: Found ${theoryCourses.length} theory courses`)

  // Fill empty slots with theory courses more aggressively
  let courseIndex = 0
  let roomIndex = 0

  for (const day of DAYS) {
    for (const timeSlot of TIME_SLOTS) {
      const key = `${day}-${timeSlot}`

      if (!filledSlots[key]) {
        // Skip lunch break slot
        if (timeSlot === LUNCH_BREAK_SLOT) continue

        // Get the next theory course (cycling through them)
        const course = theoryCourses[courseIndex % theoryCourses.length]
        courseIndex++

        // Find a suitable room
        const suitableRooms = rooms.filter(
          (room) => (room.type === "classroom" || room.type === "lecture-hall") && room.isAvailable,
        )

        if (suitableRooms.length === 0) continue

        // Use room cycling instead of random selection for better distribution
        const room = suitableRooms[roomIndex % suitableRooms.length]
        roomIndex++

        // Add the theory session
        const slot = {
          course,
          day,
          startTime: timeSlot,
          room,
        }

        // Try safePush first, but if it fails due to conflicts, add anyway to fill slots
        const success = safePush(filledSchedule, slot, teachers, opts)
        if (!success) {
          // If safePush failed, add the slot anyway to ensure all slots are filled
          // This is more aggressive but ensures no blank blocks
          filledSchedule.push(slot)
          console.log(`Force-filled slot: ${day} ${timeSlot} with ${course.name} (conflict ignored)`)
        } else {
          console.log(`Filled slot: ${day} ${timeSlot} with ${course.name}`)
        }
      }
    }
  }

  console.log(`fillRemainingSlots: Final schedule has ${filledSchedule.length} slots`)
  return filledSchedule
}

// The rest of the helper functions remain the same
function isValidAssignment(course, day, startTime, room, schedule, teachers, division, relaxConstraints = false) {
  // Check if the room is available at the given time
  const roomConflict = schedule.find(
    (slot) => slot.day === day && slot.startTime === startTime && slot.room._id.toString() === room._id.toString(),
  )
  if (roomConflict) return false

  // Check if the instructor is available at the given time
  const instructorConflict = schedule.find(
    (slot) =>
      slot.day === day &&
      slot.startTime === startTime &&
      slot.course.instructor._id.toString() === course.instructor._id.toString(),
  )
  if (instructorConflict) return false

  // Get the teacher
  const teacher = teachers.find((t) => t._id.toString() === course.instructor._id.toString())

  if (teacher && !relaxConstraints) {
    // Check if the instructor has availability constraints
    if (teacher.availability && teacher.availability[day] && teacher.availability[day][startTime] === false) {
      return false
    }

    // Check if the instructor is allowed to teach this year
    if (teacher.teachableYears && !teacher.teachableYears.includes(course.year)) {
      return false
    }

    // Check if the instructor is in the same department
    if (teacher.department !== course.branch) {
      return false
    }
  }

  // Labs are restricted to specific time slots - use preferred slots if available
  if (course.lectureType === "lab") {
    const allowedSlots = course.preferredTimeSlots && course.preferredTimeSlots.length > 0 
      ? course.preferredTimeSlots 
      : LAB_TIME_SLOTS
    
    if (!allowedSlots.includes(startTime)) {
      return false
    }
  }

  // Check if the room type matches the course type
  if (course.lectureType === "lab" && room.type !== "lab") {
    return false
  }

  // Check preferred time slots
  if (course.preferredTimeSlots && course.preferredTimeSlots.length > 0 && !relaxConstraints) {
    if (!course.preferredTimeSlots.includes(startTime)) {
      // Not a preferred time slot, but we'll still allow it with a penalty in fitness
      return true
    }
  }

  return true
}

function calculateFitness(schedule, teachers, division) {
  let fitness = schedule.length // Base fitness is the number of scheduled courses

  // Penalize for conflicts
  const conflicts = countConflicts(schedule, teachers, division)
  fitness -= conflicts * 10 // Heavy penalty for conflicts

  // Reward for preferred time slots
  for (const slot of schedule) {
    if (slot.course.preferredTimeSlots && slot.course.preferredTimeSlots.includes(slot.startTime)) {
      fitness += 2 // Bonus for using preferred time slots
    }
  }

  // Reward for lab courses scheduled in proper time slots
  for (const slot of schedule) {
    if (slot.course.lectureType === "lab") {
      fitness += 2 // Bonus for scheduled labs
    }
  }

  // Reward for even distribution of courses across days and time slots
  const distribution = calculateDistribution(schedule)
  fitness += distribution

  // Penalize room over-capacity and student elective clashes
  const enrollmentByCourseId = {}
  for (const slot of schedule) {
    const courseId = slot.course?._id?.toString()
    if (courseId) {
      enrollmentByCourseId[courseId] = (enrollmentByCourseId[courseId] || 0) + 0 // placeholder tally
      const enrolled = slot.course?.enrolledCount || 0
      if (slot.room?.capacity && enrolled && slot.room.capacity < enrolled) {
        fitness -= 8
      }
    }
  }

  return fitness
}

function countConflicts(schedule, teachers, division) {
  let conflicts = 0

  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      if (
        schedule[i].day === schedule[j].day &&
        schedule[i].startTime === schedule[j].startTime &&
        (schedule[i].room._id.toString() === schedule[j].room._id.toString() ||
          schedule[i].course.instructor._id.toString() === schedule[j].course.instructor._id.toString())
      ) {
        conflicts++
      }
    }
  }

  return conflicts
}

function calculateDistribution(schedule) {
  const dayDistribution = {}
  const timeDistribution = {}

  for (const slot of schedule) {
    dayDistribution[slot.day] = (dayDistribution[slot.day] || 0) + 1
    timeDistribution[slot.startTime] = (timeDistribution[slot.startTime] || 0) + 1
  }

  const dayVariance = calculateVariance(Object.values(dayDistribution))
  const timeVariance = calculateVariance(Object.values(timeDistribution))

  // Lower variance means more even distribution, so we return the inverse
  return 100 / (dayVariance + timeVariance + 1)
}

function calculateVariance(numbers) {
  if (numbers.length === 0) return 0
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2))
  return squaredDifferences.reduce((sum, num) => sum + num, 0) / numbers.length
}

function selectParents(population, teachers, division) {
  // Tournament selection
  const tournamentSize = 5
  const parents = []

  for (let i = 0; i < 2; i++) {
    let bestIndividual = getRandomItem(population)
    let bestFitness = calculateFitness(bestIndividual, teachers, division)

    for (let j = 1; j < tournamentSize; j++) {
      const individual = getRandomItem(population)
      const fitness = calculateFitness(individual, teachers, division)

      if (fitness > bestFitness) {
        bestIndividual = individual
        bestFitness = fitness
      }
    }

    parents.push(bestIndividual)
  }

  return parents
}

function crossover(parent1, parent2) {
  const crossoverPoint = Math.floor(Math.random() * parent1.length)
  return [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)]
}

function mutate(schedule, theoryCourses, labCourses, rooms) {
  if (schedule.length === 0) return // Return early if the schedule is empty

  const indexToMutate = Math.floor(Math.random() * schedule.length)
  const slot = schedule[indexToMutate]

  // Randomly change one aspect of the slot
  const mutationType = Math.floor(Math.random() * 3)

  switch (mutationType) {
    case 0: // Change day
      slot.day = getRandomItem(DAYS)
      break
    case 1: // Change time
      // Ensure labs are only scheduled in lab time slots
      if (slot.course.lectureType === "lab") {
        // Use preferred time slots if specified, otherwise use default lab time slots
        const allowedSlots = slot.course.preferredTimeSlots && slot.course.preferredTimeSlots.length > 0 
          ? slot.course.preferredTimeSlots 
          : LAB_TIME_SLOTS
        
        slot.startTime = getRandomItem(allowedSlots)
      } else {
        // For theory courses, avoid lunch break slot
        const theoryTimeSlots = TIME_SLOTS.filter((slot) => slot !== LUNCH_BREAK_SLOT)
        slot.startTime = getRandomItem(theoryTimeSlots)
      }
      break
    case 2: // Change room
      // Ensure room type matches course type
      if (slot.course.lectureType === "lab") {
        const labRooms = rooms.filter((room) => room.type === "lab" && room.isAvailable)
        if (labRooms.length > 0) {
          slot.room = getRandomItem(labRooms)
        }
      } else {
        const theoryRooms = rooms.filter(
          (room) => (room.type === "classroom" || room.type === "lecture-hall") && room.isAvailable,
        )
        if (theoryRooms.length > 0) {
          slot.room = getRandomItem(theoryRooms)
        }
      }
      break
  }
}

function findWorstIndividualIndex(population, teachers, division) {
  let worstIndex = 0
  let worstFitness = calculateFitness(population[0], teachers, division)

  for (let i = 1; i < population.length; i++) {
    const fitness = calculateFitness(population[i], teachers, division)
    if (fitness < worstFitness) {
      worstIndex = i
      worstFitness = fitness
    }
  }

  return worstIndex
}

function safePush(
  schedule,
  slot,
  teachers, {
    enforceExpertise = true,
    enforceElectiveGroupNoClash = true,
    enforceWorkload = true,
    overrideMaxWeeklyLoad = null,
    overrideMaxDailyLoad = null,
  } = {},
) {
  const key = `${slot.day}-${slot.startTime}`
  if (BLOCKED.has(key)) return false

  const enrolled =
    (slot.course?._id && enrollmentMap.get(slot.course._id.toString())) || slot.course?.enrolledCount || 0
  if (slot.room?.capacity && enrolled && slot.room.capacity < enrolled) return false

  const conflict = schedule.some(
    (s) =>
      s.day === slot.day &&
      s.startTime === slot.startTime &&
      (s.room?._id?.toString() === slot.room?._id?.toString() ||
          s.course?.instructor?._id?.toString() === slot.course?.instructor?._id?.toString()),
  )
  if (conflict) return false

  if (enforceElectiveGroupNoClash && slot.course?.isElective && slot.course?.electiveGroup) {
    const eg = slot.course.electiveGroup
    const groupClash = schedule.some(
      (s) =>
        s.day === slot.day &&
        s.startTime === slot.startTime &&
        s.course?.isElective &&
        s.course?.electiveGroup &&
        s.course.electiveGroup === eg,
    )
    if (groupClash) return false
  }

  const t = teachers.find((tt) => tt._id?.toString() === slot.course?.instructor?._id?.toString())
  if (enforceExpertise && t?.expertise?.length) {
    const ok =
      t.expertise.includes(slot.course?.code) || (slot.course?.category && t.expertise.includes(slot.course.category))
    if (!ok) return false
  }

  if (enforceWorkload && t) {
    const weeklyCount = schedule.filter(
      (s) => s.course?.instructor?._id?.toString() === slot.course?.instructor?._id?.toString(),
    ).length
    const dailyCount = schedule.filter(
      (s) =>
        s.course?.instructor?._id?.toString() === slot.course?.instructor?._id?.toString() && s.day === slot.day,
    ).length

    const maxWeekly = overrideMaxWeeklyLoad ?? t.maxWeeklyLoad ?? 20
    const maxDaily = overrideMaxDailyLoad ?? t.maxDailyLoad ?? 5

    if (weeklyCount >= maxWeekly) return false
    if (dailyCount >= maxDaily) return false
  }

  schedule.push(slot)
  return true
}

// Function to ensure all slots are filled (no blank blocks)
function ensureAllSlotsFilled(schedule, courses, rooms, teachers) {
  const filledSchedule = [...schedule]
  
  // Get all theory courses for filling empty slots
  const theoryCourses = courses.filter(c => c.lectureType === "theory")
  
  if (theoryCourses.length === 0) {
    console.log("No theory courses available for filling slots")
    return filledSchedule
  }
  
  // Create a comprehensive list of all possible time slots
  const allSlots = []
  for (const day of DAYS) {
    for (const timeSlot of TIME_SLOTS) {
      if (timeSlot !== LUNCH_BREAK_SLOT) {
        allSlots.push({ day, timeSlot })
      }
    }
  }
  
  console.log(`Total slots to fill: ${allSlots.length}, Currently filled: ${filledSchedule.length}`)
  
  // Track which slots are already filled
  const filledSlots = new Set()
  filledSchedule.forEach(slot => {
    filledSlots.add(`${slot.day}-${slot.startTime}`)
  })
  
  // Fill all empty slots aggressively
  let courseIndex = 0
  let roomIndex = 0
  
  for (const { day, timeSlot } of allSlots) {
    const slotKey = `${day}-${timeSlot}`
    
    if (!filledSlots.has(slotKey)) {
      // Get the next course (cycle through all courses)
      const course = theoryCourses[courseIndex % theoryCourses.length]
      courseIndex++
      
      // Get the next available room (cycle through all rooms)
      const suitableRooms = rooms.filter(room => 
        (room.type === "classroom" || room.type === "lecture-hall") && 
        room.isAvailable
      )
      
      if (suitableRooms.length > 0) {
        const room = suitableRooms[roomIndex % suitableRooms.length]
        roomIndex++
        
        // Create a new slot - we'll be more permissive about conflicts
        const newSlot = {
          course,
          day,
          startTime: timeSlot,
          room,
          isFree: false
        }
        
        // Check for basic conflicts (room and instructor double-booking)
        const roomConflict = filledSchedule.some(s => 
          s.day === day && 
          s.startTime === timeSlot && 
          s.room?._id?.toString() === room._id.toString()
        )
        
        const instructorConflict = filledSchedule.some(s => 
          s.day === day && 
          s.startTime === timeSlot && 
          s.course?.instructor?._id?.toString() === course.instructor.toString()
        )
        
        // If there are conflicts, try to find alternative rooms or courses
        if (roomConflict || instructorConflict) {
          // Try to find a different room
          let alternativeRoom = null
          for (let i = 0; i < suitableRooms.length; i++) {
            const testRoom = suitableRooms[(roomIndex + i) % suitableRooms.length]
            const roomConflict = filledSchedule.some(s => 
              s.day === day && 
              s.startTime === timeSlot && 
              s.room?._id?.toString() === testRoom._id.toString()
            )
            if (!roomConflict) {
              alternativeRoom = testRoom
              break
            }
          }
          
          if (alternativeRoom) {
            newSlot.room = alternativeRoom
          }
          
          // If still have instructor conflict, we'll allow it for now to fill all slots
          // In a real scenario, you might want to create duplicate courses or handle this differently
        }
        
        // Add the slot regardless of conflicts to ensure all slots are filled
        filledSchedule.push(newSlot)
        filledSlots.add(slotKey)
        
        console.log(`Filled slot: ${day} ${timeSlot} with ${course.name} in ${newSlot.room.name}`)
      }
    }
  }
  
  console.log(`Final schedule has ${filledSchedule.length} slots out of ${allSlots.length} possible slots`)
  return filledSchedule
}

// Create a fair schedule that distributes subjects evenly across time slots
function createFairSchedule(courses, rooms, teachers, year, branch, division, opts) {
  console.log("Creating fair schedule...")
  
  // Get all theory courses
  const theoryCourses = courses.filter(c => c.lectureType === "theory")
  const labCourses = courses.filter(c => c.lectureType === "lab")
  
  console.log(`Found ${theoryCourses.length} theory courses and ${labCourses.length} lab courses`)
  
  // Create all possible time slots
  const allSlots = []
  for (const day of DAYS) {
    for (const timeSlot of TIME_SLOTS) {
      if (timeSlot !== LUNCH_BREAK_SLOT) {
        allSlots.push({ day, timeSlot })
      }
    }
  }
  
  console.log(`Total slots to fill: ${allSlots.length}`)
  
  // Calculate how many slots each subject should get
  const totalSubjects = theoryCourses.length
  const slotsPerSubject = Math.floor(allSlots.length / totalSubjects)
  const extraSlots = allSlots.length % totalSubjects
  
  console.log(`Each subject will get ${slotsPerSubject} slots, with ${extraSlots} extra slots to distribute`)
  
  // Create a fair distribution plan - ensure all subjects get equal slots
  const subjectDistribution = []
  theoryCourses.forEach((course, index) => {
    const slotsForThisSubject = slotsPerSubject + (index < extraSlots ? 1 : 0)
    subjectDistribution.push({
      course,
      requiredSlots: slotsForThisSubject,
      assignedSlots: 0,
      priority: index // Add priority to ensure all subjects get scheduled
    })
  })
  
  // Sort by priority to ensure fair distribution
  subjectDistribution.sort((a, b) => a.priority - b.priority)
  
  // Shuffle time slots for random distribution
  const shuffledSlots = shuffleArray([...allSlots])
  
  const schedule = []
  const filledSlots = new Set()
  
  // Get suitable rooms
  const suitableRooms = rooms.filter(room => 
    (room.type === "classroom" || room.type === "lecture-hall") && 
    room.isAvailable
  )
  
  if (suitableRooms.length === 0) {
    console.log("No suitable rooms available")
    return schedule
  }
  
  // First, schedule lab sessions (they need 2 consecutive slots)
  const labRooms = rooms.filter(room => room.type === "lab" && room.isAvailable)
  if (labRooms.length > 0 && labCourses.length > 0) {
    console.log("Scheduling lab sessions...")
    
    for (const labCourse of labCourses) {
      // Find a suitable time slot for lab (2 consecutive hours)
      for (const day of shuffleArray([...DAYS])) {
        const availableTimeSlots = LAB_TIME_SLOTS
        
        for (const timeSlot of availableTimeSlots) {
          const timeIndex = TIME_SLOTS.indexOf(timeSlot)
          const nextTimeSlot = TIME_SLOTS[timeIndex + 1]
          
          if (!nextTimeSlot || nextTimeSlot === LUNCH_BREAK_SLOT) continue
          
          const firstSlotKey = `${day}-${timeSlot}`
          const secondSlotKey = `${day}-${nextTimeSlot}`
          
          if (!filledSlots.has(firstSlotKey) && !filledSlots.has(secondSlotKey)) {
            const labRoom = labRooms[Math.floor(Math.random() * labRooms.length)]
            
            // Add first hour of lab
            schedule.push({
              course: labCourse,
              day,
              startTime: timeSlot,
              room: labRoom,
              isLabFirst: true,
              isFree: false
            })
            filledSlots.add(firstSlotKey)
            
            // Add second hour of lab
            schedule.push({
              course: labCourse,
              day,
              startTime: nextTimeSlot,
              room: labRoom,
              isLabSecond: true,
              isFree: false
            })
            filledSlots.add(secondSlotKey)
            
            console.log(`Scheduled lab: ${labCourse.name} on ${day} ${timeSlot}-${nextTimeSlot}`)
            break
          }
        }
      }
    }
  }
  
  // Distribute theory subjects fairly across remaining time slots
  let roomIndex = 0
  
  for (const { day, timeSlot } of shuffledSlots) {
    const slotKey = `${day}-${timeSlot}`
    
    if (filledSlots.has(slotKey)) continue
    
    // Find a subject that still needs more slots
    const availableSubjects = subjectDistribution.filter(s => s.assignedSlots < s.requiredSlots)
    
    if (availableSubjects.length === 0) {
      // All subjects have their required slots, distribute remaining slots fairly
      const minAssignedSlots = Math.min(...subjectDistribution.map(s => s.assignedSlots))
      const subjectsWithMinSlots = subjectDistribution.filter(s => s.assignedSlots === minAssignedSlots)
      const selectedSubject = subjectsWithMinSlots[Math.floor(Math.random() * subjectsWithMinSlots.length)]
      
      if (selectedSubject) {
        const room = suitableRooms[roomIndex % suitableRooms.length]
        roomIndex++
        
        schedule.push({
          course: selectedSubject.course,
          day,
          startTime: timeSlot,
          room,
          isFree: false
        })
        filledSlots.add(slotKey)
        selectedSubject.assignedSlots++
      }
    } else {
      // Select a subject that needs more slots - prioritize subjects with fewer slots
      const minAssignedSlots = Math.min(...availableSubjects.map(s => s.assignedSlots))
      const subjectsWithMinSlots = availableSubjects.filter(s => s.assignedSlots === minAssignedSlots)
      const selectedSubject = subjectsWithMinSlots[Math.floor(Math.random() * subjectsWithMinSlots.length)]
      
      const room = suitableRooms[roomIndex % suitableRooms.length]
      roomIndex++
      
      schedule.push({
        course: selectedSubject.course,
        day,
        startTime: timeSlot,
        room,
        isFree: false
      })
      filledSlots.add(slotKey)
      selectedSubject.assignedSlots++
    }
  }
  
  // Ensure all remaining slots are filled
  for (const { day, timeSlot } of allSlots) {
    const slotKey = `${day}-${timeSlot}`
    
    if (!filledSlots.has(slotKey)) {
      // Find the subject with the least slots
      const minAssignedSlots = Math.min(...subjectDistribution.map(s => s.assignedSlots))
      const subjectsWithMinSlots = subjectDistribution.filter(s => s.assignedSlots === minAssignedSlots)
      const selectedSubject = subjectsWithMinSlots[Math.floor(Math.random() * subjectsWithMinSlots.length)]
      
      const room = suitableRooms[roomIndex % suitableRooms.length]
      roomIndex++
      
      schedule.push({
        course: selectedSubject.course,
        day,
        startTime: timeSlot,
        room,
        isFree: false
      })
      filledSlots.add(slotKey)
      selectedSubject.assignedSlots++
    }
  }
  
  // Log the distribution
  console.log("Subject distribution:")
  subjectDistribution.forEach(subject => {
    console.log(`${subject.course.name}: ${subject.assignedSlots}/${subject.requiredSlots} slots`)
  })
  
  console.log(`Fair schedule created with ${schedule.length} slots`)
  return schedule
}

// Simple fair scheduling algorithm that ensures equal distribution
function createSimpleFairSchedule(courses, rooms, teachers, year, branch, division) {
  console.log("Creating simple fair schedule...")
  
  // Get all theory courses
  const theoryCourses = courses.filter(c => c.lectureType === "theory")
  const labCourses = courses.filter(c => c.lectureType === "lab")
  
  console.log(`Found ${theoryCourses.length} theory courses and ${labCourses.length} lab courses`)
  
  // Create all possible time slots
  const allSlots = []
  for (const day of DAYS) {
    for (const timeSlot of TIME_SLOTS) {
      if (timeSlot !== LUNCH_BREAK_SLOT) {
        allSlots.push({ day, timeSlot })
      }
    }
  }
  
  console.log(`Total slots to fill: ${allSlots.length}`)
  
  // Calculate slots per subject
  const slotsPerSubject = Math.floor(allSlots.length / theoryCourses.length)
  const extraSlots = allSlots.length % theoryCourses.length
  
  console.log(`Each subject gets ${slotsPerSubject} slots, with ${extraSlots} extra slots`)
  
  // Create a round-robin distribution
  const schedule = []
  const suitableRooms = rooms.filter(room => 
    (room.type === "classroom" || room.type === "lecture-hall") && 
    room.isAvailable
  )
  
  if (suitableRooms.length === 0) {
    console.log("No suitable rooms available")
    return schedule
  }
  
  // First, schedule lab sessions (2 consecutive slots each) - only one lab per day
  const labRooms = rooms.filter(room => room.type === "lab" && room.isAvailable)
  const usedDays = new Set() // Track which days already have labs
  
  for (const labCourse of labCourses) {
    if (usedDays.size >= DAYS.length) break // All days already have labs
    
    // Find 2 consecutive slots on a day that doesn't have a lab yet
    for (const day of DAYS) {
      if (usedDays.has(day)) continue // Skip days that already have labs
      
      // Find consecutive slots for this day
      const daySlots = allSlots.filter(slot => slot.day === day)
      
      for (let i = 0; i < daySlots.length - 1; i++) {
        const slot1 = daySlots[i]
        const slot2 = daySlots[i + 1]
        
        // Check if both slots are consecutive
        const timeIndex1 = TIME_SLOTS.indexOf(slot1.timeSlot)
        const timeIndex2 = TIME_SLOTS.indexOf(slot2.timeSlot)
        
        if (timeIndex2 === timeIndex1 + 1) {
          const labRoom = labRooms[Math.floor(Math.random() * labRooms.length)]
          
          // Add first hour
          schedule.push({
            course: labCourse,
            day: slot1.day,
            startTime: slot1.timeSlot,
            room: labRoom,
            isLabFirst: true,
            isFree: false
          })
          
          // Add second hour
          schedule.push({
            course: labCourse,
            day: slot2.day,
            startTime: slot2.timeSlot,
            room: labRoom,
            isLabSecond: true,
            isFree: false
          })
          
          // Remove used slots from allSlots
          const slot1Index = allSlots.findIndex(s => s.day === slot1.day && s.timeSlot === slot1.timeSlot)
          const slot2Index = allSlots.findIndex(s => s.day === slot2.day && s.timeSlot === slot2.timeSlot)
          
          if (slot1Index !== -1 && slot2Index !== -1) {
            allSlots.splice(Math.max(slot1Index, slot2Index), 1) // Remove the higher index first
            allSlots.splice(Math.min(slot1Index, slot2Index), 1) // Then remove the lower index
          }
          
          usedDays.add(day)
          console.log(`Scheduled lab: ${labCourse.name} on ${slot1.day} ${slot1.timeSlot}-${slot2.timeSlot}`)
          break
        }
      }
      
      if (usedDays.has(day)) break // If we scheduled a lab for this day, move to next course
    }
  }
  
  // Distribute theory courses in round-robin fashion
  let courseIndex = 0
  let roomIndex = 0
  
  for (const { day, timeSlot } of allSlots) {
    const course = theoryCourses[courseIndex % theoryCourses.length]
    const room = suitableRooms[roomIndex % suitableRooms.length]
    
    schedule.push({
      course,
      day,
      startTime: timeSlot,
      room,
      isFree: false
    })
    
    courseIndex++
    roomIndex++
  }
  
  // Log the final distribution
  console.log("Final subject distribution:")
  const distribution = {}
  schedule.forEach(slot => {
    const name = slot.course.name
    distribution[name] = (distribution[name] || 0) + 1
  })
  
  Object.entries(distribution).forEach(([name, count]) => {
    console.log(`${name}: ${count} slots`)
  })
  
  console.log(`Simple fair schedule created with ${schedule.length} slots`)
  return schedule
}

// Systematic scheduling algorithm that properly uses time slots
function createSystematicSchedule(courses, rooms, teachers, year, branch, division) {
  console.log("Creating systematic schedule...")
  
  // Get all theory courses and lab courses
  const theoryCourses = courses.filter(c => c.lectureType === "theory")
  const labCourses = courses.filter(c => c.lectureType === "lab")
  
  console.log(`Found ${theoryCourses.length} theory courses and ${labCourses.length} lab courses`)
  
  // Create all possible time slots (excluding lunch break)
  const allSlots = []
  for (const day of DAYS) {
    for (const timeSlot of TIME_SLOTS) {
      if (timeSlot !== LUNCH_BREAK_SLOT) {
        allSlots.push({ day, timeSlot })
      }
    }
  }
  
  console.log(`Total slots available: ${allSlots.length}`)
  
  const schedule = []
  const usedSlots = new Set()
  
  // Get available rooms
  const classrooms = rooms.filter(room => 
    (room.type === "classroom" || room.type === "lecture-hall") && 
    room.isAvailable
  )
  const labRooms = rooms.filter(room => room.type === "lab" && room.isAvailable)
  
  if (classrooms.length === 0) {
    console.log("No classrooms available")
    return schedule
  }
  
  // Step 1: Schedule lab sessions first (they need consecutive slots)
  console.log("Step 1: Scheduling lab sessions...")
  for (const labCourse of labCourses) {
    let labScheduled = false
    
    // Try to find 2 consecutive slots for the lab
    for (const day of DAYS) {
      if (labScheduled) break
      
      // Use preferred time slots if available, otherwise use default lab slots
      const preferredSlots = labCourse.preferredTimeSlots && labCourse.preferredTimeSlots.length > 0 
        ? labCourse.preferredTimeSlots 
        : LAB_TIME_SLOTS
      
      for (const startTime of preferredSlots) {
        const timeIndex = TIME_SLOTS.indexOf(startTime)
        const nextTimeSlot = TIME_SLOTS[timeIndex + 1]
        
        if (!nextTimeSlot || nextTimeSlot === LUNCH_BREAK_SLOT) continue
        
        const slot1Key = `${day}-${startTime}`
        const slot2Key = `${day}-${nextTimeSlot}`
        
        if (!usedSlots.has(slot1Key) && !usedSlots.has(slot2Key)) {
          const labRoom = labRooms[0] // Use first available lab room
          
          if (labRoom) {
            // Schedule first hour
            schedule.push({
              course: labCourse,
              day,
              startTime,
              room: labRoom,
              isLabFirst: true,
              isFree: false
            })
            usedSlots.add(slot1Key)
            
            // Schedule second hour
            schedule.push({
              course: labCourse,
              day,
              startTime: nextTimeSlot,
              room: labRoom,
              isLabSecond: true,
              isFree: false
            })
            usedSlots.add(slot2Key)
            
            labScheduled = true
            console.log(`Scheduled lab: ${labCourse.name} on ${day} ${startTime}-${nextTimeSlot}`)
            break
          }
        }
      }
    }
    
    if (!labScheduled) {
      console.log(`Warning: Could not schedule lab for ${labCourse.name}`)
    }
  }
  
  // Step 2: Calculate fair distribution for theory courses
  console.log("Step 2: Calculating theory course distribution...")
  const remainingSlots = allSlots.filter(slot => !usedSlots.has(`${slot.day}-${slot.timeSlot}`))
  console.log(`Remaining slots for theory courses: ${remainingSlots.length}`)
  
  if (theoryCourses.length === 0) {
    console.log("No theory courses to schedule")
    return schedule
  }
  
  // Calculate how many slots each theory course should get
  const slotsPerCourse = Math.floor(remainingSlots.length / theoryCourses.length)
  const extraSlots = remainingSlots.length % theoryCourses.length
  
  console.log(`Each theory course gets ${slotsPerCourse} slots, with ${extraSlots} extra slots to distribute`)
  
  // Create distribution plan
  const courseDistribution = theoryCourses.map((course, index) => ({
    course,
    targetSlots: slotsPerCourse + (index < extraSlots ? 1 : 0),
    assignedSlots: 0
  }))
  
  // Step 3: Systematically assign theory courses to remaining slots
  console.log("Step 3: Assigning theory courses systematically...")
  let courseIndex = 0
  let roomIndex = 0
  
  for (const { day, timeSlot } of remainingSlots) {
    const slotKey = `${day}-${timeSlot}`
    
    if (usedSlots.has(slotKey)) continue
    
    // Find the course that needs the most slots (fair distribution)
    const availableCourses = courseDistribution.filter(c => c.assignedSlots < c.targetSlots)
    
    let selectedCourse
    if (availableCourses.length > 0) {
      // Prioritize courses that are furthest behind their target
      availableCourses.sort((a, b) => {
        const aDeficit = a.targetSlots - a.assignedSlots
        const bDeficit = b.targetSlots - b.assignedSlots
        return bDeficit - aDeficit
      })
      selectedCourse = availableCourses[0]
    } else {
      // All courses have reached their target, distribute remaining slots evenly
      selectedCourse = courseDistribution[courseIndex % courseDistribution.length]
      courseIndex++
    }
    
    // Assign room systematically
    const room = classrooms[roomIndex % classrooms.length]
    roomIndex++
    
    // Create the schedule slot
    schedule.push({
      course: selectedCourse.course,
      day,
      startTime: timeSlot,
      room,
      isFree: false
    })
    
    usedSlots.add(slotKey)
    selectedCourse.assignedSlots++
  }
  
  // Step 4: Log final distribution
  console.log("Final course distribution:")
  courseDistribution.forEach(item => {
    console.log(`${item.course.name}: ${item.assignedSlots}/${item.targetSlots} slots`)
  })
  
  console.log(`Systematic schedule created with ${schedule.length} slots`)
  return schedule
}