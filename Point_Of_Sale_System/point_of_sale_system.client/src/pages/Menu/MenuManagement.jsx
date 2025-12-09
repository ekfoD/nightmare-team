import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState('starters');
  const [selectedItem, setSelectedItem] = useState({
    name: 'Name',
    price: 'Price',
    category: 'Category',
    ingredients: ['Ingredient', 'Ingredient', 'Ingredient']
  });

  const menuItems = [
    { id: 1, name: 'Item' },
    { id: 2, name: 'Item' },
    { id: 3, name: 'Item' },
    { id: 4, name: 'Item' },
    { id: 5, name: 'Item' },
    { id: 6, name: 'Item' },
    { id: 7, name: 'Item' },
    { id: 8, name: 'Item' },
  ];

  const handleAddItem = () => {
    console.log('Add item clicked');
  };

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
      <Row>
        {/* Left Section - Menu Grid */}
        <Col lg={8} md={7}>
          {/* Category Tabs */}
          <Nav variant="tabs" className="mb-4" style={{ backgroundColor: '#abb8fbff' }}>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'starters'} 
                onClick={() => setActiveTab('starters')}
                style={{ 
                  color: activeTab === 'starters' ? '#333' : '#666',
                  fontWeight: '500',
                  border: activeTab === 'starters' ? '2px solid #333' : '2px solid transparent',
                  borderBottom: 'none'
                }}
              >
                Starters
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'mains'} 
                onClick={() => setActiveTab('mains')}
                style={{ 
                  color: activeTab === 'mains' ? '#333' : '#666',
                  fontWeight: '500',
                  border: activeTab === 'mains' ? '2px solid #333' : '2px solid transparent',
                  borderBottom: 'none'
                }}
              >
                Mains
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'desserts'} 
                onClick={() => setActiveTab('desserts')}
                style={{ 
                  color: activeTab === 'desserts' ? '#333' : '#666',
                  fontWeight: '500',
                  border: activeTab === 'desserts' ? '2px solid #333' : '2px solid transparent',
                  borderBottom: 'none'
                }}
              >
                Desserts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'beverages'} 
                onClick={() => setActiveTab('beverages')}
                style={{ 
                  color: activeTab === 'beverages' ? '#333' : '#666',
                  fontWeight: '500',
                  border: activeTab === 'beverages' ? '2px solid #333' : '2px solid transparent',
                  borderBottom: 'none'
                }}
              >
                Beverages
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'snacks'} 
                onClick={() => setActiveTab('snacks')}
                style={{ 
                  color: activeTab === 'snacks' ? '#333' : '#666',
                  fontWeight: '500',
                  border: activeTab === 'snacks' ? '2px solid #333' : '2px solid transparent',
                  borderBottom: 'none'
                }}
              >
                Snacks
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Menu Items Grid */}
          <Row className="g-3">
            {/* Add Item Card */}
            <Col md={4} sm={6}>
              <Card 
                className="text-center h-100" 
                style={{ 
                  cursor: 'pointer', 
                  border: '2px solid #333',
                  backgroundColor: 'white'
                }}
                onClick={handleAddItem}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '180px' }}>
                  <div style={{ fontSize: '48px', color: '#333', marginBottom: '10px' }}>+</div>
                  <Card.Text style={{ color: '#666', fontWeight: '500' }}>Add item</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Menu Item Cards */}
            {menuItems.map((item) => (
              <Col md={4} sm={6} key={item.id}>
                <Card 
                  className="text-center h-100" 
                  style={{ 
                    cursor: 'pointer', 
                    border: '2px solid #333',
                    backgroundColor: 'white'
                  }}
                  onClick={() => setSelectedItem({
                    name: item.name,
                    price: 'Price',
                    category: 'Category',
                    ingredients: ['Ingredient', 'Ingredient', 'Ingredient']
                  })}
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      </div>
                    </div>
                    <Card.Text style={{ color: '#666', fontWeight: '500' }}>{item.name}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Section - Item Details */}
        <Col lg={4} md={5}>
          <Card style={{ border: '2px solid #333', backgroundColor: 'white' }}>
            <Card.Body>
              {/* Image Placeholder */}
              <div 
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  backgroundColor: '#f0f0f0',
                  border: '2px solid #999',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
              </div>

              {/* Item Details */}
              <div className="text-center mb-3">
                <h5 style={{ color: '#666', marginBottom: '5px' }}>{selectedItem.name}</h5>
                <p style={{ color: '#666', marginBottom: '5px' }}>{selectedItem.price}</p>
                <p style={{ color: '#666', marginBottom: '0' }}>{selectedItem.category}</p>
              </div>

              {/* Ingredients Section */}
              <h6 style={{ color: '#333', fontWeight: 'bold', marginBottom: '15px' }}>Consists of:</h6>
              <ListGroup variant="flush" className="mb-4">
                {selectedItem.ingredients.map((ingredient, index) => (
                  <ListGroup.Item 
                    key={index} 
                    style={{ 
                      backgroundColor: '#e9ecef', 
                      border: 'none',
                      marginBottom: '8px',
                      padding: '12px',
                      color: '#666'
                    }}
                  >
                    <span style={{ marginRight: '10px' }}>●</span>
                    {ingredient}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  className="flex-grow-1"
                  onClick={handleEdit}
                  style={{ 
                    border: '2px solid #666',
                    color: '#666',
                    fontWeight: '500',
                    padding: '10px'
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-secondary"
                  className="flex-grow-1"
                  onClick={handleDelete}
                  style={{ 
                    border: '2px solid #666',
                    color: '#666',
                    fontWeight: '500',
                    padding: '10px'
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MenuManagement;
