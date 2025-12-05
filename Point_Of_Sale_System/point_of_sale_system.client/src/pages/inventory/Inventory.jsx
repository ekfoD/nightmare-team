import React, { useState } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Inventory = () => {
  const [products] = useState([
    { id: 1, name: 'name', stock: 80 },
    { id: 2, name: 'name', stock: 150 },
    { id: 3, name: 'name', stock: 25 },
    { id: 4, name: 'name', stock: 100 },
    { id: 5, name: 'name', stock: 105 },
    { id: 6, name: 'name', stock: 120 },
    { id: 7, name: 'name', stock: 250 },
  ]);

  const handleManage = () => {
    console.log('Manage clicked');
  };

  const handleApply = () => {
    console.log('Apply clicked');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#aac2fdff', minHeight: '100vh' }}>
      <Row>
        <Col lg={10} md={9}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <Table hover style={{ marginBottom: 0 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '2px solid #333', padding: '15px' }}>Product name</th>
                  <th style={{ border: '2px solid #333', padding: '15px', textAlign: 'right' }}>
                    Available Product stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ backgroundColor: product.id % 2 === 0 ? '#f8f9fa' : '#e9ecef' }}>
                    <td style={{ padding: '15px', color: '#666' }}>{product.name}</td>
                    <td style={{ padding: '15px', textAlign: 'right', color: '#666' }}>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
        
        <Col lg={2} md={3} className="d-flex flex-column gap-3">
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={handleManage}
            style={{ 
              borderRadius: '8px',
              border: '2px solid #666',
              color: '#666',
              fontWeight: '500',
              padding: '12px'
            }}
          >
            Manage
          </Button>
          
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={handleApply}
            style={{ 
              borderRadius: '8px',
              border: '2px solid #666',
              color: '#666',
              fontWeight: '500',
              padding: '12px'
            }}
          >
            Apply
          </Button>
          
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={handleCancel}
            style={{ 
              borderRadius: '8px',
              border: '2px solid #666',
              color: '#666',
              fontWeight: '500',
              padding: '12px',
              marginTop: 'auto'
            }}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Inventory;
