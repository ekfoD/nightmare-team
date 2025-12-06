import { useState, useMemo } from "react";

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
  },
  {
    id: "#23550",
    date: "14 Oct 2025 11:30:12",
    employee: "Alice",
    items: [
      { name: "Cheeseburger", quantity: 1, price: 9 },
      { name: "Onion Rings", quantity: 2, price: 4 }
    ],
    subtotal: 17,
    tax: 1.7,
    total: 18.7
  },
  {
    id: "#23551",
    date: "15 Oct 2025 13:45:00",
    employee: "Diana",
    items: [
      { name: "Chicken Caesar Wrap", quantity: 1, price: 8 },
      { name: "Lemonade", quantity: 1, price: 3 }
    ],
    subtotal: 11,
    tax: 1.1,
    total: 12.1
  },
  {
    id: "#23552",
    date: "16 Oct 2025 10:10:44",
    employee: "Bob",
    items: [
      { name: "BBQ Ribs", quantity: 1, price: 16 },
      { name: "Coleslaw", quantity: 1, price: 4 }
    ],
    subtotal: 20,
    tax: 2,
    total: 22
  },
  {
    id: "#23553",
    date: "17 Oct 2025 15:25:18",
    employee: "Charlie",
    items: [
      { name: "Tacos", quantity: 2, price: 6 },
      { name: "Churros", quantity: 1, price: 3 }
    ],
    subtotal: 15,
    tax: 1.5,
    total: 16.5
  },
  {
    id: "#23554",
    date: "18 Oct 2025 12:00:00",
    employee: "Diana",
    items: [
      { name: "Vegetable Stir Fry", quantity: 1, price: 9 },
      { name: "Spring Rolls", quantity: 2, price: 4 }
    ],
    subtotal: 17,
    tax: 1.7,
    total: 18.7
  },
  {
    id: "#23555",
    date: "19 Oct 2025 09:10:11",
    employee: "Alice",
    items: [
      { name: "Pancake Stack", quantity: 1, price: 7 },
      { name: "Coffee", quantity: 1, price: 3 }
    ],
    subtotal: 10,
    tax: 1,
    total: 11
  }
];


export default function OrderHistory() {
  const [selected, setSelected] = useState(dummyData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");

  // Filtered & sorted orders
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
      {/* LEFT — ORDER LIST */}
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
          <span>Archived Orders</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            style={{ fontSize: "14px", padding: "2px 6px" }}
          >
            <option value="date">Sort by Date</option>
            <option value="employee">Sort by Employee</option>
          </select>
        </div>

        {/* Search bar */}
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #ddd" }}>
          <input
            type="text"
            placeholder="Search by ID, date, or employee..."
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

        {/* scrollable list */}
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                background: selected.id === order.id ? "#e8eefc" : "transparent",
                borderBottom: "1px solid #eee",
                transition: "0.15s"
              }}
            >
              <div style={{ fontWeight: "600" }}>{order.id}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>{order.date}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>Employee: {order.employee}</div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div style={{ padding: "12px 16px", color: "#999" }}>No orders found</div>
          )}
        </div>
      </div>

      {/* RIGHT — ORDER DETAILS */}
      <div
        style={{
          width: "60%",
          height: "100%",
          background: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            fontWeight: "600",
            fontSize: "18px"
          }}
        >
          Order Details — {selected.id}
        </div>

        <div style={{ flexGrow: 1, overflowY: "auto", paddingRight: "10px" }}>
          {selected.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontWeight: "600" }}>{item.name}</div>
                {item.quantity > 1 && (
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Quantity: {item.quantity}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: "600" }}>{item.price} €</div>
            </div>
          ))}
        </div>

        {/* employee & totals */}
        <div style={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "14px" }}>
          <div style={{ marginBottom: "8px", fontWeight: "600" }}>
            Employee: {selected.employee}
          </div>
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
