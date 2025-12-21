import { useEffect } from "react";
import "../../styles/DiscountSelector.css";

export default function DiscountModal({ show, discounts, onSelect, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }

    if (show) document.addEventListener("keydown", handleEscape);
    else document.removeEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="discount-modal-overlay" onClick={onClose}>
      <div className="discount-modal-content" onClick={e => e.stopPropagation()}>
        <h3>Select Discount</h3>
        <ul className="discount-modal-list">
          <li onClick={() => { onSelect(null); onClose(); }}>No Discount</li>
          {discounts.map(d => (
            <li key={d.id} onClick={() => { onSelect(d.id); onClose(); }}>
              {d.name} — {d.amount}%
            </li>
          ))}
        </ul>
        <button className="discount-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
