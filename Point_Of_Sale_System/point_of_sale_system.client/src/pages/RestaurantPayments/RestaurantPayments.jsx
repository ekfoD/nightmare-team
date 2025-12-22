import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import "../../styles/History.css";
import DiscountModal from "../processing/DiscountModal";

export default function RestaurantOrdersPayments() {
    const { auth } = useAuth();
    const organizationId = auth.businessId;

    /* ================= STATE ================= */
    const [allOrders, setAllOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [discounts, setDiscounts] = useState([]);
    const [orderDiscountId, setOrderDiscountId] = useState(null);

    const [variations, setVariations] = useState([]);
    const [taxes, setTaxes] = useState([]);

    // itemId -> [discountIds]
    const [itemDiscounts, setItemDiscounts] = useState({});

    const [loading, setLoading] = useState(true);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [activeItemId, setActiveItemId] = useState(null);


    const [giftcard, setGiftcard] = useState(null);
    const [appliedGiftcards, setAppliedGiftcards] = useState([]);

    /* ================= FETCH ================= */
    useEffect(() => {
        setLoading(true);

        fetchInformation();

        setLoading(false);
    }, [organizationId]);

    const fetchInformation = async () => {
        try {
            const responseAllOrders = await api.get("Payment/" + organizationId + "/GetAllOrders");
            const responseAllTaxes = await api.get("Tax/Organization/" + organizationId);
            const responseAllDiscounts = await api.get("Discount/organization/" + organizationId);

            setDiscounts(responseAllDiscounts);
            setTaxes(responseAllTaxes.data);
            setAllOrders(responseAllOrders.data);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }

    }

    const selectItem = async (order) => {
        if (selectedOrder != null && order.id === selectedOrder.id)
            return;

        try {
            const responseOrderDetailed = await api.get(
                "Payment/" + order.id + "/GetOrderDetails"
            );

            const detailedOrder = responseOrderDetailed.data;


            const itemMap = {};
            detailedOrder.items.forEach(item => {
                itemMap[item.id] = { ...item };
            });

            // this shit merges the parent thing that you guys made, like end me please
            detailedOrder.items.forEach(item => {
                if (item.parentOrderItemId && item.parentOrderItemId !== "00000000-0000-0000-0000-000000000000") {
                    const parent = itemMap[item.parentOrderItemId];
                    if (parent) {
                        parent.variationId = item.variationId;
                        parent.price += item.price;
                        parent.variationName = item.itemName;
                    }
                }
            });

            const mergedItems = Object.values(itemMap).filter(
                item => !item.parentOrderItemId || item.parentOrderItemId === "00000000-0000-0000-0000-000000000000"
            );

            setSelectedOrder({
                ...detailedOrder,
                items: mergedItems
            })
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };




    /* ================= DISCOUNTS ================= */
    //const orderDiscounts = useMemo(
    //    () => discounts.filter(d => d.applicableTo === "order" && d.status === "active"),
    //    [discounts]
    //);

    //const itemDiscountsList = useMemo(
    //    () => discounts.filter(d => d.applicableTo === "item" && d.status === "active"),
    //    [discounts]
    //);

    //const getDiscountById = id => discounts.find(d => d.id === id);

    /* ================= CALCULATIONS ================= */
    const calculateItemBase = item => {
        let price = item.price;

        const applied = item.discount;
        if (applied) price *= 1 - applied / 100;

        return price;
    };

    const calculateOrderSubtotal = () => {
        if (!selectedOrder) return 0;
        var orderSubtotal = 0;
        selectedOrder.items.map(item => {
            orderSubtotal += item.price * item.quantity;
        })

        return orderSubtotal;
    };

    const calculateGiftcardTotal = () => {
        return giftcard.balance;
    };


    const calculateFinalTotal = () => {
        let total = selectedOrder.totalAmount;

        //const orderDiscount = getDiscountById(orderDiscountId);
        //if (orderDiscount) {
        //    total *= 1 - orderDiscount.amount / 100;
        //}
        if (giftcard != null) {
            const giftcardTotal = calculateGiftcardTotal();
            total -= giftcardTotal;
        }

        return Math.max(0, total).toFixed(2);
    };


    /* ================= ACTIONS ================= */
    //const applyItemDiscount = discountId => {
    //    if (!activeItemId) return;

    //    setItemDiscounts(prev => ({
    //        ...prev,
    //        [activeItemId]: [...(prev[activeItemId] || []), discountId]
    //    }));

    //    setShowDiscountModal(false);
    //    setActiveItemId(null);
    //};

    const cancelOrder = async () => {
        if (!selectedOrder) return;
        try {
            await api.delete("Payment/" + selectedOrder.orderId + "/CancelOrder");
            fetchInformation();
        } catch (error) {
            console.log(error.message);
        }
        setSelectedOrder(null);
    };

    const confirmAndPay = async () => {
        if (!selectedOrder) return;
        try {
            await api.post("Payment/" + selectedOrder.orderId + "/PayOrder", {
                totalAmount: calculateFinalTotal(),
                tip: 0,
                paymentSplit: 1,
                currency: "dollar",
                "isPaid": true,
                giftcardId: giftcard?.id ?? null,
                organizationId: organizationId
            });
            alert("Order paid successfully");

            setSelectedOrder(null);
            setAppliedGiftcards(null);
            fetchInformation();

        } catch (error) {
            console.log(error.message);
        }
    };

    if (loading) return <div>Loading orders...</div>;


    /* ================= GIFT CARDS ================= */
    const applyGiftcard = async () => {
        const inputId = prompt("Enter Giftcard ID:");
        if (!inputId) return;

        try {
            const responseGiftcard = await api.get("Giftcard/" + inputId);

            if (appliedGiftcards.some(g => g.id === responseGiftcard.id)) return;
            if (new Date(appliedGiftcards.validUntil) < new Date()) return;

            setAppliedGiftcards(prev => [...prev, responseGiftcard]);
        } catch (error) {
            if (error.response.status == 404) {
                alert("No such giftcard");
            }
            console.log(error.message);
        }
    };

    /* ================= RENDER ================= */
    return (
        <div className="order-history-container">
            {/* ================= ORDER LIST ================= */}
            <div className="order-list">
                <div className="list-header">Pending Orders</div>

                <div className="list-scroll">
                    {allOrders.map(order => (
                        <div
                            key={order.id}
                            className={`list-item ${selectedOrder?.id === order.id ? "selected" : ""}`}
                            onClick={() => {
                                selectItem(order);
                            }}
                        >
                            <div>#{order.id.slice(0, 6)}</div>
                            <div>{new Date(order.timestamp).toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= ORDER DETAILS ================= */}
            <div className="order-details">
                {selectedOrder && (
                    <>
                        <div className="details-title">
                            Order #{selectedOrder.orderId.slice(0, 6)}
                        </div>

                        <div className="details-scroll">
                            {selectedOrder.items.map(item => (
                                    <div key={item.id}>
                                        <div className="price-row">
                                            <span>
                                                {item.itemName} {item.variationName} × {item.quantity}
                                            </span>

                                            {/*<button*/}
                                            {/*    className="secondary-action"*/}
                                            {/*    onClick={() => {*/}
                                            {/*        setActiveItemId(item.Id);*/}
                                            {/*        setShowDiscountModal(true);*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    Add Item Discount*/}
                                            {/*</button>*/}
                                            <span>${calculateItemBase(item).toFixed(2)}</span>
                                        </div>
                                        <div className="tax-row">
                                            <span> {item.taxName}</span>
                                            <span> ${item.tax} </span>
                                        </div>
                                    </div>
                            ))}
                        </div>

                        <div className="order-summary">
                            <div className="price-row">
                                <strong>Subtotal</strong>
                                <strong>${calculateOrderSubtotal().toFixed(2)}</strong>
                            </div>

                            {/*{orderDiscountId && (*/}
                            {/*    <div className="price-row">*/}
                            {/*        <span>Order Discount</span>*/}
                            {/*        <span>-{getDiscountById(orderDiscountId)?.amount}%</span>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                            {/*Whole orders can't have discounts sadly*/}

                            {giftcard && (
                                <div className="price-row">
                                    <span>Giftcard ({giftcard.id})</span>
                                    <span>- ${giftcard.balance.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="price-row final-price">
                                <strong>Total</strong>
                                <strong>${calculateFinalTotal()}</strong>
                            </div>
                        </div>

                        <div className="payment-actions">
                            <div>
                                {/*<button*/}
                                {/*    className="secondary-action"*/}
                                {/*    onClick={() => setShowDiscountModal(true)}*/}
                                {/*>*/}
                                {/*    Apply Order Discount*/}
                                {/*</button>*/}

                                <button
                                    className="secondary-action"
                                    onClick={applyGiftcard}
                                >
                                    Use Giftcard
                                </button>

                                <button
                                    className="secondary-action danger"
                                    onClick={() => { cancelOrder() } }
                                >
                                    Cancel Order
                                </button>
                            </div>

                            <button
                                className="payment-primary"
                                onClick={confirmAndPay}
                            >
                                Proceed & Pay
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}