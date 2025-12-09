import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuGrid from '../Menu/MenuGrid';
import OrderPanel from './OrderPanel';

const Orders = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('starters');
  const [orderId] = useState('2563');
  const [orderItems, setOrderItems] = useState([]);

  // API: Fetch menu data
  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockCategories = [
        { id: 'starters', name: 'Starters' },
        { id: 'mains', name: 'Mains' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'beverages', name: 'Beverages' },
        { id: 'snacks', name: 'Snacks' },
      ];

      const mockItems = [
        { id: 1, name: 'Caesar Salad', price: 12.99, category: 'starters' },
        { id: 2, name: 'Bruschetta', price: 8.99, category: 'starters' },
        { id: 3, name: 'Grilled Salmon', price: 24.99, category: 'mains' },
        { id: 4, name: 'Steak', price: 29.99, category: 'mains' },
        { id: 5, name: 'Chocolate Cake', price: 7.99, category: 'desserts' },
        { id: 6, name: 'Ice Cream', price: 5.99, category: 'desserts' },
        { id: 7, name: 'Coffee', price: 3.99, category: 'beverages' },
        { id: 8, name: 'Orange Juice', price: 4.99, category: 'beverages' },
      ];

      setCategories(mockCategories);
      setMenuItems(mockItems);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleAddItemToOrder = (menuItem) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItemId === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newOrderItem = {
        id: Math.max(...orderItems.map(i => i.id), 0) + 1,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        expanded: false
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    const qty = parseInt(newQuantity) || 1;
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // API: Submit order
  const handleProceed = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderId, items: orderItems })
      // });

      console.log('Order submitted:', { orderId, items: orderItems });
      alert('Order submitted successfully!');
      // After successful submission, clear order
      setOrderItems([]);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrderItems([]);
    }
  };

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
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
            orderId={orderId}
            orderItems={orderItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceed={handleProceed}
            onCancelOrder={handleCancelOrder}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
