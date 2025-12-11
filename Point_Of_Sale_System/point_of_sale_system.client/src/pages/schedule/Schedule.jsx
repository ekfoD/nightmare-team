// Schedule.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Image, Button, Form, Modal } from 'react-bootstrap';
import NewAppointmentPopup from './NewAppointmentPopup';
import EditAppointmentPopup from './EditAppointmentPopup';
import SuccessNotifier from "./SuccessNotifier";
import Calendar from './Calendar';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Schedule.css';

// Scaling
const SCALE = 1.3;
const ROW_HEIGHT = 30 * SCALE;

// Time slots generator
const generateTimes = (workStart, workEnd, intervalMinutes) => {
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

// Get appointment top offset
const getAppointmentTop = (time, times) => {
    const index = times.indexOf(time);
    return index >= 0 ? index * ROW_HEIGHT : 0;
};

// Organization ID for fetching (move to config/env)
const organizationId = "8bbb7afb-d664-492a-bcd2-d29953ab924e";

const Schedule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [editingAppointment, setEditingAppointment] = useState(null);

    const [allWorkers, setAllWorkers] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]); // full list (for calendar and overlap checks)
    const [dayAppointments, setDayAppointments] = useState([]); // for selected date
    const [services, setServices] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    // Load backend data (workers + services + appointments for selected date)
    const fetchDataForDate = async (date) => {
        try {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // month 0-11
            const dd = String(date.getDate()).padStart(2, '0');
            const isoDate = `${yyyy}-${mm}-${dd}`;

            const [workersRes, apptsRes, servicesRes] = await Promise.all([
                axios.get(`https://localhost:7079/api/employees/${organizationId}`),
                axios.get(`https://localhost:7079/api/appointments/${organizationId}/${isoDate}`),
                axios.get(`https://localhost:7079/api/services`)
            ]);

            setAllWorkers(workersRes.data.map(w => ({
                id: w.id,
                name: w.username,
                photo: w.photoUrl || "/default.jpg"
            })));

            // map appointments (keep employeeId & start/end times)
            const mappedAppts = apptsRes.data.map(a => {
                const start = new Date(a.startTime);
                const end = new Date(a.endTime);
                const dateOnly = start.toISOString().split("T")[0];
                const time = start.toTimeString().substring(0,5);

                return {
                    id: a.id,
                    date: dateOnly,
                    time,
                    employeeId: a.employeeId,
                    employeeName: a.employeeName || "",
                    menuServiceId: a.menuServiceId,
                    serviceName: a.serviceName || "",
                    startTime: a.startTime,
                    endTime: a.endTime,
                    extraInfo: a.extraInfo || "",
                    customerName: a.customerName || "",
                    customerPhone: a.customerPhone || ""
                };
            });

            setAllAppointments(mappedAppts);
            setDayAppointments(mappedAppts);
            // services expected to be array of objects: { id, name, duration } or similar
            setServices(servicesRes.data);

        } catch (err) {
            console.error("Failed to load schedule data", err);
        }
    };

    // initial load
    useEffect(() => {
        fetchDataForDate(selectedDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const workStart = '07:00';
    const workEnd = '21:00';
    const intervalMinutes = 30;
    const times = generateTimes(workStart, workEnd, intervalMinutes);

    const [showPopup, setShowPopup] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const openPopup = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);
    const openCalendar = () => setShowCalendar(true);
    const closeCalendar = () => setShowCalendar(false);

    const workers = allWorkers.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const mockAppointment = { date: "", time: "", service: "", worker: "", extraInfo: "" };

    // Called when calendar day is selected
    const handleDaySelect = async (date) => {
        setSelectedDate(date);
        await fetchDataForDate(date);
        closeCalendar();
    };

    // refresh for current selected date (used after create/edit)
    const refresh = () => fetchDataForDate(selectedDate);

    return (
        <Container fluid className="schedule-container">
            <div className="schedule-wrapper">
                <Card className="schedule-card">
                    <div style={{ display: 'flex', overflowX: 'auto', flex: 1 }}>
                        {/* Time Column */}
                        <div className="time-column">
                            {times.map((time, idx) => (
                                <div key={idx} className="time-slot">{time}</div>
                            ))}
                        </div>

                        {/* Worker Columns */}
                        <div style={{ display: 'flex', minWidth: `${workers.length * 234}px` }}>
                            {workers.map((worker, wIdx) => (
                                <div key={wIdx} className="employee-column" style={{ minHeight: `${times.length * ROW_HEIGHT + 91}px` }}>
                                    <div className="employee-header">
                                        <Image src={worker.photo} roundedCircle width={65} height={65} />
                                        <div>{worker.name}</div>
                                    </div>

                                    {times.map((_, idx) => (
                                        <div key={idx} style={{ height: `${ROW_HEIGHT}px`, borderBottom: '1px dashed #ccc' }}></div>
                                    ))}

                                    {dayAppointments
                                        .filter(a => a.employeeId === worker.id)
                                        .map((app, idx) => (
                                            <div
                                                key={idx}
                                                className="appointment-block"
                                                style={{ top: 91 + getAppointmentTop(app.time, times) }}
                                                onClick={() => { setEditingAppointment(app); setShowEdit(true); }}
                                            >
                                                <div style={{ pointerEvents: 'none', textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 700 }}>{app.serviceName}</div>
                                                    <div style={{ fontSize: 12 }}>{app.customerName} • {app.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Sidebar */}
                <div className="schedule-sidebar">
                    <div className="sidebar-date">
                        <div style={{fontSize:'2.8rem'}}>{selectedDate.getFullYear()}</div>
                        <div style={{fontSize:'2.8rem'}}>{selectedDate.toLocaleString('default', { month: 'long' })}</div>
                        <div style={{fontSize:'2.8rem'}}>{selectedDate.getDate()}</div>
                    </div>

                    <Button className="sidebar-button" variant="primary" onClick={openCalendar}>
                        Calendar
                    </Button>

                    <Form.Control
                        className="sidebar-search"
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Button className="sidebar-add-button" variant="primary" onClick={() => setShowPopup(true)}>
                        Add new appointment
                    </Button>
                </div>
            </div>

            <NewAppointmentPopup
                show={showPopup}
                handleClose={() => { setShowPopup(false); }}
                onSuccess={(message) => { setSuccessMessage(message); setShowSuccess(true); refresh(); }}
                workers={allWorkers}
                services={services}
                timeSlots={times}
                selectedDate={selectedDate}
                allAppointments={allAppointments} // pass full day's appointments for overlap check
                organizationId={organizationId}
            />

            <EditAppointmentPopup
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                appointment={editingAppointment || mockAppointment}
                workers={allWorkers}
                services={services}
                timeSlots={times}
                onSuccess={(message) => { setSuccessMessage(message); setShowSuccess(true); refresh(); }}
                allAppointments={allAppointments}
                organizationId={organizationId}
            />

            <SuccessNotifier
                show={showSuccess}
                message={successMessage}
                onClose={() => setShowSuccess(false)}
            />

            {/* CALENDAR MODAL */}
            <Modal show={showCalendar} onHide={closeCalendar} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Calendar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Calendar
                        appointmentDates={allAppointments.map(a => a.date)}
                        onDaySelect={handleDaySelect}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Schedule;
