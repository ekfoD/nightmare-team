import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

export default function Calendar({ onDaySelect, appointmentDates = [] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  const appointmentSet = new Set(
  appointmentDates.map(d => new Date(d).toISOString().split("T")[0])
  );

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  //const buttonSize = 80;
  const fontSize = 20;

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Adjust first day: Monday = 0
  const firstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay(); // 0 = Sunday
    return day === 0 ? 6 : day - 1; // Shift Sunday to end, Monday = 0
  };

  const generateCalendar = () => {
  const numDays = daysInMonth(currentMonth, currentYear);
  const startDay = firstDayOfMonth(currentMonth, currentYear);

  const totalCells = 5 * 7;
  const cells = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDay + 1;

    if (i >= startDay && dayNumber <= numDays) {

      const fullDate = new Date(currentYear, currentMonth, dayNumber);
      const dateStr = fullDate.toISOString().split("T")[0];

      const isSelected =
        selectedDate.toDateString() === fullDate.toDateString();

      const hasAppointments = appointmentSet.has(dateStr);

      cells.push(
        <Col key={i} className="p-1 d-flex justify-content-center">
          <Button
            variant="light"
            onClick={() => {
              setSelectedDate(fullDate);
              onDaySelect(fullDate);
            }}
            style={{
              width: 80,
              height: 80,
              fontSize: 20,
              backgroundColor: isSelected
                ? "var(--calendar-selected)"
                : hasAppointments
                ? "var(--calendar-has-appointments)"
                : "var(--calendar-day-bg)",
              borderColor: "var(--calendar-border)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            {dayNumber}
          </Button>
        </Col>
      );
    } else {
      cells.push(<Col key={i} className="p-1"></Col>);
    }
  }

  const weeks = [];
  for (let i = 0; i < 5; i++) {
    weeks.push(
      <Row key={i} className="mb-1">{cells.slice(i * 7, (i + 1) * 7)}</Row>
    );
  }

  return weeks;
};


  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]; // Monday first

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Card
      style={{
        width: "max-content",
        borderRadius: "14px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
      }}
    >
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <Button variant="outline-dark" onClick={handlePrevMonth}>&lt;</Button>
          </Col>

          <Col className="text-center">
            <h4 style={{ marginBottom: 0 }}>
              {monthNames[currentMonth]} {currentYear}
            </h4>
          </Col>

          <Col xs="auto">
            <Button variant="outline-dark" onClick={handleNextMonth}>&gt;</Button>
          </Col>
        </Row>

        {/* Weekday headers */}
        <Row className="mb-2 text-center">
          {weekDays.map((d, idx) => (
            <Col
              key={idx}
              style={{
                fontSize: fontSize * 0.8,
                opacity: 0.7
              }}
            >
              {d}
            </Col>
          ))}
        </Row>

        {generateCalendar()}
      </Card.Body>
    </Card>
  </div>
);

}
