export const calculateWeeklyStreak = (workouts) => {
  const dates = workouts
    .map(w => new Date(w.created_at).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // remove duplicates

  dates.sort((a, b) => new Date(b) - new Date(a))

  let streak = 0
  let currentDate = new Date()

  for (let i = 0; i < dates.length; i++) {
    if (new Date(dates[i]).toDateString() === currentDate.toDateString()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
