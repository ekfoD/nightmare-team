import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import NewAppointmentPopup from './NewAppointmentPopup';
import EditAppointmentPopup from './EditAppointmentPopup';
import SuccessNotifier from "./SuccessNotifier";
import Calendar from './Calendar';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Schedule.css';

import { getColorForService, getAppointmentHeight, workStart, workEnd, getAppointmentTop } from './utils/ScheduleHelpers';

// Generate time slots
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

const organizationId = "8bbb7afb-d664-492a-bcd2-d29953ab924e";

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [allWorkers, setAllWorkers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [dayAppointments, setDayAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const intervalMinutes = 30;

  const times = generateTimes(workStart, workEnd, intervalMinutes);

  const [showPopup, setShowPopup] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const mockAppointment = { date: "", time: "", service: "", worker: "", extraInfo: "" };

  const fetchDataForDate = async (date) => {
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0'); 
      const dd = String(date.getDate()).padStart(2, '0');
      const isoDate = `${yyyy}-${mm}-${dd}`;

      const [workersRes, apptsRes, servicesRes] = await Promise.all([
        axios.get(`https://localhost:7079/api/employees/${organizationId}`),
        axios.get(`https://localhost:7079/api/appointments/${organizationId}/${isoDate}`),
        axios.get(`https://localhost:7079/api/services/${organizationId}`),
      ]);

      setAllWorkers(workersRes.data.map(w => ({
        id: w.id,
        name: w.username,
        photo: w.photoUrl || "/default.jpg"
      })));

      const mappedAppts = apptsRes.data.map(a => {
        const start = new Date(a.startTime);
        return {
          ...a,
          date: start.toISOString().split("T")[0],
          time: start.toTimeString().substring(0,5)
        };
      });

      setAllAppointments(mappedAppts);
      setDayAppointments(mappedAppts);
      setServices(servicesRes.data);

    } catch (err) {
      console.error("Failed to load schedule data", err);
    }
  };

  useEffect(() => {
    fetchDataForDate(selectedDate);
  }, []);

  const workers = allWorkers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDaySelect = async (date) => {
    setSelectedDate(date);
    await fetchDataForDate(date);
    setShowCalendar(false);
  };

  const refresh = () => fetchDataForDate(selectedDate);

  return (
    <Container fluid className="schedule-container">
      <div className="schedule-wrapper">
        <Card className="schedule-card">
          <div className="schedule-grid">
            <div className="time-column">
              {times.map((time, idx) => <div key={idx} className="time-slot">{time}</div>)}
            </div>

            <div className="employees-wrapper">
              {workers.map((worker, wIdx) => (
                <div key={wIdx} className="employee-column">
                  <div className="employee-header">
                    <div className="employee-name">{worker.name}</div>
                  </div>

                  {times.map((_, idx) => <div key={idx} className="time-slot-empty"></div>)}

                  {dayAppointments.filter(a => a.employeeId === worker.id).map((app, idx) => (
                    <div
                    key={idx}
                    className="appointment-block"
                    style={{
                        top: 90 + getAppointmentTop(app.startTime, times),
                        height: getAppointmentHeight(app.startTime, app.endTime),
                        backgroundColor: getColorForService(app.serviceName)
                    }}
                    onClick={() => { setEditingAppointment(app); setShowEdit(true); }}
                    >
                      <div className="appointment-block-content">
                        <div className="appointment-service">{app.serviceName}</div>
                        <div className="appointment-details">{app.customerName} • {app.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="schedule-sidebar">
          <div className="sidebar-date">
            <div>{selectedDate.getFullYear()}</div>
            <div>{selectedDate.toLocaleString('default', { month: 'long' })}</div>
            <div>{selectedDate.getDate()}</div>
          </div>

          <Button className="sidebar-button" variant="primary" onClick={() => setShowCalendar(true)}>
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
        handleClose={() => setShowPopup(false)}
        onSuccess={(msg) => { setSuccessMessage(msg); setShowSuccess(true); refresh(); }}
        workers={allWorkers}
        services={services}
        timeSlots={times}
        selectedDate={selectedDate}
        allAppointments={allAppointments}
        organizationId={organizationId}
      />

      <EditAppointmentPopup
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        appointment={editingAppointment || mockAppointment}
        workers={allWorkers}
        services={services}
        timeSlots={times}
        onSuccess={(msg) => { setSuccessMessage(msg); setShowSuccess(true); refresh(); }}
        allAppointments={allAppointments}
        organizationId={organizationId}
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
