import { useEffect, useMemo, useState } from "react";
import "../../styles/History.css";

const ORGANIZATION_ID = "a886c4f8-bbdb-4151-b1b6-679fbd5f4a2e";

export default function AppointmentPayments() {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/Appointments/pending/${ORGANIZATION_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load appointments");
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        setSelected(data[0] ?? null);
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredAppointments = useMemo(() => {
    let filtered = appointments.filter(
      (a) =>
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey === "date") {
      filtered.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
    }

    return filtered;
  }, [appointments, searchTerm, sortKey]);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handlePay = () => {
    alert(`Proceeding to payment for ${selected.id}`);
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="order-history-container">
      {/* LEFT */}
      <div className="order-list">
        <div className="list-header">
          <span>Pending Payments</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="date">Sort by Start Time</option>
          </select>
        </div>

        <div className="list-search">
          <input
            placeholder="Search customer, employee, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="list-scroll">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelected(app)}
              className={`list-item ${
                selected?.id === app.id ? "selected" : ""
              }`}
            >
              <div className="item-id">
                {formatTime(app.startTime)} – {formatTime(app.endTime)}
              </div>
              <div className="item-date">{app.customerName}</div>
              <div className="item-emp">
                {app.employeeName} | {app.serviceName}
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="no-orders">No pending payments</div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="order-details">
        {selected && (
          <>
            <div className="details-title">
              Appointment — {selected.customerName}
            </div>

            <div className="details-scroll">
              <div><strong>Employee:</strong> {selected.employeeName}</div>
              <div>
                <strong>Time:</strong>{" "}
                {formatTime(selected.startTime)} –{" "}
                {formatTime(selected.endTime)}
              </div>
              <div><strong>Service:</strong> {selected.serviceName}</div>
              <div><strong>Customer:</strong> {selected.customerName}</div>
              <div><strong>Phone:</strong> {selected.customerPhone}</div>
              {selected.extraInfo && (
                <div><strong>Extra Info:</strong> {selected.extraInfo}</div>
              )}
              <div>
                <strong>Status:</strong> {selected.paymentStatus}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-total">
                <span>Total</span>
                <span>—</span>
              </div>

              <div className="payment-actions">
                <div className="payment-left">
                  <button className="secondary-action">Apply Discount</button>
                  <button className="secondary-action">Use Giftcard</button>
                </div>

                <button
                  className="payment-primary"
                  onClick={handlePay}
                  disabled={selected.paymentStatus !== "pending"}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
