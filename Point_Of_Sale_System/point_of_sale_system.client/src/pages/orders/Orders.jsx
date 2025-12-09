import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card, Button, Form, Badge, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('starters');
  const [orderId] = useState('2563');
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Item', price: 5, quantity: 1, expanded: false },
    { id: 2, name: 'Item', price: 20, quantity: 4, expanded: true },
    { id: 3, name: 'Item', price: 10, quantity: 1, expanded: false },
  ]);

  const menuItems = [
    { id: 1, name: 'Item' },
    { id: 2, name: 'Item' },
    { id: 3, name: 'Item' },
    { id: 4, name: 'Item' },
    { id: 5, name: 'Item' },
    { id: 6, name: 'Item' },
    { id: 7, name: 'Item' },
    { id: 8, name: 'Item' },
    { id: 9, name: 'Item' },
  ];

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * 0.236).toFixed(2);
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  const toggleItemExpand = (id) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const updateQuantity = (id, newQuantity) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, quantity: parseInt(newQuantity) || 1 } : item
    ));
  };

  const removeItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleAddOrder = () => {
    console.log('Add new order');
  };

  const handleProceed = () => {
    console.log('Proceed with order');
  };

  const handleCancelOrder = () => {
    console.log('Cancel order');
    setOrderItems([]);
  };

  const handleGiftcard = () => {
    console.log('Apply giftcard');
  };

  const handleDiscount = () => {
    console.log('Apply discount');
  };

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
      <Row>
        {/* Left Section - Menu Grid */}
        <Col lg={8} md={7}>
          {/* Category Tabs */}
          <Nav variant="tabs" className="mb-4" style={{ backgroundColor: '#97e6f8ff', border: '2px solid #333' }}>
            {['starters', 'mains', 'desserts', 'beverages', 'snacks'].map((tab) => (
              <Nav.Item key={tab}>
                <Nav.Link 
                  active={activeTab === tab} 
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    color: activeTab === tab ? '#333' : '#666',
                    fontWeight: '500',
                    borderRight: '2px solid #ddd',
                    borderRadius: 0,
                    borderBottom: activeTab === tab ? '3px solid #333' : 'none',
                    backgroundColor: activeTab === tab ? '#f8f9fa' : 'transparent'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Menu Items Grid */}
          <Row className="g-3">
            {menuItems.map((item) => (
              <Col md={4} sm={6} key={item.id}>
                <Card 
                  className="text-center h-100" 
                  style={{ 
                    cursor: 'pointer', 
                    border: '2px solid #333',
                    backgroundColor: 'white'
                  }}
                  onClick={() => console.log(`Add ${item.name} to order`)}
                >
                  <Card.Body className="d-flex flex-column justify-content-center" style={{ minHeight: '180px' }}>
                    {/* Image Placeholder */}
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '100px', 
                        backgroundColor: '#f0f0f0',
                        border: '2px solid #999',
                        marginBottom: '15px',
                        position: 'relative'
                      }}
                    >
                    </div>
                    <Card.Text style={{ color: '#666', fontWeight: '500' }}>{item.name}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Section - Order Panel */}
        <Col lg={4} md={5}>
          <Card style={{ border: '2px solid #333', backgroundColor: 'white' }}>
            <Card.Body>
              {/* Add Order Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      border: '2px solid #333', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={handleAddOrder}
                  >
                    <span style={{ fontSize: '24px', color: '#333' }}>+</span>
                  </div>
                  <span style={{ fontWeight: '600', color: '#333', fontSize: '18px' }}>Add order</span>
                </div>
                <Badge bg="light" text="dark" style={{ border: '2px solid #333', padding: '8px 12px', fontSize: '14px' }}>
                  Order ID {orderId}
                </Badge>
              </div>

              {/* Order Items List */}
              <div 
                style={{ 
                  maxHeight: '350px', 
                  overflowY: 'auto', 
                  marginBottom: '20px',
                  paddingRight: '5px'
                }}
              >
                {orderItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="mb-2" 
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #ddd'
                    }}
                  >
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 flex-grow-1">
                          {/* Expand/Collapse Icon */}
                          <span 
                            style={{ cursor: 'pointer', fontSize: '20px', color: '#333' }}
                            onClick={() => toggleItemExpand(item.id)}
                          >
                            {item.expanded ? '▼' : '▶'}
                          </span>
                          <span style={{ color: '#666', fontWeight: '500' }}>{item.name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontWeight: '600', color: '#333' }}>{item.price * item.quantity} €</span>
                          <Button 
                            variant="light"
                            size="sm"
                            style={{ 
                              borderRadius: '50%', 
                              width: '30px', 
                              height: '30px',
                              padding: 0,
                              border: '2px solid #666',
                              color: '#666'
                            }}
                            onClick={() => removeItem(item.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                      
                      {/* Expanded Quantity Section */}
                      {item.expanded && (
                        <div className="mt-2 ps-4">
                          <Form.Group className="d-flex align-items-center gap-2">
                            <Form.Label className="mb-0" style={{ color: '#666' }}>Quantity</Form.Label>
                            <Form.Control 
                              type="number" 
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, e.target.value)}
                              min="1"
                              style={{ 
                                width: '80px',
                                border: '2px solid #999',
                                textAlign: 'center'
                              }}
                            />
                          </Form.Group>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Gift Card and Discount Buttons */}
              <div className="d-flex gap-2 mb-3">
                <Button 
                  variant="outline-secondary"
                  className="flex-grow-1"
                  onClick={handleGiftcard}
                  style={{ 
                    border: '2px solid #666',
                    color: '#666',
                    fontWeight: '500',
                    backgroundColor: '#e8e8e8'
                  }}
                >
                  Giftcard code
                </Button>
                <Button 
                  variant="outline-secondary"
                  className="flex-grow-1"
                  onClick={handleDiscount}
                  style={{ 
                    border: '2px solid #666',
                    color: '#666',
                    fontWeight: '500',
                    backgroundColor: '#e8e8e8'
                  }}
                >
                  Discount
                </Button>
              </div>

              {/* Order Summary */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span style={{ color: '#666' }}>{calculateSubtotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#666' }}>Tax</span>
                  <span style={{ color: '#666' }}>{calculateTax()}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>Total</span>
                  <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{calculateTotal()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2">
                <Button 
                  variant="outline-dark"
                  size="lg"
                  onClick={handleProceed}
                  style={{ 
                    border: '2px solid #333',
                    fontWeight: '600',
                    padding: '12px'
                  }}
                >
                  Proceed
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={handleCancelOrder}
                  style={{ 
                    border: '2px solid #666',
                    color: '#666',
                    fontWeight: '500',
                    backgroundColor: '#e8e8e8'
                  }}
                >
                  Cancel order
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
