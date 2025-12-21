import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import "../../styles/History.css";
import DiscountModal from "./DiscountModal";

export default function AppointmentPayments() {
  const { auth } = useAuth();
  const organizationId = auth.businessId;

  /* ================= STATE ================= */
  const [appointments, setAppointments] = useState([]);
  const [menuServices, setMenuServices] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [giftcards, setGiftcards] = useState([]);
  const [appliedGiftcards, setAppliedGiftcards] = useState([]);

  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [showDiscountSelector, setShowDiscountSelector] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.get(`/Appointments/pending/${organizationId}`),
      api.get(`/services/full/${organizationId}`),
      api.get(`/Giftcard/organization/${organizationId}`),
      api.get(`/Discount/organization/${organizationId}`)
    ])
      .then(([appsRes, servicesRes, giftRes, discountRes]) => {
        setAppointments(appsRes.data);
        setSelected(appsRes.data[0] ?? null);

        const serviceMap = {};
        servicesRes.data.forEach(s => {
          serviceMap[s.id] = s;
        });
        setMenuServices(serviceMap);

        setGiftcards(giftRes.data);
        setDiscounts(discountRes.data);
      })
      .catch(err => {
        console.error(err);
        setAppointments([]);
        setMenuServices({});
        setGiftcards([]);
        setDiscounts([]);
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  /* ================= DISCOUNTS ================= */
  const orderDiscounts = useMemo(
    () =>
      discounts.filter(
        d => d.applicableTo === "order" && d.status === "active"
      ),
    [discounts]
  );

  const selectedOrderDiscount = useMemo(
    () => orderDiscounts.find(d => d.id === selectedDiscountId),
    [orderDiscounts, selectedDiscountId]
  );

  const getServiceDiscount = service =>
    discounts.find(
      d => d.id === service.discountId && d.status === "active"
    );

  /* ================= APPOINTMENT LIST ================= */
  const filteredAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
  }, [appointments]);

  /* ================= HELPERS ================= */
  const buildDiscountReceipts = (service) => {
  const discountsApplied = [];

  // SERVICE DISCOUNT
  const serviceDiscount = discounts.find(
    d => d.id === service.discountId && d.status === "active"
  );

  if (serviceDiscount) {
    const amount =
      (service.price * serviceDiscount.amount) / 100;

    discountsApplied.push({
      id: serviceDiscount.id,
      name: serviceDiscount.name,
      procentage: serviceDiscount.amount,
      affectedAmount: amount.toFixed(2)
    });
  }

  // ORDER DISCOUNT (applied AFTER service discount)
  if (selectedOrderDiscount) {
    const baseAfterServiceDiscount =
      serviceDiscount
        ? service.price * (1 - serviceDiscount.amount / 100)
        : service.price;

    const amount =
      (baseAfterServiceDiscount * selectedOrderDiscount.amount) / 100;

    discountsApplied.push({
      id: selectedOrderDiscount.id,
      name: selectedOrderDiscount.name,
      procentage: selectedOrderDiscount.amount,
      affectedAmount: amount.toFixed(2)
    });
  }

  return discountsApplied;
};


