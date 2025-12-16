import { useState, useEffect } from "react";
import "../../styles/Services.css";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import SuccessNotifier from "../../utilities/SuccessNotifier";
import useAuth from "../../hooks/useAuth";
import api from '../../api/axios.js';

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export default function Services() {
  const { auth } = useAuth();
  const organizationId = auth.businessId;

  const [services, setServices] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showNotifier, setShowNotifier] = useState(false);
  const [notifierMessage, setNotifierMessage] = useState("");


  const fetchServices = async () => {
    try {
      const res = await api.get(`/services/full/${organizationId}`);
      setServices(res.data);
      setSelected(res.data.length ? res.data[0] : null);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const fetchTaxes = async () => {
    try {
      const res = await api.get(`/Tax/Organization/${organizationId}`);
      setTaxes(res.data);
    } catch (err) {
      console.error("Failed to fetch taxes:", err);
    }
  };

  useEffect(() => {
    
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchServices(), fetchTaxes()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleCreateService = async (service) => {
    try {
      const payload = {
        name: service.name,
        duration: service.durationMinutes,
        price: service.price,
        description: service.description,
        status: service.status,
        organizationId: organizationId,
        taxIds: service.taxIds
      };

      await api.post("/services", payload);
      await fetchServices();

      setShowCreateModal(false);
      setNotifierMessage(`Service "${service.name}" created successfully!`);
      setShowNotifier(true);
    } catch (err) {
      console.error("Failed to create service:", err);
    }
  };

  const handleUpdateService = async (service) => {
    try {
      const payload = {
        name: service.name,
        duration: service.duration,
        price: service.price,
        description: service.description,
        status: service.status,
        organizationId: organizationId,
        taxIds: service.taxIds
      };

      await api.put(`/services/${service.id}`, payload);
      await fetchServices();

      setShowEditModal(false);
      setNotifierMessage(`Service "${service.name}" updated successfully!`);
      setShowNotifier(true);
    } catch (err) {
      console.error("Failed to update service:", err);
      alert("Failed to update service. See console for details.");
    }
  };


  const handleDeleteService = async (service) => {
    if (!window.confirm(`Delete "${service.name}"?`)) return;

    try {
      await api.delete(`/services/${service.id}`);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      setSelected(null);
      setNotifierMessage(`Service "${service.name}" deleted successfully!`);
      setShowNotifier(true);
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="services-container">
      {/* LEFT */}
      <div className="services-list">
        <div className="services-list-header">Services</div>
        <div className="services-list-scroll">
          {services
            .slice()
            .sort((a, b) =>
              a.status === b.status ? 0 : a.status === "Active" ? -1 : 1
            )
            .map((service) => (
              <div
                key={service.id}
                onClick={() => setSelected(service)}
                className={`service-item ${
                  selected?.id === service.id ? "selected" : ""
                } ${service.status.toLowerCase() === "inactive" ? "inactive" : ""}`}
              >
                <div className="service-name">{service.name}</div>
                <div className="service-duration">
                  {formatDuration(service.duration)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="service-details">
        {!selected ? (
          <>
            <h2>No services yet</h2>
            <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>
              Create new
            </button>
          </>
        ) : (
          <>
            <div className="service-title">{selected.name}</div>

            <div className="service-info">
              <p><strong>Description:</strong> {selected.description}</p>
              <p><strong>Price:</strong> {selected.price} {selected.currency === "euro" ? "€" : "$"} </p>
              <p><strong>Duration:</strong> {formatDuration(selected.duration)}</p>
              <p><strong>Status:</strong> {selected.status}</p>

              {selected.taxes?.length > 0 && (
                <div>
                  <strong>Taxes:</strong>
                  <ul>
                    {selected.taxes.map((t) => (
                      <li key={t.id}>
                        {t.name} —{" "}
                        {t.amount}
                        {t.numberType === "percentage" ? "%" : " (flat)"}
                      </li>

                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bottom-buttons">
              <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>
                Create new
              </button>
              <div>
                <button className="btn btn-primary me-2" onClick={() => setShowEditModal(true)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteService(selected)}>
                  Delete
                </button>
              </div>
            </div>
          </>
        )}

        {/* MODALS */}
        <CreateServiceModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateService}
          currency={selected?.currency}
          taxes={taxes}
        />

        <EditServiceModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateService}
          service={selected}
          taxes={taxes}
        />

        <SuccessNotifier
          show={showNotifier}
          message={notifierMessage}
          onClose={() => setShowNotifier(false)}
        />
      </div>
    </div>
  );
}
