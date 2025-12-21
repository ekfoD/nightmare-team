import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import "../../styles/History.css";
import DiscountModal from "../processing/DiscountModal";

export default function RestaurantOrdersPayments() {
  const { auth } = useAuth();
  const organizationId = auth.businessId;

  /* ================= STATE ================= */
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [discounts, setDiscounts] = useState([]);
  const [orderDiscountId, setOrderDiscountId] = useState(null);

  // itemId -> [discountIds]
  const [itemDiscounts, setItemDiscounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);


  const [giftcards, setGiftcards] = useState([]);
  const [appliedGiftcards, setAppliedGiftcards] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.get(`/Orders/pending/${organizationId}`),
      api.get(`/Discount/organization/${organizationId}`),
      api.get(`/Giftcard/organization/${organizationId}`)
    ])
      .then(([ordersRes, discountRes, giftcardRes]) => {
        setOrders(ordersRes.data);
        setSelectedOrder(ordersRes.data[0] ?? null);
        setDiscounts(discountRes.data);
        setGiftcards(giftcardRes.data);
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  /* ================= DISCOUNTS ================= */
  const orderDiscounts = useMemo(
    () => discounts.filter(d => d.applicableTo === "order" && d.status === "active"),
    [discounts]
  );

  const itemDiscountsList = useMemo(
    () => discounts.filter(d => d.applicableTo === "item" && d.status === "active"),
    [discounts]
  );

  const getDiscountById = id => discounts.find(d => d.id === id);

  /* ================= CALCULATIONS ================= */
  const calculateItemBase = item => {
    let price = item.TotalPrice;

    const applied = itemDiscounts[item.Id] || [];
    applied.forEach(id => {
      const d = getDiscountById(id);
      if (d) price *= 1 - d.amount / 100;
    });

    return price;
  };

  const calculateOrderSubtotal = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.Items.reduce(
      (sum, item) => sum + calculateItemBase(item),
      0
    );
  };

  const calculateGiftcardTotal = () => {
  return appliedGiftcards.reduce((sum, g) => sum + g.balance, 0);
};


    const calculateFinalTotal = () => {
    let total = calculateOrderSubtotal();

    const orderDiscount = getDiscountById(orderDiscountId);
    if (orderDiscount) {
        total *= 1 - orderDiscount.amount / 100;
    }

    const giftcardTotal = calculateGiftcardTotal();

    return Math.max(0, total - giftcardTotal).toFixed(2);
    };


  /* ================= ACTIONS ================= */
  const applyItemDiscount = discountId => {
    if (!activeItemId) return;

    setItemDiscounts(prev => ({
      ...prev,
      [activeItemId]: [...(prev[activeItemId] || []), discountId]
    }));

    setShowDiscountModal(false);
    setActiveItemId(null);
  };

  const cancelOrder = async () => {
    if (!selectedOrder) return;

    await api.delete(`/Payment/CancelOrder/${selectedOrder.Id}`);
    setOrders(o => o.filter(x => x.Id !== selectedOrder.Id));
    setSelectedOrder(null);
  };

  const confirmAndPay = async () => {
    if (!selectedOrder) return;

    await api.post(`/Payment/ConfirmOrder/${selectedOrder.Id}`);
    alert("Order paid successfully");

    setOrders(o => o.filter(x => x.Id !== selectedOrder.Id));
    setSelectedOrder(null);
    setItemDiscounts({});
    setOrderDiscountId(null);
    setAppliedGiftcards([]);
  };

  if (loading) return <div>Loading orders...</div>;


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

  /* ================= RENDER ================= */
  return (
    <div className="order-history-container">
      {/* ================= ORDER LIST ================= */}
      <div className="order-list">
        <div className="list-header">Pending Orders</div>

        <div className="list-scroll">
          {orders.map(order => (
            <div
              key={order.Id}
              className={`list-item ${selectedOrder?.Id === order.Id ? "selected" : ""}`}
              onClick={() => {
                setSelectedOrder(order);
                setItemDiscounts({});
                setOrderDiscountId(null);
                setAppliedGiftcards([]);
              }}
            >
              <div>#{order.Id.slice(0, 6)}</div>
              <div>{new Date(order.Timestamp).toLocaleTimeString()}</div>
              <div>{order.Items.length} items</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ORDER DETAILS ================= */}
      <div className="order-details">
        {selectedOrder && (
          <>
            <div className="details-title">
              Order #{selectedOrder.Id.slice(0, 6)}
            </div>

            <div className="details-scroll">
              {selectedOrder.Items.map(item => (
                <div key={item.Id} className="price-row">
                  <span>
                    {item.MenuItemName} {item.VariationName} × {item.Quantity}
                  </span>
                  <span>${calculateItemBase(item).toFixed(2)}</span>

                  <button
                    className="secondary-action"
                    onClick={() => {
                      setActiveItemId(item.Id);
                      setShowDiscountModal(true);
                    }}
                  >
                    Add Item Discount
                  </button>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="price-row">
                <strong>Subtotal</strong>
                <strong>${calculateOrderSubtotal().toFixed(2)}</strong>
              </div>

              {orderDiscountId && (
                <div className="price-row">
                  <span>Order Discount</span>
                  <span>-{getDiscountById(orderDiscountId)?.amount}%</span>
                </div>
              )}

            {appliedGiftcards.map(gc => (
                <div className="price-row" key={gc.id}>
                    <span>Giftcard ({gc.id})</span>
                    <span>- ${gc.balance.toFixed(2)}</span>
                </div>
                ))}

              <div className="price-row final-price">
                <strong>Total</strong>
                <strong>${calculateFinalTotal()}</strong>
              </div>
            </div>

           <div className="payment-actions">
                <div>
                    <button
                    className="secondary-action"
                    onClick={() => setShowDiscountModal(true)}
                    >
                    Apply Order Discount
                    </button>

                    <button
                    className="secondary-action"
                    onClick={applyGiftcard}
                    >
                    Use Giftcard
                    </button>

                    <button
                    className="secondary-action danger"
                    onClick={cancelOrder}
                    >
                    Cancel Order
                    </button>
                </div>

                <button className="payment-primary" onClick={confirmAndPay}>
                    Proceed & Pay
                </button>
                </div>


            <DiscountModal
              show={showDiscountModal}
              discounts={activeItemId ? itemDiscountsList : orderDiscounts}
              onSelect={id => {
                activeItemId ? applyItemDiscount(id) : setOrderDiscountId(id);
                setShowDiscountModal(false);
              }}
              onClose={() => setShowDiscountModal(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}