// App.js
import React, { useState } from 'react';
import { Container, Card, Image, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewAppointmentPopup from './NewAppointmentPopup';
import Calendar from './Calendar';
import SuccessNotifier from "./SuccessNotifier";


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
  { worker: 'Alice', time: '08:30' },
  { worker: 'Bob', time: '09:00' },
  { worker: 'Charlie', time: '10:00' },
  { worker: 'Alice', time: '11:00' },
  { worker: 'Diana', time: '12:30' },
  { worker: 'Eve', time: '12:30' },
  { worker: 'Frank', time: '14:00' },
];

const services = ["Haircut", "Nails", "Massage", "Makeup", "Coloring"];

// Scaling factors
const SCALE = 1.3;
const HEADER_HEIGHT = 70 * SCALE; 
const COLUMN_WIDTH = 180 * SCALE; 
const ROW_HEIGHT = 30 * SCALE; 

// Generate dynamic time slots
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

// Calculate appointment top offset based on times array
const getAppointmentTop = (time, times) => {
  const index = times.indexOf(time);
  return index >= 0 ? index * ROW_HEIGHT : 0;
};

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Work schedule settings
  const workStart = '07:00';
  const workEnd = '21:00';
  const intervalMinutes = 30;

  const times = generateTimes(workStart, workEnd, intervalMinutes);

  const [showPopup, setShowPopup] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const openCalendar = () => setShowCalendar(true);
  const closeCalendar = () => setShowCalendar(false);

  const handleSuccess = () => {setShowSuccess(true);};

  const timeSlots = times;

  // Filter workers based on search term
  const workers = allWorkers.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fixed date for now
  const fixedDate = new Date('2025-11-28');

  return (
    <Container
      fluid
      style={{ height: 'calc(100vh - 16px)', padding: '16px', overflow: 'auto' }}
    >
      <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
        {/* Schedule */}
        <Card
          style={{
            backgroundColor: '#f0f4f7',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 45px)',
          }}
        >
          <div style={{ display: 'flex', overflowX: 'auto', flex: 1 }}>
            {/* Time column (sticky) */}
            <div
              style={{
                flex: '0 0 60px',
                position: 'sticky',
                left: 0,
                backgroundColor: '#f0f4f7',
                zIndex: 2,
                borderRight: '1px solid #ccc',
                paddingTop: `${HEADER_HEIGHT}px`,
              }}
            >
              {times.map((time, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    borderBottom: '1px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Employees + appointments */}
            <div style={{ display: 'flex', minWidth: `${workers.length * COLUMN_WIDTH}px` }}>
              {workers.map((worker, wIdx) => (
                <div
                  key={wIdx}
                  style={{
                    width: `${COLUMN_WIDTH}px`,
                    borderLeft: '1px solid #ccc',
                    position: 'relative',
                    minHeight: `${times.length * ROW_HEIGHT + HEADER_HEIGHT}px`,
                  }}
                >
                  {/* Header part */}
                  <div
                    style={{
                      height: `${HEADER_HEIGHT}px`,
                      textAlign: 'center',
                      borderBottom: '1px solid #ccc',
                      backgroundColor: '#f0f4f7',
                      position: 'sticky',
                      top: 0,
                      zIndex: 3, // on top
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={worker.photo}
                      roundedCircle
                      width={50 * SCALE}
                      height={50 * SCALE}
                    />
                    <div>{worker.name}</div>
                  </div>

                  {/* Time slots */}
                  {times.map((_, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${ROW_HEIGHT}px`, borderBottom: '1px dashed #ccc' }}
                    ></div>
                  ))}

                  {/* Appointments */}
                  {appointments
                    .filter((a) => a.worker === worker.name)
                    .map((app, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          top: HEADER_HEIGHT + getAppointmentTop(app.time, times),
                          left: '5px',
                          right: '5px',
                          height: `${ROW_HEIGHT}px`,
                          backgroundColor: '#d3d3d3',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            color: '#0d6efd',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                          onClick={() => {
                            /* TODO: implement edit appointment functionality */
                          }}
                        >
                          Edit
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Sidebar for date, search + add appointment */}
        <div
          style={{
            width: '250px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flexShrink: 0,
          }}
        >
          {/* Fixed date display */}
          <div
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            <div style={{ fontSize: '3rem' }}>{fixedDate.getFullYear()}</div>
            <div style={{ fontSize: '3rem' }}>
              {fixedDate.toLocaleString('default', { month: 'long' })}
            </div>
            <div style={{ fontSize: '3rem' }}>{fixedDate.getDate()}</div>
          </div>
          
            {/* Calendar button */}
            <Button variant="primary" onClick={openCalendar}>
            Calendar
            </Button>
          {/* Search bar */}
          <Form.Control
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Add appointment button */}
          <Button variant="primary" onClick={openPopup}>
            Add new appointment
          </Button>
        </div>
      </div>
      <NewAppointmentPopup
        show={showPopup}
        handleClose={closePopup}
        onSuccess={handleSuccess}
        workers={allWorkers}
        services={services}
        timeSlots={timeSlots}
      />

      <SuccessNotifier
        show={showSuccess}
        message="Appointment created successfully!"
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
