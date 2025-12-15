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

  const [giftcards, setGiftcards] = useState([]);
  const [appliedGiftcards, setAppliedGiftcards] = useState([]);
  const [giftcardError, setGiftcardError] = useState("");

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

  // Fetch giftcards for organization
  useEffect(() => {
    fetch(`/api/Giftcard/organization/${ORGANIZATION_ID}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setGiftcards(data))
      .catch(() => setGiftcards([]));
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

  const applyGiftcard = () => {
    const inputId = prompt("Enter Giftcard ID to apply:");
    if (!inputId) return;

    const giftcard = giftcards.find(g => g.id === inputId);
    if (!giftcard) {
      setGiftcardError("Giftcard does not exist.");
      return;
    }

    if (appliedGiftcards.find(g => g.id === giftcard.id)) {
      setGiftcardError("This giftcard is already applied.");
      return;
    }

    const today = new Date();
    const validUntil = new Date(giftcard.validUntil);
    if (validUntil < today) {
      setGiftcardError("Giftcard has expired.");
      return;
    }

    setGiftcardError("");
    setAppliedGiftcards([...appliedGiftcards, giftcard]);
  };

  const calculateFinalPrice = (service) => {
    const { totalTaxes } = calculateTaxes(service);
    let totalPrice = service.price + parseFloat(totalTaxes);
    const giftcardTotal = appliedGiftcards.reduce((sum, g) => sum + g.balance, 0);
    totalPrice = Math.max(0, totalPrice - giftcardTotal); // cannot go below 0
    return totalPrice.toFixed(2);
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
              onClick={() => {
                setSelected(app);
                setAppliedGiftcards([]); // reset applied giftcards when selecting new appointment
                setGiftcardError("");
              }}
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
        {selected && menuServices[selected.menuServiceId] && (() => {
          const service = menuServices[selected.menuServiceId];
          const { breakdown } = calculateTaxes(service);
          const currencySymbol = service.currency === "euro" ? "€" : "$";

          return (
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

                  {appliedGiftcards.map((g) => (
                    <div className="price-row" key={g.id}>
                      <span className="price-label">- Giftcard:</span>
                      <span className="price-value">{currencySymbol} {g.balance.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="price-row final-price">
                    <span className="price-label"><strong>Final Price:</strong></span>
                    <span className="price-value"><strong>{currencySymbol} {calculateFinalPrice(service)}</strong></span>
                  </div>

                  {giftcardError && <div style={{ color: "red" }}>{giftcardError}</div>}
                </div>

                <div className="payment-actions">
                  <div className="payment-left">
                    <button className="secondary-action">Apply Discount</button>
                    <button className="secondary-action" onClick={applyGiftcard}>Use Giftcard</button>
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
          );
        })()}
      </div>
    </div>
  );
}
