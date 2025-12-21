import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import MenuGrid from '../Menu/MenuGrid';
import OrderPanel from './OrderPanel';
import api from '../../api/axios.js';
import useAuth from '../../hooks/useAuth.jsx';

const Orders = () => {
  const { auth } = useAuth();

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenuData();
  }, []);

  /* ===================== MENU ===================== */

  const fetchMenuData = async () => {
    const organizationId = auth.businessId;
    setLoading(true);
    setError('');

    try {
      const response = await api.get(
        `MenuBusiness/${organizationId}/GetMenuItems`
      );

      const data = response.data;

      const uniqueCategories = [
        ...new Map(
          data.map((item) => [
            item.category,
            {
              id: item.category,
              name:
                item.category.charAt(0).toUpperCase() + item.category.slice(1),
            },
          ])
        ).values(),
      ];

      setCategories(uniqueCategories);

      await Promise.all(
        data.map(async (item) => {
          const variationResponse = await api.get(
            `MenuBusiness/${item.id}/GetVariations`
          );
          item.variations = variationResponse.data;
        })
      );

      setMenuItems(data);

      if (uniqueCategories.length > 0) {
        setActiveTab(uniqueCategories[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  /* ===================== HELPERS ===================== */

  const areVariationsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return (
      a
        .map((v) => v.id)
        .sort()
        .join() ===
      b
        .map((v) => v.id)
        .sort()
        .join()
    );
  };

  const buildAddItemsPayload = (orderId, orderItems) => {
    const payloadItems = [];

    orderItems.forEach((item) => {
      // Parent
      payloadItems.push({
        menuItemId: item.menuItemId,
        variationId: null,
        quantity: item.quantity,
        isParent: true,
      });

      // Variations
      item.selectedVariations?.forEach((variation) => {
        payloadItems.push({
          menuItemId: item.menuItemId,
          variationId: variation.id,
          quantity: item.quantity,
          isParent: false,
        });
      });
    });

    return {
      orderId,
      orderItems: payloadItems,
    };
  };

  /* ===================== ORDER LOGIC ===================== */

  const handleAddItemToOrder = (menuItem, selectedVariations = []) => {
    const existingItem = orderItems.find(
      (item) =>
        item.menuItemId === menuItem.id &&
        areVariationsEqual(item.selectedVariations, selectedVariations)
    );

    if (existingItem) {
      setOrderItems((items) =>
        items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          menuItemId: menuItem.id,
          name: menuItem.name,
          basePrice: menuItem.price,
          quantity: 1,
          expanded: true,
          variations: menuItem.variations ?? [],
          selectedVariations,
        },
      ]);
    }
  };

  const handleToggleVariation = (orderItemId, variation) => {
    setOrderItems((items) =>
      items.map((item) =>
        item.id === orderItemId
          ? {
              ...item,
              selectedVariations: item.selectedVariations.some(
                (v) => v.id === variation.id
              )
                ? item.selectedVariations.filter((v) => v.id !== variation.id)
                : [...item.selectedVariations, variation],
            }
          : item
      )
    );
  };

  const handleUpdateQuantity = (id, qty) => {
    setOrderItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems((items) => items.filter((item) => item.id !== id));
  };

  /* ===================== API FLOW ===================== */

  const handleProceed = async () => {
    if (orderItems.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // 1️⃣ Create order
      const createOrderRes = await api.post('Payment/CreateOrder', {
        organizationId: auth.businessId,
      });

      const orderId = createOrderRes.data.id;

      // 2️⃣ Add items
      const payload = buildAddItemsPayload(orderId, orderItems);

      await api.post(`Payment/${orderId}/AddItems`, payload);

      alert('Order submitted successfully');
      setOrderItems([]);
    } catch (err) {
      console.error(err);
      setError('Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Cancel this order?')) {
      setOrderItems([]);
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <Container fluid className='p-4' style={{ minHeight: '100vh' }}>
      {loading && (
        <div className='text-center my-5'>
          <Spinner animation='border' />
        </div>
      )}

      {error && <Alert variant='danger'>{error}</Alert>}

      {!loading && !error && (
        <Row>
          <Col lg={8} md={7}>
            <MenuGrid
              categories={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              menuItems={menuItems}
              onItemClick={handleAddItemToOrder}
              showAddItem={false}
            />
          </Col>

          <Col lg={4} md={5}>
            <OrderPanel
              orderItems={orderItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onToggleVariation={handleToggleVariation}
              onProceed={handleProceed}
              onCancelOrder={handleCancelOrder}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Orders;
