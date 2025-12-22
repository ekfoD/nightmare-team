// AppointmentHistory.jsx
import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import "../../styles/History.css";

export default function AppointmentHistory() {
  const { auth } = useAuth();
  const organizationId = auth.businessId;

  const [receipts, setReceipts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/Receipt/appointment/${organizationId}`)
      .then((res) => {
        setReceipts(res.data);
        setSelected(res.data[0] ?? null);
      })
      .catch(() => setReceipts([]))
      .finally(() => setLoading(false));
  }, [organizationId]);

  const filteredReceipts = useMemo(() => {
    let filtered = receipts.filter(
      (r) =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey === "date") {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortKey === "employee") {
      filtered.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
    } else if (sortKey === "customer") {
      filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
    } else if (sortKey === "service") {
      filtered.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    }

    return filtered;
  }, [receipts, searchTerm, sortKey]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const calculateTotals = (receipt) => {
    const taxTotal = receipt.taxes.reduce(
      (sum, t) => sum + t.affectedAmount,
      0
    );
    const discountTotal = receipt.discounts.reduce(
      (sum, d) => sum + d.affectedAmount,
      0
    );
    const giftcardTotal = receipt.giftcards?.reduce(
      (sum, g) => sum + g,
      0
    ) ?? 0;

    const total = receipt.servicePrice + taxTotal - discountTotal - giftcardTotal;

    return { taxTotal, discountTotal, giftcardTotal, total };
  };
  const handleRefund = async () => {
  if (!selected) return;

  if (!window.confirm(`Are you sure you want to refund this payment?`)) return;

  try {
    await api.put(`/Receipt/${selected.id}/refund`);
    alert("Refund successful!");

    // Update frontend
    setReceipts(prev => prev.map(r => 
      r.id === selected.id ? { ...r, paymentStatus: "refunded" } : r
    ));
    setSelected(prev => prev && prev.id === selected.id ? { ...prev, paymentStatus: "refunded" } : prev);
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.error || "Refund failed");
  }
};


  if (loading) return <div>Loading receipts...</div>;

  return (
    <div className="order-history-container">
      {/* LEFT — RECEIPT LIST */}
      <div className="order-list">
        <div className="list-header">
          <span>Receipts</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="employee">Sort by Employee</option>
            <option value="customer">Sort by Customer</option>
            <option value="service">Sort by Service</option>
          </select>
        </div>

        <div className="list-search">
          <input
            placeholder="Search receipt, customer, employee, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="list-scroll">
          {filteredReceipts.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelected(r)}
              className={`list-item ${
                selected?.id === r.id ? "selected" : ""
              }`}
            >
              <div className="item-id">
                {r.timestamp} — {r.employeeName}
              </div>

              <div className="item-date">
                {formatTime(r.startTime)} – {formatTime(r.endTime)}
              </div>

              <div className="item-emp">
                {r.serviceName} | {r.customerName}
              </div>
            </div>
          ))}

          {filteredReceipts.length === 0 && (
            <div className="no-orders">No receipts found</div>
          )}
        </div>
      </div>

      {/* RIGHT — RECEIPT DETAILS */}
      <div className="order-details">
        {selected && (() => {
          const { total } = calculateTotals(selected);
          const currencySymbol = (selected.currency === "euro" ? "€" : (selected.currency === "dollar" ? "$" : "currency"));

          return (
            <>
              <div className="details-title">
                Receipt — {selected.id}
              </div>

              <div className="details-scroll">
                <div><strong>Date:</strong> {formatDate(selected.startTime)}</div>
                <div>
                  <strong>Time:</strong>{" "}
                  {formatTime(selected.startTime)} – {formatTime(selected.endTime)}
                </div>
                <div><strong>Employee:</strong> {selected.employeeName}</div>
                <div><strong>Service:</strong> {selected.serviceName}</div>
                <div><strong>Customer:</strong> {selected.customerName}</div>
                <div><strong>Status:</strong> {selected.paymentStatus}</div>
              </div>

              {/* PRICE SUMMARY — SAME STYLE AS PAYMENTS */}
              <div className="order-summary">
                <div className="summary-total">
                  <div className="price-row">
                    <span className="price-label">Base Price:</span>
                    <span className="price-value">
                      {currencySymbol} {selected.servicePrice.toFixed(2)}
                    </span>
                  </div>

                  {selected.taxes.map((t) => (
                    <div className="price-row" key={t.id}>
                      <span className="price-label">
                        + {t.name}{" "}
                        {t.numberType === "percentage"
                          ? `(${t.amount}%)`
                          : "(flat)"}
                      </span>

                      <span className="price-value">
                        {currencySymbol} +{t.affectedAmount.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {selected.discounts.map((d) => (
                    <div className="price-row" key={d.id}>
                      <span className="price-label">
                        - {d.name}
                      </span>
                      <span className="price-value">
                        {currencySymbol} -{d.affectedAmount.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Giftcards applied */}
                  {selected.giftcards && selected.giftcards.length > 0 && (
                    <div className="price-row">
                      <span className="price-label">Giftcards Applied:</span>
                      <span className="price-value">
                        {currencySymbol} -{selected.giftcards.reduce((sum, g) => sum + g, 0).toFixed(2)}
                      </span>
                    </div>
                  )}


                  <div className="price-row final-price">
                    <span className="price-label">
                      <strong>Total:</strong>
                    </span>
                    <span className="price-value">
                      <strong>
                        {currencySymbol} {total.toFixed(2)}
                      </strong>
                    </span>
                  </div>
                  <div className="payment-actions">
                    <div className="payment-left">
                      <button
                        className="secondary-action"
                        onClick={() => window.print()}
                      >
                        Print Receipt
                      </button>
                    </div>

                    <button
                    className="payment-primary"
                    onClick={handleRefund}
                    disabled={selected.paymentStatus !== "succeeded"}
                  >
                    {selected.paymentStatus === "refunded" ? "Refunded" : "Refund"}
                  </button>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
