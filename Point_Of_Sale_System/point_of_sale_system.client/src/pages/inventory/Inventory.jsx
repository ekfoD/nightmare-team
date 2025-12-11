import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InventoryModal from './InventoryModal';

const Inventory = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', stock: 80 },
    { id: 2, name: 'Product 2', stock: 150 },
    { id: 3, name: 'Product 3', stock: 25 },
    { id: 4, name: 'Product 4', stock: 100 },
    { id: 5, name: 'Product 5', stock: 105 },
    { id: 6, name: 'Product 6', stock: 120 },
    { id: 7, name: 'Product 7', stock: 250 },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleModify = () => {
    setShowModal(true);
  };

  const handleSave = (updatedProducts) => {
    setProducts(updatedProducts);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#aac2fdff', minHeight: '100vh' }}>
      <div className="d-flex flex-column align-items-center" style={{ height: 'calc(100vh - 100px)' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          width: '100%',
          maxWidth: '1200px',
          marginBottom: '30px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 200px)'
        }}>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <Table hover style={{ marginBottom: 0 }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
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
        </div>
        
        <Button 
          variant="primary" 
          size="lg"
          onClick={handleModify}
          style={{ 
            borderRadius: '8px',
            border: '2px solid #0d6efd',
            fontWeight: '500',
            padding: '12px 50px',
            minWidth: '200px'
          }}
        >
          Modify
        </Button>
      </div>

      <InventoryModal 
        show={showModal}
        products={products}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default Inventory;
