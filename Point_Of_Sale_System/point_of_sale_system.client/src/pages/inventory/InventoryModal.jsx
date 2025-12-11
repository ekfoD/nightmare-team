import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, InputGroup } from 'react-bootstrap';

const InventoryModal = ({ show, products, onSave, onCancel }) => {
  const [editedProducts, setEditedProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', stock: 0 });

  useEffect(() => {
    if (show) {
      // Deep copy 'products' to avoid mutation of the original array
      setEditedProducts(products.map(p => ({ ...p }))); 
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
    // Ensure the input is treated as a number, defaulting to 0 for invalid input
    const numValue = parseInt(value, 10) || 0; 
    setEditedProducts(editedProducts.map(product => 
      product.id === id ? { ...product, stock: Math.max(0, numValue) } : product
    ));
  };

  const handleDelete = (id) => {
    setEditedProducts(editedProducts.filter(product => product.id !== id));
  };

  const handleAddNew = () => {
    if (newProduct.name.trim()) {
      // Find max ID or default to 0, then add 1 for new ID
      const maxId = editedProducts.length > 0 ? Math.max(...editedProducts.map(p => p.id)) : 0;
      const newId = maxId + 1;
      
      setEditedProducts([...editedProducts, { 
        id: newId, 
        name: newProduct.name.trim(), 
        stock: Math.max(0, parseInt(newProduct.stock, 10) || 0)
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
        <Table hover className="mb-0">
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.1)' }}>
            <tr>
              <th style={{ verticalAlign: 'middle' }}>Product Name</th>
              <th style={{ width: '250px', textAlign: 'center', verticalAlign: 'middle' }}>Stock</th>
              <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {editedProducts.map((product) => (
              <tr key={product.id}>
                <td style={{ verticalAlign: 'middle' }}>
                  <Form.Control 
                    type="text" 
                    value={product.name}
                    onChange={(e) => handleNameChange(product.id, e.target.value)}
                    placeholder="Product name"
                  />
                </td>
                
                <td className="text-center align-middle">
                  <InputGroup style={{ width: '150px', margin: '0 auto' }}> 
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
                
                <td className="text-center align-middle">
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
            
            <tr style={{ backgroundColor: '#f0f8ff' }}>
              <td style={{ verticalAlign: 'middle' }}>
                <Form.Control 
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="New product name"
                />
              </td>
              <td className="text-center align-middle">
                <Form.Control 
                  type="number" 
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="Stock"
                  min="0"
                  style={{ width: '100px', margin: '0 auto', textAlign: 'center' }}
                />
              </td>
              <td className="text-center align-middle">
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