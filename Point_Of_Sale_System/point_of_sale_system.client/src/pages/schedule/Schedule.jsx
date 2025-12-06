import { useState } from 'react';
import { Container, Card, Image, Button, Form, Modal } from 'react-bootstrap';
import NewAppointmentPopup from './NewAppointmentPopup';
import EditAppointmentPopup from './EditAppointmentPopup';
import SuccessNotifier from "./SuccessNotifier";
import Calendar from './Calendar';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Schedule.css';

const allWorkers = [
  { name: 'Alice', photo: 'https://via.placeholder.com/50' },
  { name: 'Bob', photo: 'https://via.placeholder.com/50' },
  { name: 'Charlie', photo: 'https://via.placeholder.com/50' },
  { name: 'Diana', photo: 'https://via.placeholder.com/50' },
  { name: 'Eve', photo: 'https://via.placeholder.com/50' },
  { name: 'Frank', photo: 'https://via.placeholder.com/50' },
  { name: 'Grace', photo: 'https://via.placeholder.com/50' },
  { name: 'Hank', photo: 'https://via.placeholder.com/50' },
  { name: 'Ivy', photo: 'https://via.placeholder.com/50' },
];

const appointments = [
  { worker: 'Alice', time: '08:30', date: '2025-11-28', service: 'Haircut', extraInfo: 'Regular client, prefers short trim' },
  { worker: 'Bob', time: '09:00', date: '2025-11-28', service: 'Nails', extraInfo: 'French manicure' },
  { worker: 'Charlie', time: '10:00', date: '2025-11-28', service: 'Massage', extraInfo: 'Focus on shoulders' },
  { worker: 'Alice', time: '11:00', date: '2025-11-28', service: 'Makeup', extraInfo: 'Evening look' },
  { worker: 'Diana', time: '12:30', date: '2025-11-28', service: 'Coloring', extraInfo: 'Highlights only' },
  { worker: 'Eve', time: '12:30', date: '2025-11-28', service: 'Nails', extraInfo: 'Acrylic extensions' },
  { worker: 'Frank', time: '14:00', date: '2025-11-28', service: 'Haircut', extraInfo: 'Trim and style' },
];

const mockAppointment = { date: "2025-01-12", time: "10:00", service: "Nails", worker: "Emma", extraInfo: "Client prefers pink color" };
const services = ["Haircut", "Nails", "Massage", "Makeup", "Coloring"];

const ROW_HEIGHT = 39;  // Adjusted to match CSS

// Generate time slots
const generateTimes = (start, end, interval) => {
  const times = [];
  let [h, m] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let date = new Date();
  date.setHours(h, m, 0, 0);
  const endDate = new Date();
  endDate.setHours(endH, endM, 0, 0);

  while (date <= endDate) {
    times.push(`${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`);
    date.setMinutes(date.getMinutes() + interval);
  }
  return times;
};

// Get top offset for appointment
const getAppointmentTop = (time, times) => {
  const index = times.indexOf(time);
  return index >= 0 ? index * ROW_HEIGHT : 0;
};

const EmployeeColumn = ({ worker, times, appointments, onEdit }) => (
  <div className="employee-column">
    <div className="employee-header">
      <Image src={worker.photo} roundedCircle width={65} height={65} />
      <div>{worker.name}</div>
    </div>

    {times.map((_, idx) => <div key={idx} className="time-slot-empty" />)}

    {appointments.filter(a => a.worker === worker.name).map((app, idx) => (
      <div
        key={idx}
        className="appointment-block"
        style={{ top: 91 + getAppointmentTop(app.time, times) }}
        onClick={() => onEdit(app)}
      >
        <span>Edit</span>
      </div>
    ))}
  </div>
);

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const workStart = '07:00', workEnd = '21:00', intervalMinutes = 30;
  const times = generateTimes(workStart, workEnd, intervalMinutes);

  const workers = allWorkers.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const fixedDate = new Date('2025-11-28');

  return (
    <Container fluid className="schedule-container">
      <div className="schedule-wrapper">
        <Card className="schedule-card">
          <div className="schedule-grid">
            <div className="time-column">
              {times.map((t, i) => <div key={i} className="time-slot">{t}</div>)}
            </div>

            <div className="employees-wrapper">
              {workers.map((w, i) => (
                <EmployeeColumn
                  key={i}
                  worker={w}
                  times={times}
                  appointments={appointments}
                  onEdit={(app) => { setEditingAppointment(app); setShowEdit(true); }}
                />
              ))}
            </div>
          </div>
        </Card>

        <div className="schedule-sidebar">
          <div className="sidebar-date">
            <div>{fixedDate.getFullYear()}</div>
            <div>{fixedDate.toLocaleString('default', { month: 'long' })}</div>
            <div>{fixedDate.getDate()}</div>
          </div>
          <Button className="sidebar-button" variant="primary" onClick={() => setShowCalendar(true)}>Calendar</Button>
          <Form.Control
            className="sidebar-search"
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button className="sidebar-add-button" variant="primary" onClick={() => setShowPopup(true)}>Add new appointment</Button>
        </div>
      </div>

      <NewAppointmentPopup
        show={showPopup}
        handleClose={() => setShowPopup(false)}
        onSuccess={msg => { setSuccessMessage(msg); setShowSuccess(true); }}
        workers={allWorkers}
        services={services}
        timeSlots={times}
      />

      <EditAppointmentPopup
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        appointment={editingAppointment || mockAppointment}
        workers={workers}
        services={services}
        timeSlots={times}
        onSuccess={msg => { setSuccessMessage(msg); setShowSuccess(true); }}
      />

      <SuccessNotifier
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />

      <Modal show={showCalendar} onHide={() => setShowCalendar(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body><Calendar /></Modal.Body>
      </Modal>
    </Container>
  );
};

export default Schedule;
