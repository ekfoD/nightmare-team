import { useState, useMemo } from "react";

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
  const [sortKey, setSortKey] = useState("date"); // id, employee, customer, service

  const filteredAppointments = useMemo(() => {
    let filtered = dummyAppointments.filter(
      (app) =>
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey === "date") {
      filtered.sort((a, b) => new Date(b.date + " " + b.appointmentTime) - new Date(a.date + " " + a.appointmentTime));
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
    <div
      style={{
        width: "1100px",
        height: "600px",
        margin: "40px auto",
        background: "#f2f2f2",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        gap: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        color: "#000"
      }}
    >
      {/* LEFT — APPOINTMENT LIST */}
      <div
        style={{
          width: "40%",
          height: "100%",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>Appointments</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            style={{ fontSize: "14px", padding: "2px 6px" }}
          >
            <option value="date">Sort by Date/Time</option>
            <option value="id">Sort by ID</option>
            <option value="employee">Sort by Employee</option>
            <option value="customer">Sort by Customer</option>
            <option value="service">Sort by Service</option>
          </select>
        </div>

        <div style={{ padding: "8px 16px", borderBottom: "1px solid #ddd" }}>
          <input
            type="text"
            placeholder="Search by ID, worker, customer, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelected(app)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                background: selected.id === app.id ? "#e8eefc" : "transparent",
                borderBottom: "1px solid #eee",
                transition: "0.15s"
              }}
            >
              <div style={{ fontWeight: "600" }}>{app.id}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                {app.date} — {app.appointmentTime}
              </div>
              <div style={{ fontSize: "13px", color: "#555" }}>
                Employee: {app.employee} | Customer: {app.customerName} | Service: {app.service}
              </div>
            </div>
          ))}
          {filteredAppointments.length === 0 && (
            <div style={{ padding: "12px 16px", color: "#999" }}>No appointments found</div>
          )}
        </div>
      </div>

      {/* RIGHT — APPOINTMENT DETAILS */}
      <div
        style={{
          width: "60%",
          height: "100%",
          background: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        <div style={{ marginBottom: "10px", fontWeight: "600", fontSize: "18px" }}>
          Appointment Details — {selected.id}
        </div>

        <div style={{ flexGrow: 1, overflowY: "auto" }}>
          <div style={{ marginBottom: "10px" }}>
            <div><strong>Employee:</strong> {selected.employee}</div>
            <div><strong>Time:</strong> {selected.appointmentTime}</div>
            <div><strong>Service:</strong> {selected.service}</div>
            <div><strong>Customer:</strong> {selected.customerName}</div>
            <div><strong>Phone:</strong> {selected.phone}</div>
            {selected.extraInfo && <div><strong>Extra Info:</strong> {selected.extraInfo}</div>}
          </div>
        </div>

        {/* Refund button & totals fixed at bottom */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#ffffff",
            paddingTop: "10px",
            borderTop: "1px solid #ddd"
          }}
        >
          <button
            onClick={handleRefund}
            style={{
              background: "#dc3545",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            Refund
          </button>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span> <span>{selected.subtotal} €</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span>Tax</span> <span>{selected.tax} €</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              fontWeight: "700",
              fontSize: "18px"
            }}
          >
            <span>Total</span> <span>{selected.total} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
