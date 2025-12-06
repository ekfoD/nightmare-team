// OrderHistory.jsx
import { useState, useMemo } from "react";
import "../../styles/History.css";

const dummyData = [
  {
    id: "#23546",
    date: "10 Oct 2025 12:42:36",
    employee: "Alice",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 8 },
      { name: "Caesar Salad", quantity: 2, price: 6 },
      { name: "Soft Drink", quantity: 1, price: 3 }
    ],
    subtotal: 23,
    tax: 2.3,
    total: 25.3
  },
  {
    id: "#23548",
    date: "12 Oct 2025 14:20:10",
    employee: "Bob",
    items: [
      { name: "Spaghetti Bolognese", quantity: 1, price: 10 },
      { name: "Garlic Bread", quantity: 2, price: 4 }
    ],
    subtotal: 18,
    tax: 1.8,
    total: 19.8
  },
  {
    id: "#23549",
    date: "13 Oct 2025 16:05:50",
    employee: "Charlie",
    items: [
      { name: "Grilled Salmon", quantity: 1, price: 15 },
      { name: "French Fries", quantity: 1, price: 5 }
    ],
    subtotal: 20,
    tax: 2,
    total: 22
  }
];

export default function OrderHistory() {
  const [selected, setSelected] = useState(dummyData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");

  const filteredOrders = useMemo(() => {
    let filtered = dummyData.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.employee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortKey === "employee") {
      filtered.sort((a, b) => a.employee.localeCompare(b.employee));
    }

    return filtered;
  }, [searchTerm, sortKey]);

  return (
    <div className="order-history-container">
      <div className="order-list">
        <div className="list-header">
          <span>Archived Orders</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="employee">Sort by Employee</option>
          </select>
        </div>

        <div className="list-search">
          <input
            type="text"
            placeholder="Search by ID, date, or employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="list-scroll">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              className={selected.id === order.id ? "list-item selected" : "list-item"}
            >
              <div className="item-id">{order.id}</div>
              <div className="item-date">{order.date}</div>
              <div className="item-emp">Employee: {order.employee}</div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="no-orders">No orders found</div>
          )}
        </div>
      </div>

      <div className="order-details">
        <div className="details-title">Order Details — {selected.id}</div>

        <div className="details-scroll">
          {selected.items.map((item, idx) => (
            <div key={idx} className="detail-row">
              <div>
                <div className="detail-name">{item.name}</div>
                {item.quantity > 1 && (
                  <div className="detail-qty">Quantity: {item.quantity}</div>
                )}
              </div>
              <div className="detail-price">{item.price} €</div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <button
            className="refund-button"
            onClick={() => alert(`Refund initiated for order ${selected.id}`)}
          >
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
