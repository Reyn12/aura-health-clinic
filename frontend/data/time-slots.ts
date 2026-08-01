export const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

/** Deterministic mock "unavailable" slots so the UI feels realistic without a backend. */
export function getUnavailableSlots(doctorId: string, dateIso: string) {
  const seed = `${doctorId}-${dateIso}`
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return timeSlots.filter((_, index) => (seed + index) % 5 === 0);
}
