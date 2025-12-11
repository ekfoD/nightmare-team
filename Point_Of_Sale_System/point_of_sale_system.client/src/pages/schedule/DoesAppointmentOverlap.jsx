export default function doesAppointmentOverlap(newStart, newEnd, employeeId, allAppointments, excludeId = null) {
    return allAppointments.some(app => {
        // same employee?
        if (app.employeeId !== employeeId) return false;

        // exclude the appointment being edited
        if (excludeId && app.id === excludeId) return false;

        const existingStart = new Date(app.startTime);
        const existingEnd = new Date(app.endTime);

        // overlap check
        return newStart < existingEnd && existingStart < newEnd;
    });
}