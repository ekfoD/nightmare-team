import { useState } from "react";

const servicesData = [
  {
    id: "#S001",
    name: "Haircut",
    description: "Professional haircut tailored to your style and preference.",
    price: 25,
    duration: "30 min"
  },
  {
    id: "#S002",
    name: "Hair Coloring",
    description: "Full or partial hair coloring using high-quality dyes.",
    price: 60,
    duration: "60 min"
  },
  {
    id: "#S003",
    name: "Manicure",
    description: "Classic manicure including nail shaping, cuticle care, and polish.",
    price: 20,
    duration: "30 min"
  },
  {
    id: "#S004",
    name: "Pedicure",
    description: "Relaxing pedicure treatment including exfoliation and nail care.",
    price: 25,
    duration: "40 min"
  },
  {
    id: "#S005",
    name: "Facial",
    description: "Deep cleansing facial to rejuvenate and hydrate your skin.",
    price: 40,
    duration: "45 min"
  },
  {
    id: "#S006",
    name: "Massage",
    description: "Full-body massage to relax muscles and reduce tension.",
    price: 55,
    duration: "60 min"
  }
];


export default function Services() {
  const [selected, setSelected] = useState(servicesData[0]);

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
      {/* LEFT — SERVICES LIST */}
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
          Services
        </div>

        {/* scrollable list */}
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          {servicesData.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelected(service)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                background: selected.id === service.id ? "#e8eefc" : "transparent",
                borderBottom: "1px solid #eee",
                transition: "0.15s"
              }}
            >
              <div style={{ fontWeight: "600" }}>{service.name}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>{service.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — SERVICE DETAILS */}
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
          {selected.name}
        </div>

        <div style={{ flexGrow: 1, overflowY: "auto", paddingRight: "10px" }}>
          <div style={{ marginBottom: "16px" }}>
            <strong>Description:</strong>
            <p style={{ marginTop: "4px", color: "#333" }}>{selected.description}</p>
          </div>

          <div style={{ marginBottom: "8px", fontWeight: "600" }}>
            Price: {selected.price} €
          </div>
          <div style={{ fontWeight: "600" }}>
            Duration: {selected.duration}
          </div>
        </div>
      </div>
    </div>
  );
}
