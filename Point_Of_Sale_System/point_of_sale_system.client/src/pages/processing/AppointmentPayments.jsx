import { useEffect, useMemo, useState } from "react";
import "../../styles/History.css";

const ORGANIZATION_ID = "a685b0d3-d465-4b02-8d66-5315e84f6cba";

export default function AppointmentPayments() {
  const [appointments, setAppointments] = useState([]);
  const [menuServices, setMenuServices] = useState({}); // services by id
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/Appointments/pending/${ORGANIZATION_ID}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setAppointments(data);
        setSelected(data[0] ?? null);
      })
      .catch(() => setAppointments([]));
  }, []);

  useEffect(() => {
    fetch(`/api/services/full/${ORGANIZATION_ID}`)
      .then((res) => res.json())
      .then((services) => {
        const map = {};
        services.forEach((s) => map[s.id] = s);
        setMenuServices(map);
      })
      .catch(() => setMenuServices({}))
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
      filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    }

    return filtered;
  }, [appointments, searchTerm, sortKey]);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const calculateTaxes = (service) => {
    let totalTaxes = 0;
    const breakdown = service.taxes.map((t) => {
      let taxAmount = t.numberType === "percentage"
        ? (service.price * t.amount) / 100
        : t.amount;
      totalTaxes += taxAmount;
      return { ...t, appliedAmount: taxAmount.toFixed(2) };
    });
    return { breakdown, totalTaxes: totalTaxes.toFixed(2) };
  };

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
              className={`list-item ${selected?.id === app.id ? "selected" : ""}`}
            >
              <div className="item-id">{formatTime(app.startTime)} – {formatTime(app.endTime)}</div>
              <div className="item-date">{app.customerName}</div>
              <div className="item-emp">{app.employeeName} | {app.serviceName}</div>
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
            <div className="details-title">Appointment — {selected.customerName}</div>

            <div className="details-scroll">
              <div><strong>Employee:</strong> {selected.employeeName}</div>
              <div><strong>Time:</strong> {formatTime(selected.startTime)} – {formatTime(selected.endTime)}</div>
              <div><strong>Service:</strong> {selected.serviceName}</div>
              <div><strong>Customer:</strong> {selected.customerName}</div>
              <div><strong>Phone:</strong> {selected.customerPhone}</div>
              {selected.extraInfo && <div><strong>Extra Info:</strong> {selected.extraInfo}</div>}
            </div>

            {/* PRICE SUMMARY */}
            {menuServices[selected.menuServiceId] && (() => {
              const service = menuServices[selected.menuServiceId];
              const { breakdown, totalTaxes } = calculateTaxes(service);
              const totalPrice = (service.price + parseFloat(totalTaxes)).toFixed(2);
              const currencySymbol = service.currency === "euro" ? "€" : "$";

              return (
                <div className="order-summary">
                  <div className="summary-total">
                    <div className="price-row">
                      <span className="price-label">Base Price:</span>
                      <span className="price-value">{currencySymbol} {service.price.toFixed(2)}</span>
                    </div>

                    {breakdown.map((t) => (
                      <div className="price-row" key={t.id}>
                        <span className="price-label">+ {t.name} ({t.numberType === "percentage" ? t.amount + "%" : t.amount}):</span>
                        <span className="price-value">{currencySymbol} {t.appliedAmount}</span>
                      </div>
                    ))}

                    {/* Giftcard example */}
                    {/* <div className="price-row">
                      <span className="price-label">- Giftcard:</span>
                      <span className="price-value">{currencySymbol} 5.00</span>
                    </div> */}

                    <div className="price-row final-price">
                      <span className="price-label"><strong>Final Price:</strong></span>
                      <span className="price-value"><strong>{currencySymbol} {totalPrice}</strong></span>
                    </div>
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
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
