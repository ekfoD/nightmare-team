import React, { useState } from 'react';
import { Card, Button, Form, Badge, Alert } from 'react-bootstrap';

const OrderPanel = ({ 
  orderId, 
  orderItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onProceed,
  onCancelOrder
}) => {
  const [giftcardCode, setGiftcardCode] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [showGiftcard, setShowGiftcard] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [appliedGiftcard, setAppliedGiftcard] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [error, setError] = useState('');

  // Mock giftcard and discount database
  const MOCK_GIFTCARDS = {
    'GIFT50': { value: 50, type: 'fixed' },
    'GIFT100': { value: 100, type: 'fixed' },
    'GIFT25': { value: 25, type: 'fixed' }
  };

  const MOCK_DISCOUNTS = {
    'SAVE10': { value: 10, type: 'percentage' },
    'SAVE20': { value: 20, type: 'percentage' },
    'SAVE5': { value: 5, type: 'fixed' },
    'SUMMER25': { value: 25, type: 'percentage' }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    let discountAmount = 0;

    if (appliedDiscount) {
      if (appliedDiscount.type === 'percentage') {
        discountAmount = subtotal * (appliedDiscount.value / 100);
      } else {
        discountAmount = Math.min(appliedDiscount.value, subtotal);
      }
    }

    return discountAmount;
  };

  const calculateGiftcardAmount = () => {
    if (!appliedGiftcard) return 0;
    
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const afterDiscount = subtotal - discountAmount;
    
    return Math.min(appliedGiftcard.value, Math.max(0, afterDiscount));
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const giftcardAmount = calculateGiftcardAmount();
    const taxableAmount = Math.max(0, subtotal - discountAmount - giftcardAmount);
    return taxableAmount * 0.236;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const giftcardAmount = calculateGiftcardAmount();
    const tax = calculateTax();
    return Math.max(0, subtotal - discountAmount - giftcardAmount + tax);
  };

  const toggleItemExpand = (id) => {
    const updatedItems = orderItems.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    );
    // This would need to be passed to parent, but for simplicity keeping it local
  };

  const applyGiftcard = () => {
    setError('');
    const code = giftcardCode.toUpperCase();
    
    if (MOCK_GIFTCARDS[code]) {
      setAppliedGiftcard({
        code: code,
        ...MOCK_GIFTCARDS[code]
      });
      setGiftcardCode('');
      setShowGiftcard(false);
    } else {
      setError('Invalid giftcard code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const applyDiscount = () => {
    setError('');
    const code = discountCode.toUpperCase();
    
    if (MOCK_DISCOUNTS[code]) {
      setAppliedDiscount({
        code: code,
        ...MOCK_DISCOUNTS[code]
      });
      setDiscountCode('');
      setShowDiscount(false);
    } else {
      setError('Invalid discount code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeGiftcard = () => {
    setAppliedGiftcard(null);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  return (
    <Card style={{ border: '2px solid #333', backgroundColor: 'white' }}>
      <Card.Body>
        {/* Order Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontWeight: '600', color: '#333', fontSize: '18px' }}>Current Order</span>
          <Badge bg="light" text="dark" style={{ border: '2px solid #333', padding: '8px 12px', fontSize: '14px' }}>
            Order ID {orderId}
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="py-2">
            {error}
          </Alert>
        )}

        {/* Order Items List */}
        <div 
          style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            marginBottom: '20px',
            paddingRight: '5px'
          }}
        >
          {orderItems.length === 0 ? (
            <div className="text-center text-muted py-4">
              <p>No items in order</p>
              <p style={{ fontSize: '12px' }}>Click on menu items to add them</p>
            </div>
          ) : (
            orderItems.map((item) => (
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
                      <span 
                        style={{ cursor: 'pointer', fontSize: '20px', color: '#333' }}
                        onClick={() => toggleItemExpand(item.id)}
                      >
                        {item.expanded ? '▼' : '▶'}
                      </span>
                      <span style={{ color: '#666', fontWeight: '500' }}>{item.name}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontWeight: '600', color: '#333' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
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
                        onClick={() => onRemoveItem(item.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                  
                  {item.expanded && (
                    <div className="mt-2 ps-4">
                      <Form.Group className="d-flex align-items-center gap-2">
                        <Form.Label className="mb-0" style={{ color: '#666' }}>Quantity</Form.Label>
                        <Form.Control 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, e.target.value)}
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
            ))
          )}
        </div>

        {/* Applied Discounts Display */}
        {(appliedDiscount || appliedGiftcard) && (
          <div className="mb-3 p-2" style={{ backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <h6 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '14px' }}>Applied:</h6>
            
            {appliedDiscount && (
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ color: '#2e7d32', fontSize: '13px' }}>
                  <strong>{appliedDiscount.code}</strong> - {appliedDiscount.type === 'percentage' 
                    ? `${appliedDiscount.value}% off` 
                    : `$${appliedDiscount.value} off`}
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0"
                  onClick={removeDiscount}
                  style={{ fontSize: '12px', textDecoration: 'none' }}
                >
                  Remove
                </Button>
              </div>
            )}
            
            {appliedGiftcard && (
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ color: '#2e7d32', fontSize: '13px' }}>
                  <strong>{appliedGiftcard.code}</strong> - ${appliedGiftcard.value} giftcard
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0"
                  onClick={removeGiftcard}
                  style={{ fontSize: '12px', textDecoration: 'none' }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Giftcard and Discount Section */}
        <div className="mb-3">
          {/* Giftcard */}
          {!showGiftcard ? (
            <Button 
              variant="outline-secondary"
              className="w-100 mb-2"
              onClick={() => setShowGiftcard(true)}
              disabled={appliedGiftcard !== null}
              style={{ 
                border: '2px solid #666',
                color: '#666',
                fontWeight: '500',
                backgroundColor: appliedGiftcard ? '#d0d0d0' : '#e8e8e8'
              }}
            >
              {appliedGiftcard ? 'Giftcard Applied' : 'Giftcard code'}
            </Button>
          ) : (
            <div className="mb-2">
              <Form.Group>
                <div className="d-flex gap-2">
                  <Form.Control 
                    type="text"
                    placeholder="Enter giftcard code"
                    value={giftcardCode}
                    onChange={(e) => setGiftcardCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && applyGiftcard()}
                  />
                  <Button 
                    variant="success"
                    onClick={applyGiftcard}
                    disabled={!giftcardCode.trim()}
                  >
                    Apply
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setShowGiftcard(false);
                      setGiftcardCode('');
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </Form.Group>
              <small className="text-muted d-block mt-1">Try: GIFT50, GIFT100, GIFT25</small>
            </div>
          )}

          {/* Discount */}
          {!showDiscount ? (
            <Button 
              variant="outline-secondary"
              className="w-100"
              onClick={() => setShowDiscount(true)}
              disabled={appliedDiscount !== null}
              style={{ 
                border: '2px solid #666',
                color: '#666',
                fontWeight: '500',
                backgroundColor: appliedDiscount ? '#d0d0d0' : '#e8e8e8'
              }}
            >
              {appliedDiscount ? 'Discount Applied' : 'Discount'}
            </Button>
          ) : (
            <div>
              <Form.Group>
                <div className="d-flex gap-2">
                  <Form.Control 
                    type="text"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && applyDiscount()}
                  />
                  <Button 
                    variant="success"
                    onClick={applyDiscount}
                    disabled={!discountCode.trim()}
                  >
                    Apply
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setShowDiscount(false);
                      setDiscountCode('');
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </Form.Group>
              <small className="text-muted d-block mt-1">Try: SAVE10, SAVE20, SUMMER25</small>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span style={{ color: '#666' }}>Subtotal</span>
            <span style={{ color: '#666' }}>${calculateSubtotal().toFixed(2)}</span>
          </div>
          
          {appliedDiscount && (
            <div className="d-flex justify-content-between mb-1">
              <span style={{ color: '#28a745' }}>
                Discount ({appliedDiscount.type === 'percentage' 
                  ? `${appliedDiscount.value}%` 
                  : `$${appliedDiscount.value}`})
              </span>
              <span style={{ color: '#28a745' }}>-${calculateDiscountAmount().toFixed(2)}</span>
            </div>
          )}
          
          {appliedGiftcard && (
            <div className="d-flex justify-content-between mb-1">
              <span style={{ color: '#28a745' }}>Giftcard</span>
              <span style={{ color: '#28a745' }}>-${calculateGiftcardAmount().toFixed(2)}</span>
            </div>
          )}
          
          <div className="d-flex justify-content-between mb-2">
            <span style={{ color: '#666' }}>Tax (23.6%)</span>
            <span style={{ color: '#666' }}>${calculateTax().toFixed(2)}</span>
          </div>
          
          <div className="d-flex justify-content-between" style={{ borderTop: '2px solid #333', paddingTop: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>Total</span>
            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column gap-2">
          <Button 
            variant="outline-dark"
            size="lg"
            onClick={onProceed}
            disabled={orderItems.length === 0}
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
            onClick={onCancelOrder}
            disabled={orderItems.length === 0}
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
  );
};

export default OrderPanel;
