import { useState, useEffect } from "react";
import '../../styles/Services.css';
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import SuccessNotifier from "../../utilities/SuccessNotifier";
import axios from "axios";

const ORGANIZATION_ID = "a886c4f8-bbdb-4151-b1b6-679fbd5f4a2e";

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Notifier state
  const [showNotifier, setShowNotifier] = useState(false);
  const [notifierMessage, setNotifierMessage] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/services/full/${ORGANIZATION_ID}`);
      setServices(response.data);

      if (response.data.length > 0) {
        setSelected(response.data[0]);
      } else {
        setSelected(null);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // CREATE
  const handleCreateService = async (service) => {
    try {
      const payload = {
        name: service.name,
        duration: service.durationMinutes,
        price: service.price,
        description: service.description,
        status: service.status,
        organizationId: ORGANIZATION_ID,
        taxId: "687dcd74-35f8-44ea-b743-e71cd2f6ef45"
      };
      await axios.post("/api/services", payload);
      setShowCreateModal(false);
      fetchServices();
      setNotifierMessage(`Service "${service.name}" created successfully!`);
      setShowNotifier(true);
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  // UPDATE
  const handleUpdateService = async (service) => {
    try {
      const payload = {
        name: service.name,
        duration: service.duration,
        price: service.price,
        description: service.description,
        status: service.status,
        organizationId: ORGANIZATION_ID,
        taxId: "687dcd74-35f8-44ea-b743-e71cd2f6ef45"
      };
      await axios.put(`/api/services/${service.id}`, payload);
      setShowEditModal(false);
      fetchServices();
      setNotifierMessage(`Service "${service.name}" updated successfully!`);
      setShowNotifier(true);
    } catch (error) {
      console.error("Failed to update service:", error);
      alert("Failed to update service. See console for details.");
    }
  };

  // DELETE
  const handleDeleteService = async (service) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${service.name}"?`);
    if (!confirmed) return;

    try {
      await axios.delete(`/api/services/${service.id}`);
      setServices(prev => prev.filter(s => s.id !== service.id));
      if (selected?.id === service.id) setSelected(services.length > 1 ? services[0] : null);
      setNotifierMessage(`Service "${service.name}" deleted successfully!`);
      setShowNotifier(true);
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service. See console for details.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="services-container">

      {/* LEFT — SERVICES LIST */}
      <div className="services-list">
        <div className="services-list-header">Services</div>
        <div className="services-list-scroll">
          {services
            .slice()
            .sort((a, b) => (a.status === b.status ? 0 : a.status === "Active" ? -1 : 1))
            .map(service => (
              <div
                key={service.id}
                onClick={() => setSelected(service)}
                className={`service-item ${selected?.id === service.id ? 'selected' : ''} ${service.status.toLowerCase() === "inactive" ? 'inactive' : ''}`}
              >
                <div className="service-name">{service.name}</div>
                <div className="service-duration">{formatDuration(service.duration)}</div>
              </div>
          ))}
        </div>
      </div>

      {/* RIGHT — DETAILS */}
      <div className="service-details">
        {!selected ? (
          <>
            <h2>No services yet</h2>
            <p>Create your first service to get started.</p>
            <button
              className="btn btn-success"
              onClick={() => setShowCreateModal(true)}
            >
              Create new
            </button>
          </>
        ) : (
          <>
            <div>
              <div className="service-title">{selected.name}</div>
              <div className="service-info">
                <div>
                  <strong>Description:</strong>
                  <p>{selected.description}</p>
                </div>
                <div style={{ fontWeight: 600, marginBottom: "8px" }}>
                  Price: {selected.price} {selected.currency === "euro" ? "€" : "$"}
                </div>
                <div style={{ fontWeight: 600 }}>
                  Duration: {formatDuration(selected.duration)}
                </div>
                <div>Status: {selected.status}</div>
              </div>
            </div>

            {/* BOTTOM BUTTONS */}
            <div className="bottom-buttons">
              <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>Create new</button>
              <div>
                <button className="btn btn-primary me-2" onClick={() => setShowEditModal(true)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteService(selected)}>Delete</button>
              </div>
            </div>
          </>
        )}

        {/* Modals */}
        <CreateServiceModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateService}
          currency={selected?.currency}
        />

        <EditServiceModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateService}
          service={selected || {}}
        />

        {/* Success Notifier */}
        <SuccessNotifier
          show={showNotifier}
          message={notifierMessage}
          onClose={() => setShowNotifier(false)}
        />
      </div>
    </div>
  );
}
