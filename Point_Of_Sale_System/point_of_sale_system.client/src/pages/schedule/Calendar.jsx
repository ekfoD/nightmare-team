import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { getDateSummary } from "../../api/ScheduleApi";

export default function Calendar({ onDayClick }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [summary, setSummary] = useState({}); // { "2025-11-28": 3, ... }

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const buttonSize = 80;
  const fontSize = 20;

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  // Load summary from backend
  useEffect(() => {
    async function loadSummary() {
      const data = await getDateSummary();
      setSummary(data);
    }
    loadSummary();
  }, []);

  const generateCalendar = () => {
    const numDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const totalCells = 5 * 7;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startDay + 1;
      const isWeekend = i % 7 === 5 || i % 7 === 6;

      if (i >= startDay && dayNumber <= numDays) {
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(dayNumber).padStart(2,"0")}`;
        const hasSchedule = summary[dateString] > 0;

        cells.push(
          <Col key={i} className="p-1 d-flex justify-content-center">
            <Button
              variant={hasSchedule ? "primary" : "light"}
              style={{
                width: buttonSize,
                height: buttonSize,
                fontSize: fontSize,
                borderColor: "var(--calendar-border)",
                color: isWeekend ? "var(--calendar-weekend-text)" : "black",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                transition: "0.2s ease",
              }}
              onClick={() => onDayClick(dateString)}
              onMouseEnter={e => e.target.style.backgroundColor = "var(--calendar-day-hover)"}
              onMouseLeave={e => e.target.style.backgroundColor = hasSchedule ? "#0d6efd" : "var(--calendar-day-bg)"}
            >
              {dayNumber}
            </Button>
          </Col>
        );
      } else {
        cells.push(<Col key={i} className="p-1 d-flex justify-content-center"><div style={{ width: buttonSize, height: buttonSize }}></div></Col>);
      }
    }

    const weeks = [];
    for (let i = 0; i < 5; i++) {
      weeks.push(<Row key={i} className="mb-1">{cells.slice(i*7,(i+1)*7)}</Row>);
    }
    return weeks;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: "max-content", borderRadius: "14px", boxShadow: "0 3px 10px rgba(0,0,0,0.12)" }}>
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col xs="auto"><Button variant="outline-dark" onClick={handlePrevMonth}>&lt;</Button></Col>
            <Col className="text-center"><h4 style={{ marginBottom: 0 }}>{monthNames[currentMonth]} {currentYear}</h4></Col>
            <Col xs="auto"><Button variant="outline-dark" onClick={handleNextMonth}>&gt;</Button></Col>
          </Row>

          <Row className="mb-2 text-center">
            {weekDays.map((d, idx) => <Col key={idx} style={{ fontSize: fontSize*0.8, opacity:0.7 }}>{d}</Col>)}
          </Row>

          {generateCalendar()}
        </Card.Body>
      </Card>
    </div>
  );
}
