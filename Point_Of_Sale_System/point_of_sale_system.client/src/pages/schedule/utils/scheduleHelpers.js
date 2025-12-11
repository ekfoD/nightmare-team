// Scaling
export const ROW_HEIGHT = 40;

export const workStart = '07:00';
export const workEnd = '21:00';

// Pleasant and distinct colors for service blocks
const servicePalette = [
  "#ffb3ba", "#bae1ff", "#baffc9", "#ffffba", "#ffdfba",
  "#e2baff", "#ffbfff", "#caffbf", "#ffd6a5", "#a0c4ff",
];

// Map to remember assigned colors
const serviceColors = new Map();

// Assign consistent colors to services
export const getColorForService = (serviceName) => {
  if (!serviceColors.has(serviceName)) {
    const index = serviceColors.size % servicePalette.length;
    serviceColors.set(serviceName, servicePalette[index]);
  }
  return serviceColors.get(serviceName);
};

// Generate time slots between start and end with given interval (minutes)
export const generateTimes = (workStart, workEnd, intervalMinutes) => {
  const times = [];
  const [startHour, startMin] = workStart.split(':').map(Number);
  const [endHour, endMin] = workEnd.split(':').map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (current <= end) {
    const hh = String(current.getHours()).padStart(2, '0');
    const mm = String(current.getMinutes()).padStart(2, '0');
    times.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return times;
};

// Compute appointment position & height
export const getAppointmentTop = (startTime, times) => {
  const start = new Date(startTime);
  const hhmm = `${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`;
  const index = times.findIndex(t => t === hhmm);
  if(index >= 0) return index * ROW_HEIGHT;
  const firstSlot = times[0].split(':').map(Number);
  const slotMinutes = (start.getHours() - firstSlot[0])*60 + (start.getMinutes() - firstSlot[1]);
  return (slotMinutes / 30) * ROW_HEIGHT;
};

export const isWithinWorkHours = (timeStr) => {
  if (!timeStr) return false;
  const [hh, mm] = timeStr.split(":").map(Number);
  const [startH, startM] = workStart.split(":").map(Number);
  const [endH, endM] = workEnd.split(":").map(Number);

  const minutes = hh*60 + mm;
  const startMinutes = startH*60 + startM;
  const endMinutes = endH*60 + endM;

  return minutes >= startMinutes && minutes <= endMinutes;
};

export const getAppointmentHeight = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMinutes = (end - start) / 60000;
  return (durationMinutes / 30) * ROW_HEIGHT;
};

export const doesOverlap = (newStart, newEnd, employeeId, allAppts, excludeId = null) =>
  allAppts.some(a => a.employeeId === employeeId && a.id !== excludeId &&
                     newStart < new Date(a.endTime) && new Date(a.startTime) < newEnd);

export const parseDurationToMinutes = (duration) => {
  if (!duration) return 30;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  return parts.length >= 2 ? parts[0] * 60 + parts[1] : parseInt(duration, 10) || 30;
};