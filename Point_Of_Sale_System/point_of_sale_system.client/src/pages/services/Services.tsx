import { useState } from "react";
import '../../styles/Services.css';
import CreateServiceModal from "./CreateServiceModal";

const servicesData = [
  { id: "#S001", name: "Haircut", description: "Professional haircut tailored to your style and preference.", price: 25, duration: "30 min" },
  { id: "#S002", name: "Hair Coloring", description: "Full or partial hair coloring using high-quality dyes.", price: 60, duration: "60 min" },
  { id: "#S003", name: "Manicure", description: "Classic manicure including nail shaping, cuticle care, and polish.", price: 20, duration: "30 min" },
  { id: "#S004", name: "Pedicure", description: "Relaxing pedicure treatment including exfoliation and nail care.", price: 25, duration: "40 min" },
  { id: "#S005", name: "Facial", description: "Deep cleansing facial to rejuvenate and hydrate your skin.", price: 40, duration: "45 min" },
  { id: "#S006", name: "Massage", description: "Full-body massage to relax muscles and reduce tension.", price: 55, duration: "60 min" }
];

export default function Services() {
  const [selected, setSelected] = useState(servicesData[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateService = () => {
  console.log("Created:");
  // Later you'll push this to database or state
};


  return (
    <div className="services-container">
      {/* LEFT — SERVICES LIST */}
      <div className="services-list">
        <div className="services-list-header">Services</div>
        <div className="services-list-scroll">
          {servicesData.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelected(service)}
              className={`service-item ${selected.id === service.id ? 'selected' : ''}`}
            >
              <div className="service-name">{service.name}</div>
              <div className="service-duration">{service.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — SERVICE DETAILS */}
      <div className="service-details">
        <div>
          <div className="service-title">{selected.name}</div>
          <div className="service-info">
            <div>
              <strong>Description:</strong>
              <p>{selected.description}</p>
            </div>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Price: {selected.price} €</div>
            <div style={{ fontWeight: 600 }}>Duration: {selected.duration}</div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="bottom-buttons">
          <button
            className="btn btn-success"
            onClick={() => setShowCreateModal(true)}
          >
            Create new
          </button>

          <div>
            <button className="btn btn-primary me-2">Edit</button>
            <button className="btn btn-danger">Delete</button>
          </div>
        </div>
        <CreateServiceModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateService}
        />
      </div>
    </div>
  );
}
