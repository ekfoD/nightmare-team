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

  const fetchMenuData = async () => {
    const organizationId = auth.businessId;
    setLoading(true);
    setError('');

    try {
      const response = await api.get(
        `MenuBusiness/${organizationId}/GetMenuItems`
      );

      const data = response.data;

      // Build categories from backend data
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

      // Fetch variations per menu item
      await Promise.all(
        data.map(async (item) => {
          const variationResponse = await api.get(
            `MenuBusiness/${item.id}/GetVariations`
          );
          item.variations = variationResponse.data;
        })
      );

      setMenuItems(data);

      console.log('categories: ', uniqueCategories);
      console.log('menuItems: ', data);
      // Default active tab
      if (uniqueCategories.length > 0) {
        setActiveTab(uniqueCategories[0].id);
      }
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVariation = (orderItemId, variation) => {
    setOrderItems((items) =>
      items.map((item) => {
        if (item.id !== orderItemId) return item;

        const exists = item.selectedVariations.some(
          (v) => v.id === variation.id
        );

        return {
          ...item,
          selectedVariations: exists
            ? item.selectedVariations.filter((v) => v.id !== variation.id)
            : [...item.selectedVariations, variation],
        };
      })
    );
  };

  // Add item to order
  const handleAddItemToOrder = (menuItem) => {
    const existingItem = orderItems.find(
      (item) => item.menuItemId === menuItem.id
    );

    if (existingItem) {
      setOrderItems((items) =>
        items.map((item) =>
          item.menuItemId === menuItem.id
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
          selectedVariations: [],
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id, newQty) => {
    const qty = Math.max(1, parseInt(newQty) || 1);
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleProceed = () => {
    console.log('Submitting order:', orderItems);
    alert('Order submitted');
    setOrderItems([]);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Cancel this order?')) {
      setOrderItems([]);
    }
  };

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
