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

// Organization ID for fetching
const organizationId = "8bbb7afb-d664-492a-bcd2-d29953ab924e";

const Schedule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [editingAppointment, setEditingAppointment] = useState(null);

    const [allWorkers, setAllWorkers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);

    // Load backend data
    const fetchData = async () => {
        try {
            const [workersRes, apptsRes, servicesRes] = await Promise.all([
                axios.get(`https://localhost:7079/api/employees/${organizationId}`),
                axios.get(`https://localhost:7079/api/appointments/${organizationId}/2025-01-01`),
                axios.get(`https://localhost:7079/api/services`)
            ]);

            // Map employees for schedule
            setAllWorkers(workersRes.data.map(w => ({
                id: w.id,
                name: w.username,
                photo: w.photoUrl || "/default.jpg"
            })));

            // Map appointments for schedule
            setAppointments(apptsRes.data.map(a => ({
                id: a.id,
                date: a.startTime?.split("T")[0] || "",
                time: a.startTime?.split("T")[1].substring(0,5) || "",
                worker: a.employee?.username || "",
                service: a.menuService?.name || "",
                extraInfo: a.extraInfo || ""
            })));

            setServices(servicesRes.data.map(s => ({ name: s })));

        } catch (err) {
            console.error("Failed to load schedule data", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

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
    const fixedDate = new Date('2025-11-28');

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
                                <div key={wIdx} className="employee-column" style={{ minHeight: `${times.length * 30 + 91}px` }}>
                                    <div className="employee-header">
                                        <Image src={worker.photo} roundedCircle width={65} height={65} />
                                        <div>{worker.name}</div>
                                    </div>

                                    {times.map((_, idx) => (
                                        <div key={idx} style={{ height: '39px', borderBottom: '1px dashed #ccc' }}></div>
                                    ))}

                                    {appointments
                                        .filter(a => a.worker === worker.name)
                                        .map((app, idx) => (
                                            <div
                                                key={idx}
                                                className="appointment-block"
                                                style={{ top: 91 + getAppointmentTop(app.time, times) }}
                                                onClick={() => { setEditingAppointment(app); setShowEdit(true); }}
                                            >
                                                <span>Edit</span>
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
                        <div>{fixedDate.getFullYear()}</div>
                        <div>{fixedDate.toLocaleString('default', { month: 'long' })}</div>
                        <div>{fixedDate.getDate()}</div>
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

                    <Button className="sidebar-add-button" variant="primary" onClick={openPopup}>
                        Add new appointment
                    </Button>
                </div>
            </div>

            <NewAppointmentPopup
                show={showPopup}
                handleClose={closePopup}
                onSuccess={(message) => { setSuccessMessage(message); setShowSuccess(true); fetchData(); }}
                workers={allWorkers}
                services={services}
                timeSlots={times}
            />

            <EditAppointmentPopup
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                appointment={editingAppointment || mockAppointment}
                workers={allWorkers}
                services={services}
                timeSlots={times}
                onSuccess={(message) => { setSuccessMessage(message); setShowSuccess(true); fetchData(); }}
            />

            <SuccessNotifier
                show={showSuccess}
                message={successMessage}
                onClose={() => setShowSuccess(false)}
            />

            <Modal show={showCalendar} onHide={closeCalendar} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Calendar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Calendar />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Schedule;