const formatTime = (date) =>
  new Date(date).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });


  const calculateDiscountedBase = service => {
    let price = service.price;

    const serviceDiscount = getServiceDiscount(service);
    if (serviceDiscount) {
      price *= 1 - serviceDiscount.amount / 100;
    }

    if (selectedOrderDiscount) {
      price *= 1 - selectedOrderDiscount.amount / 100;
    }

    return price;
  };

  const calculateTaxes = (service, taxableAmount) => {
    let totalTaxes = 0;

    const breakdown = service.taxes.map(t => {
      const taxAmount =
        t.numberType === "percentage"
          ? (taxableAmount * t.amount) / 100
          : t.amount;

      totalTaxes += taxAmount;

      return { ...t, appliedAmount: taxAmount.toFixed(2) };
    });

    return { breakdown, totalTaxes: totalTaxes.toFixed(2) };
  };

  const calculateFinalPrice = service => {
    const discountedBase = calculateDiscountedBase(service);
    const { totalTaxes } = calculateTaxes(service, discountedBase);

    const giftcardTotal = appliedGiftcards.reduce(
      (sum, g) => sum + g.balance,
      0
    );

    return Math.max(
      0,
      discountedBase + parseFloat(totalTaxes) - giftcardTotal
    ).toFixed(2);
  };

  /* ================= GIFT CARDS ================= */
  const applyGiftcard = () => {
    const inputId = prompt("Enter Giftcard ID:");
    if (!inputId) return;

    const giftcard = giftcards.find(g => g.id === inputId);
    if (!giftcard) return;
    if (appliedGiftcards.some(g => g.id === giftcard.id)) return;
    if (new Date(giftcard.validUntil) < new Date()) return;

    setAppliedGiftcards(prev => [...prev, giftcard]);
  };

  /* ================= PAYMENT ================= */
    const handlePay = async () => {
    if (!selected) return;

    const service = menuServices[selected.menuServiceId];
    if (!service) return;

    const discountedBase = calculateDiscountedBase(service);
    const { breakdown } = calculateTaxes(service, discountedBase);

    const discountReceipts = buildDiscountReceipts(service);

    try {
      await api.post(`/Receipt/appointment`, {
        organizationId,
        customerName: selected.customerName,
        startTime: selected.startTime,
        endTime: selected.endTime,
        paymentStatus: "succeeded",
        serviceName: selected.serviceName,
        servicePrice: service.price,
        currency: service.currency,
        employeeId: selected.employeeId,
        employeeName: selected.employeeName,

        taxes: breakdown.map(t => ({
          name: t.name,
          amount: t.amount,
          affectedAmount: parseFloat(t.appliedAmount),
          numberType: t.numberType
        })),

        discounts: discountReceipts
      });

      setSelected(null);
      setAppliedGiftcards([]);
      setSelectedDiscountId(null);
      alert("Payment successful. Receipt created.");
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  const cancelAppointment = async () => {
  if (!selected) return;

  const confirmed = window.confirm("Cancel this appointment?");
  if (!confirmed) return;

  try {
    await api.delete(`/Appointments/cancel/${selected.id}`);

    setAppointments(prev =>
      prev.filter(a => a.id !== selected.id)
    );

    setSelected(null);
    setAppliedGiftcards([]);
    setSelectedDiscountId(null);

    alert("Appointment cancelled.");
  } catch (err) {
    console.error(err);
    alert("Failed to cancel appointment.");
  }
};


  if (loading) return <div>Loading appointments...</div>;

  const service =
    selected && menuServices[selected.menuServiceId];
  const serviceDiscount =
    service && getServiceDiscount(service);

  /* ================= RENDER ================= */
  return (
    <div className="order-history-container">
      <div className="order-list">
        <div className="list-header">
          <span>Pending Payments</span>
        </div>

        <div className="list-scroll">
          {filteredAppointments.map(app => (
            <div
              key={app.id}
              className={`list-item ${
                selected?.id === app.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelected(app);
                setAppliedGiftcards([]);
                setSelectedDiscountId(null);
              }}
            >
              <div className="item-id">
                {formatTime(app.startTime)} –{" "}
                {formatTime(app.endTime)}
              </div>
              <div>{app.customerName}</div>
              <div>
                {app.employeeName} | {app.serviceName}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-details">
        {selected && service && (
          <>
            <div className="details-title">
              Appointment — {selected.customerName}
            </div>

            <div className="details-scroll">
              <div><strong>Employee:</strong> {selected.employeeName}</div>
              <div>
                <strong>Time:</strong>{" "}
                {formatTime(selected.startTime)} –{" "}
                {formatTime(selected.endTime)}
              </div>
              <div><strong>Service:</strong> {selected.serviceName}</div>

              {serviceDiscount && (
                <div>
                  <strong>Service Discount:</strong>{" "}
                  {serviceDiscount.name} ({serviceDiscount.amount}%)
                </div>
              )}

              <div><strong>Customer:</strong> {selected.customerName}</div>
              <div><strong>Phone:</strong> {selected.customerPhone}</div>

              {selected.extraInfo && (
                <div>
                  <strong>Extra Info:</strong> {selected.extraInfo}
                </div>
              )}
            </div>

            <div className="order-summary">
              <div className="price-row">
                <span>Base price:</span>
                <span>
                  {service.currency === "euro" ? "€" : "$"}{" "}
                  {service.price.toFixed(2)}
                </span>
              </div>

              {serviceDiscount && (
                <div className="price-row">
                  <span>- {serviceDiscount.name} {serviceDiscount.amount}%</span>
                  <span>
                    {service.currency === "euro" ? "€" : "$"}{" "} -{(service.price * serviceDiscount.amount / 100).toFixed(2)}
                  </span>
                </div>
              )}

              {selectedOrderDiscount && (
                <div className="price-row">
                  <span>- {selectedOrderDiscount.name} {selectedOrderDiscount.amount}%</span>
                  <span>
                    {service.currency === "euro" ? "€" : "$"}{" "} -{(calculateDiscountedBase(service) * selectedOrderDiscount.amount / 100).toFixed(2)}
                  </span>
                </div>
              )}

              {calculateTaxes(
                service,
                calculateDiscountedBase(service)
              ).breakdown.map(t => (
                <div className="price-row" key={t.id}>
                  <span>+ {t.name} {t.amount} {t.numberType === "flat" ? "(flat)" : "%"}</span>
                  <span>{service.currency === "euro" ? "€" : "$"}{" "} +{t.appliedAmount}</span>
                </div>
              ))}

              <div className="price-row final-price">
                <strong>Total:</strong>
                <strong>{service.currency === "euro" ? "€" : "$"}{" "} {calculateFinalPrice(service)}</strong>
              </div>
            </div>

            <div className="payment-actions">
              <div className="payment-left">
                <button
                  className="secondary-action"
                  onClick={() => setShowDiscountSelector(p => !p)}
                >
                  Apply Discount
                </button>

                <button
                  className="secondary-action"
                  onClick={applyGiftcard}
                >
                  Use Giftcard
                </button>

                <button
      className="secondary-action"
      onClick={cancelAppointment}
    >
      Cancel Appointment
    </button>
              </div>

              <button
                className="payment-primary"
                onClick={handlePay}
              >
                Proceed to Payment
              </button>
            </div>

            <DiscountModal
              show={showDiscountSelector}
              discounts={orderDiscounts}
              onSelect={setSelectedDiscountId}
              onClose={() => setShowDiscountSelector(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}