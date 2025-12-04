import { useState } from "react";

const dummyData = [
  {
    id: "#23546",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Item A", quantity: 1, price: 5 },
      { name: "Item B", quantity: 4, price: 20 },
      { name: "Item C", quantity: 1, price: 10 }
    ],
    subtotal: 18,
    tax: 4.25,
    total: 20.25
  },
  {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
    {
    id: "#2563",
    date: "10 Oct 2025 12:42:36",
    items: [
      { name: "Service X", quantity: 1, price: 30 },
      { name: "Addon Y", quantity: 2, price: 10 }
    ],
    subtotal: 40,
    tax: 6,
    total: 46
  },
  {
    id: "#9911",
    date: "11 Oct 2025 09:10:11",
    items: [{ name: "Massage", quantity: 1, price: 55 }],
    subtotal: 55,
    tax: 11,
    total: 66
  }
];

export default function OrderHistory() {
  const [selected, setSelected] = useState(dummyData[0]);

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
            fontWeight: "600"
          }}
        >
          Archived Orders
        </div>

        {/* scrollable list */}
        <div
          style={{
            overflowY: "auto",
            flexGrow: 1
          }}
        >
          {dummyData.map((order) => (
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
            </div>
          ))}
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

        {/* totals */}
        <div style={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "14px" }}>
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
