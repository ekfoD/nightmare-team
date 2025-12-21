import { useState, useEffect } from "react";
import "../../styles/Services.css";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import SuccessNotifier from "../../utilities/SuccessNotifier";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios.js";

/* ------------------ HELPERS ------------------ */

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/* ------------------ COMPONENT ------------------ */

export default function Services() {
  const { auth } = useAuth();
  const organizationId = auth.businessId;

  const [services, setServices] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showNotifier, setShowNotifier] = useState(false);
  const [notifierMessage, setNotifierMessage] = useState("");

  /* ------------------ FETCHING ------------------ */

  const fetchServices = async () => {
    const res = await api.get(`/services/full/${organizationId}`);
    setServices(res.data);
    setSelected(res.data.length ? res.data[0] : null);
  };

  const fetchTaxes = async () => {
    const res = await api.get(`/Tax/Organization/${organizationId}`);
    setTaxes(res.data);
  };

  const fetchDiscounts = async () => {
    const res = await api.get(
      `/discount/organization/${organizationId}`
    );
    const itemDiscounts = res.data.filter(
      d => d.applicableTo === "item" && d.status === "active"
);
    setDiscounts(itemDiscounts);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchServices(), fetchTaxes(), fetchDiscounts()]);
      setLoading(false);
    };
    load();
  },[organizationId]);

  /* ------------------ CRUD ------------------ */

  const handleCreateService = async (service) => {
    await api.post("/services", {
      name: service.name,
      duration: service.durationMinutes,
      price: service.price,
      description: service.description,
      status: service.status,
      organizationId,
      taxIds: service.taxIds,
      discountId: service.discountId || null,
    });

    await fetchServices();
    setShowCreateModal(false);
    setNotifierMessage(`Service "${service.name}" created successfully!`);
    setShowNotifier(true);
  };

  const handleUpdateService = async (service) => {
    await api.put(`/services/${service.id}`, {
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description,
      status: service.status,
      organizationId,
      taxIds: service.taxIds,
      discountId: service.discountId || null,
    });

    await fetchServices();
    setShowEditModal(false);
    setNotifierMessage(`Service "${service.name}" updated successfully!`);
    setShowNotifier(true);
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Delete "${service.name}"?`)) return;

    await api.delete(`/services/${service.id}`);

    setServices((prev) => {
      const updated = prev.filter((s) => s.id !== service.id);

      setSelected(updated.length > 0 ? updated[0] : null);

      return updated;
    });

    setNotifierMessage(`Service "${service.name}" deleted successfully!`);
    setShowNotifier(true);
  };


  /* ------------------ DERIVED DATA ------------------ */

  const selectedDiscount =
    selected?.discountId
      ? discounts.find((d) => d.id === selected.discountId)
      : null;

  /* ------------------ RENDER ------------------ */

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
            .map((service) => {
              const hasDiscount = !!service.discountId;

              return (
                <div
                  key={service.id}
                  onClick={() => setSelected(service)}
                  className={`service-item ${
                    selected?.id === service.id ? "selected" : ""
                  } ${service.status === "Inactive" ? "inactive" : ""}`}
                >
                  <div className="service-name">
                    {service.name}
                    {hasDiscount && (
                      <span className="badge bg-success ms-2">
                        Discounted
                      </span>
                    )}
                  </div>

                  <div className="service-duration">
                    {formatDuration(service.duration)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="service-details">
        {!selected ? (
          <>
            <h2>No services yet</h2>
            <button
              className="btn btn-success"
              onClick={() => setShowCreateModal(true)}
            >
              Create new
            </button>
          </>
        ) : (
          <>
            <div className="service-title">{selected.name}</div>

            <div className="service-info">
              <p><strong>Description:</strong> {selected.description}</p>
              <p><strong>Duration:</strong> {formatDuration(selected.duration)}</p>

              <p>
                <strong>Price:</strong>{" "}
                {selected.price} {selected.currency === "euro" ? "€" : "$"}
              </p>

              <p><strong>Status:</strong> {selected.status}</p>
              
              {selectedDiscount && (
                <p>
                  <strong>Discount:</strong>{" "}
                  {selectedDiscount.name}: {selectedDiscount.amount} %
                </p>
              )}


              {selected.taxes?.length > 0 && (
                <div>
                  <strong>Taxes:</strong>
                  <ul>
                    {selected.taxes.map((t) => (
                      <li key={t.id}>
                        {t.name} — {t.amount}
                        {t.numberType === "percentage" ? "%" : " (flat)"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bottom-buttons">
              <button
                className="btn btn-success"
                onClick={() => setShowCreateModal(true)}
              >
                Create new
              </button>

              <div>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteService(selected)}
                >
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
          discounts={discounts}
        />

        <EditServiceModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateService}
          service={selected}
          taxes={taxes}
          discounts={discounts}
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
