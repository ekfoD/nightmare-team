import { useState, useEffect } from "react";
import '../../styles/Services.css';
import CreateServiceModal from "./CreateServiceModal";
import axios from "axios";

const ORGANIZATION_ID = "8bbb7afb-d664-492a-bcd2-d29953ab924e";

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null); 
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`/api/services/full/${ORGANIZATION_ID}`);
      setServices(response.data);
      if (response.data.length > 0) setSelected(response.data[0]);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Create service
  const handleCreateService = async (service) => {
    try {
      const payload = {
        name: service.name,
        duration: service.durationMinutes,
        price: service.price,
        description: service.description,
        status: service.status,
        organizationId: ORGANIZATION_ID
      };
      await axios.post("/api/services", payload);
      setShowCreateModal(false);
      fetchServices(); // refresh list after creation
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  if (!selected) return <div>Loading...</div>;

  return (
    <div className="services-container">

      {/* LEFT — SERVICES LIST */}
      <div className="services-list">
        <div className="services-list-header">Services</div>
        <div className="services-list-scroll">
          {services.map(service => (
            <div
              key={service.id}
              onClick={() => setSelected(service)}
              className={`service-item ${selected.id === service.id ? 'selected' : ''}`}
            >
              <div className="service-name">{service.name}</div>
              <div className="service-duration">{formatDuration(service.duration)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — DETAILS */}
      <div className="service-details">
        <div>
          <div className="service-title">{selected.name}</div>
          <div className="service-info">
            <div>
              <strong>Description:</strong>
              <p>{selected.description}</p>
            </div>
            <div style={{ fontWeight: 600, marginBottom: "8px" }}>Price: {selected.price} €</div>
            <div style={{ fontWeight: 600 }}>Duration: {formatDuration(selected.duration)}</div>
            <div>Status: {selected.status}</div>
          </div>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="bottom-buttons">
          <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>Create new</button>
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
