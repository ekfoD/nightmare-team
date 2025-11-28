import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const buttonSize = 80; // Smaller buttons
  const fontSize = 20;   // Bigger numbers inside buttons

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const numDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);

    const totalCells = 5 * 7; // 5 rows x 7 days
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startDay + 1;
      if (i >= startDay && dayNumber <= numDays) {
        cells.push(
          <Col key={i} className="p-1">
            <Button
              variant="outline-primary"
              style={{ width: buttonSize, height: buttonSize, fontSize: fontSize, backgroundColor: "#efefffff" }}
              onClick={() => console.log(`Clicked day ${dayNumber}`)}
            >
              {dayNumber}
            </Button>
          </Col>
        );
      } else {
        cells.push(
          <Col key={i} className="p-1">
            <div style={{ width: buttonSize, height: buttonSize }}></div>
          </Col>
        );
      }
    }

    // Split into 5 rows
    const weeks = [];
    for (let i = 0; i < 5; i++) {
      weeks.push(
        <Row key={i} className="mb-1">
          {cells.slice(i * 7, (i + 1) * 7)}
        </Row>
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

  return (
    <Container className="mt-4">
      <Card style={{ width: "max-content", margin: "0 auto" }}>
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col xs="auto">
              <Button variant="secondary" onClick={handlePrevMonth}>&lt;</Button>
            </Col>
            <Col className="text-center">
              <h4>{monthNames[currentMonth]} {currentYear}</h4>
            </Col>
            <Col xs="auto">
              <Button variant="secondary" onClick={handleNextMonth}>&gt;</Button>
            </Col>
          </Row>

          {/* Weekday headers */}
          <Row className="mb-2 text-center">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => (
              <Col key={idx} style={{ width: "100%", fontSize: fontSize }}>{d}</Col>
            ))}
          </Row>

          {/* Calendar weeks */}
          {generateCalendar()}
        </Card.Body>
      </Card>
    </Container>
  );
}
