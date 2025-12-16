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
      .get(`https://localhost:7079/api/Receipt/appointment/${organizationId}`)
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

  const formatDateTime = (date) =>
    new Date(date).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const calculateTotals = (receipt) => {
    const taxTotal = receipt.taxes.reduce((sum, t) => sum + t.amount, 0);
    const discountTotal = receipt.discounts.reduce(
      (sum, d) => sum + d.affectedAmount,
      0
    );

    const total = receipt.servicePrice + taxTotal - discountTotal;

    return { taxTotal, discountTotal, total };
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
              <div className="item-id">{r.id}</div>
              <div className="item-date">
                {formatDateTime(r.startTime)} – {formatDateTime(r.endTime)}
              </div>
              <div className="item-emp">
                {r.employeeName} | {r.customerName} | {r.serviceName}
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
          const { taxTotal, discountTotal, total } =
            calculateTotals(selected);

          return (
            <>
              <div className="details-title">
                Receipt — {selected.customerName}
              </div>

              <div className="details-scroll">
                <div><strong>Employee:</strong> {selected.employeeName}</div>
                <div>
                  <strong>Time:</strong>{" "}
                  {formatDateTime(selected.startTime)} –{" "}
                  {formatDateTime(selected.endTime)}
                </div>
                <div><strong>Service:</strong> {selected.serviceName}</div>
                <div><strong>Customer:</strong> {selected.customerName}</div>
                <div><strong>Status:</strong> {selected.paymentStatus}</div>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Service Price</span>
                  <span>{selected.servicePrice.toFixed(2)} €</span>
                </div>

                {selected.taxes.map((t) => (
                  <div className="summary-row" key={t.id}>
                    <span>+ {t.name}</span>
                    <span>{t.amount.toFixed(2)} €</span>
                  </div>
                ))}

                {selected.discounts.map((d) => (
                  <div className="summary-row" key={d.id}>
                    <span>- {d.name}</span>
                    <span>{d.affectedAmount.toFixed(2)} €</span>
                  </div>
                ))}

                <div className="summary-total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
