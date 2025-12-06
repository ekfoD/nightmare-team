// AppointmentHistory.jsx
import { useState, useMemo } from "react";
import "../../styles/History.css";

const dummyAppointments = [
  {
    id: "#A23546",
    date: "10 Oct 2025",
    appointmentTime: "07:00",
    employee: "Alice",
    service: "Haircut",
    customerName: "John Doe",
    phone: "+123456789",
    extraInfo: "Allergic to certain shampoos",
    subtotal: 25,
    tax: 2.5,
    total: 27.5
  },
  {
    id: "#A23547",
    date: "10 Oct 2025",
    appointmentTime: "07:30",
    employee: "Bob",
    service: "Manicure",
    customerName: "Mary Smith",
    phone: "+987654321",
    extraInfo: "",
    subtotal: 20,
    tax: 2,
    total: 22
  },
  {
    id: "#A23548",
    date: "11 Oct 2025",
    appointmentTime: "08:00",
    employee: "Charlie",
    service: "Massage",
    customerName: "Alex Johnson",
    phone: "+456789123",
    extraInfo: "Prefers strong pressure",
    subtotal: 50,
    tax: 5,
    total: 55
  },
  {
    id: "#A23549",
    date: "11 Oct 2025",
    appointmentTime: "08:30",
    employee: "Alice",
    service: "Nail Polish",
    customerName: "Sophie Brown",
    phone: "+321654987",
    extraInfo: "",
    subtotal: 15,
    tax: 1.5,
    total: 16.5
  },
  {
    id: "#A23550",
    date: "12 Oct 2025",
    appointmentTime: "09:00",
    employee: "Diana",
    service: "Facial",
    customerName: "Michael Lee",
    phone: "+111222333",
    extraInfo: "Sensitive skin",
    subtotal: 40,
    tax: 4,
    total: 44
  }
];

export default function AppointmentHistory() {
  const [selected, setSelected] = useState(dummyAppointments[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");

  const filteredAppointments = useMemo(() => {
    let filtered = dummyAppointments.filter(
      (app) =>
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.date + " " + b.appointmentTime) -
          new Date(a.date + " " + a.appointmentTime)
      );
    } else if (sortKey === "id") {
      filtered.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortKey === "employee") {
      filtered.sort((a, b) => a.employee.localeCompare(b.employee));
    } else if (sortKey === "customer") {
      filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
    } else if (sortKey === "service") {
      filtered.sort((a, b) => a.service.localeCompare(b.service));
    }

    return filtered;
  }, [searchTerm, sortKey]);

  const handleRefund = () => {
    alert(`Refund initiated for appointment ${selected.id}`);
  };

  return (
    <div className="order-history-container">
      {/* LEFT — APPOINTMENT LIST */}
      <div className="order-list">
        <div className="list-header">
          <span>Appointments</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="date">Sort by Date/Time</option>
            <option value="id">Sort by ID</option>
            <option value="employee">Sort by Employee</option>
            <option value="customer">Sort by Customer</option>
            <option value="service">Sort by Service</option>
          </select>
        </div>

        <div className="list-search">
          <input
            type="text"
            placeholder="Search by ID, worker, customer, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="list-scroll">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelected(app)}
              className={selected.id === app.id ? "list-item selected" : "list-item"}
            >
              <div className="item-id">{app.id}</div>
              <div className="item-date">
                {app.date} — {app.appointmentTime}
              </div>
              <div className="item-emp">
                Employee: {app.employee} | Customer: {app.customerName} | Service: {app.service}
              </div>
            </div>
          ))}
          {filteredAppointments.length === 0 && (
            <div className="no-orders">No appointments found</div>
          )}
        </div>
      </div>

      {/* RIGHT — APPOINTMENT DETAILS */}
      <div className="order-details">
        <div className="details-title">Appointment Details — {selected.id}</div>

        <div className="details-scroll">
          <div style={{ marginBottom: "10px" }}>
            <div><strong>Employee:</strong> {selected.employee}</div>
            <div><strong>Time:</strong> {selected.appointmentTime}</div>
            <div><strong>Service:</strong> {selected.service}</div>
            <div><strong>Customer:</strong> {selected.customerName}</div>
            <div><strong>Phone:</strong> {selected.phone}</div>
            {selected.extraInfo && <div><strong>Extra Info:</strong> {selected.extraInfo}</div>}
          </div>
        </div>

        <div className="order-summary">
          <button className="refund-button" onClick={handleRefund}>
            Refund
          </button>

          <div className="summary-row"><span>Subtotal</span><span>{selected.subtotal} €</span></div>
          <div className="summary-row"><span>Tax</span><span>{selected.tax} €</span></div>
          <div className="summary-total"><span>Total</span><span>{selected.total} €</span></div>
        </div>
      </div>
    </div>
  );
}
