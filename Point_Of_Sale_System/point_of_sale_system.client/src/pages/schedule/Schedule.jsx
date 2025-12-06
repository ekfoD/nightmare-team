// App.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewAppointmentPopup from './NewAppointmentPopup';
import Calendar from './Calendar';

const allWorkers = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Alice', photo: 'https://via.placeholder.com/50' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Bob', photo: 'https://via.placeholder.com/50' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Charlie', photo: 'https://via.placeholder.com/50' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Diana', photo: 'https://via.placeholder.com/50' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Eve', photo: 'https://via.placeholder.com/50' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Frank', photo: 'https://via.placeholder.com/50' },
  { id: '77777777-7777-7777-7777-777777777777', name: 'Grace', photo: 'https://via.placeholder.com/50' },
  { id: '88888888-8888-8888-8888-888888888888', name: 'Hank', photo: 'https://via.placeholder.com/50' },
  { id: '99999999-9999-9999-9999-999999999999', name: 'Ivy', photo: 'https://via.placeholder.com/50' },
];


// const appointments = [
//   { worker: 'Alice', time: '08:30' },
//   { worker: 'Bob', time: '09:00' },
//   { worker: 'Charlie', time: '10:00' },
//   { worker: 'Alice', time: '11:00' },
//   { worker: 'Diana', time: '12:30' },
//   { worker: 'Eve', time: '12:30' },
//   { worker: 'Frank', time: '14:00' },
// ];

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
  const [appointments, setAppointments] = useState([]);

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

  const timeSlots = times;
  
  // Filter workers based on search term
  const workers = allWorkers.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const fixedDate = new Date('2025-11-28');
  // Fixed date for now

  useEffect(() => {
  async function loadAppointments() {
    try {
      const res = await fetch(`/api/schedule/${fixedDate.toISOString().slice(0,10)}`);
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();

      const mapped = data.map(a => ({
        worker: allWorkers.find(w => w.id === a.EmploeeId)?.name || 'Unknown',
        time: a.StartTime.slice(0,5), // HH:mm
        id: a.Id,
        customerName: a.CustomerName,
        customerPhone: a.CustomerPhone,
        extraInfo: a.ExtraInformation
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error(err);
    }
  }
  loadAppointments();
}, [fixedDate]);


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
        workers={allWorkers}
        services={services}
        timeSlots={timeSlots}
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
