import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, InputGroup } from 'react-bootstrap';

const InventoryModal = ({ show, products, onSave, onCancel }) => {
  const [editedProducts, setEditedProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', stock: 0 });

  useEffect(() => {
    if (show) {
      setEditedProducts([...products]);
      setNewProduct({ name: '', stock: 0 });
    }
  }, [show, products]);

  const handleNameChange = (id, newName) => {
    setEditedProducts(editedProducts.map(product => 
      product.id === id ? { ...product, name: newName } : product
    ));
  };

  const handleStockChange = (id, delta) => {
    setEditedProducts(editedProducts.map(product => 
      product.id === id ? { ...product, stock: Math.max(0, product.stock + delta) } : product
    ));
  };

  const handleStockInputChange = (id, value) => {
    const numValue = parseInt(value) || 0;
    setEditedProducts(editedProducts.map(product => 
      product.id === id ? { ...product, stock: Math.max(0, numValue) } : product
    ));
  };

  const handleDelete = (id) => {
    setEditedProducts(editedProducts.filter(product => product.id !== id));
  };

  const handleAddNew = () => {
    if (newProduct.name.trim()) {
      const newId = Math.max(...editedProducts.map(p => p.id), 0) + 1;
      setEditedProducts([...editedProducts, { 
        id: newId, 
        name: newProduct.name, 
        stock: Math.max(0, parseInt(newProduct.stock) || 0)
      }]);
      setNewProduct({ name: '', stock: 0 });
    }
  };

  const handleSave = () => {
    onSave(editedProducts);
  };

  return (
    <Modal show={show} onHide={onCancel} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
        <Modal.Title>Manage Inventory</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Table hover>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
            <tr>
              <th>Product Name</th>
              <th style={{ width: '250px' }}>Stock</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {editedProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <Form.Control 
                    type="text" 
                    value={product.name}
                    onChange={(e) => handleNameChange(product.id, e.target.value)}
                    placeholder="Product name"
                  />
                </td>
                <td>
                  <InputGroup>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleStockChange(product.id, -1)}
                    >
                      −
                    </Button>
                    <Form.Control 
                      type="number" 
                      value={product.stock}
                      onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                      style={{ textAlign: 'center' }}
                      min="0"
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleStockChange(product.id, 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            
            {/* Add new product row */}
            <tr style={{ backgroundColor: '#f0f8ff' }}>
              <td>
                <Form.Control 
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="New product name"
                />
              </td>
              <td>
                <Form.Control 
                  type="number" 
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="Stock"
                  min="0"
                />
              </td>
              <td style={{ textAlign: 'center' }}>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={handleAddNew}
                  disabled={!newProduct.name.trim()}
                >
                  Add
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryModal;
