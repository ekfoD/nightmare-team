import { useState, useEffect } from "react";
import "../../styles/Services.css";
import SuccessNotifier from "../../utilities/SuccessNotifier";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios.js";
import CreateDiscountModal from "./CreateDiscountModal";
import EditDiscountModal from "./EditDiscountModal";

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export default function Discounts() {
  const { auth } = useAuth();
  const organizationId = auth.businessId;

  const [discounts, setDiscounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showNotifier, setShowNotifier] = useState(false);
  const [notifierMessage, setNotifierMessage] = useState("");

  const fetchDiscounts = async () => {
    try {
      const res = await api.get(
        `/Discount/organization/${organizationId}`
      );
      setDiscounts(res.data);
      setSelected(res.data.length ? res.data[0] : null);
    } catch (err) {
      console.error("Failed to fetch discounts:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchDiscounts();
      setLoading(false);
    };
    load();
  }, []);

  const handleCreateDiscount = async (discount) => {
    try {
      const payload = {
        name: discount.name,
        amount: discount.amount,
        applicableTo: discount.applicableTo,
        validFrom: discount.validFrom,
        validUntil: discount.validUntil,
        status: discount.status,
        organizationId
      };

      await api.post("/Discount", payload);
      await fetchDiscounts();

      setShowCreateModal(false);
      setNotifierMessage("Discount created successfully!");
      setShowNotifier(true);
    } catch (err) {
      console.error("Failed to create discount:", err);
    }
  };

  const handleUpdateDiscount = async (discount) => {
    try {
      const payload = {
        name: discount.name,
        amount: discount.amount,
        applicableTo: discount.applicableTo,
        validFrom: discount.validFrom,
        validUntil: discount.validUntil,
        status: discount.status
      };

      await api.put(`/Discount/${discount.id}`, payload);
      await fetchDiscounts();

      setShowEditModal(false);
      setNotifierMessage("Discount updated successfully!");
      setShowNotifier(true);
    } catch (err) {
      console.error("Failed to update discount:", err);
    }
  };

  const handleDeleteDiscount = async (discount) => {
    if (!window.confirm("Delete this discount?")) return;

    try {
      await api.delete(`/Discount/${discount.id}`);
      setDiscounts((prev) => prev.filter((d) => d.id !== discount.id));
      setSelected(null);
      setNotifierMessage("Discount deleted successfully!");
      setShowNotifier(true);
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="services-container">
      {/* LEFT */}
      <div className="services-list">
        <div className="services-list-header">Discounts</div>
        <div className="services-list-scroll">
          {discounts
            .slice()
            .sort((a, b) =>
              a.status === b.status ? 0 : a.status === "Active" ? -1 : 1
            )
            .map((discount) => (
              <div
                key={discount.id}
                onClick={() => setSelected(discount)}
                className={`service-item ${
                  selected?.id === discount.id ? "selected" : ""
                } ${discount.status.toLowerCase() === "inactive" ? "inactive" : ""}`}
              >
                <div className="service-name">
                  {discount.name} - {discount.amount} %
                </div>
                <div className="service-duration">
                  {discount.applicableTo}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="service-details">
        {!selected ? (
          <>
            <h2>No discounts yet</h2>
            <button
              className="btn btn-success"
              onClick={() => setShowCreateModal(true)}
            >
              Create new
            </button>
          </>
        ) : (
          <>
            <div className="service-title">
              Discount — {selected.amount} %
            </div>

            <div className="service-info">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Applies to:</strong> {selected.applicableTo}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p>
                <strong>Valid from:</strong>{" "}
                {formatDate(selected.validFrom)}
              </p>
              <p>
                <strong>Until:</strong>{" "}
                {formatDate(selected.validUntil)}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selected.timestamp).toLocaleString()}
              </p>
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
                  onClick={() => handleDeleteDiscount(selected)}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}

        {/* MODALS */}
        <CreateDiscountModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateDiscount}
        />

        <EditDiscountModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateDiscount}
          discount={selected}
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
