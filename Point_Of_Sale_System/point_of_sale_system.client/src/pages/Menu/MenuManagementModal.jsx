import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Nav } from 'react-bootstrap';
import IngredientsEditor from './IngredientsEditor';
import CategoryManager from './CategoryManager';

const MenuManagementModal = ({ show, menuItems, categories, onSave, onCancel }) => {
  const [editedItems, setEditedItems] = useState([]);
  const [editedCategories, setEditedCategories] = useState([]);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    price: 0, 
    category: '', 
    ingredients: [] 
  });
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    if (show) {
      setEditedItems([...menuItems]);
      setEditedCategories([...categories]);
      setNewItem({ 
        name: '', 
        price: 0, 
        category: categories[0]?.id || '', 
        ingredients: [] 
      });
    }
  }, [show, menuItems, categories]);

  const handleItemChange = (id, field, value) => {
    setEditedItems(editedItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleIngredientsChange = (id, ingredients) => {
    setEditedItems(editedItems.map(item => 
      item.id === id ? { ...item, ingredients } : item
    ));
  };

  const handleDeleteItem = (id) => {
    setEditedItems(editedItems.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.category) {
      const newId = Math.max(...editedItems.map(i => i.id), 0) + 1;
      setEditedItems([...editedItems, {
        id: newId,
        name: newItem.name,
        price: parseFloat(newItem.price) || 0,
        category: newItem.category,
        ingredients: newItem.ingredients
      }]);
      setNewItem({ 
        name: '', 
        price: 0, 
        category: editedCategories[0]?.id || '', 
        ingredients: [] 
      });
    }
  };

  const handleUpdateCategories = (updatedCategories) => {
    setEditedCategories(updatedCategories);
    // Remove items from deleted categories
    const categoryIds = updatedCategories.map(c => c.id);
    setEditedItems(editedItems.filter(item => categoryIds.includes(item.category)));
  };

  const getItemCounts = () => {
    const counts = {};
    editedCategories.forEach(cat => {
      counts[cat.id] = editedItems.filter(item => item.category === cat.id).length;
    });
    return counts;
  };

  const handleSave = () => {
    onSave(editedItems, editedCategories);
  };

  return (
    <Modal show={show} onHide={onCancel} size="xl" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
        <Modal.Title>Manage Menu</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="items">Menu Items</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="categories">Categories</Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'items' ? (
          <Table hover responsive>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
              <tr>
                <th style={{ width: '200px' }}>Name</th>
                <th style={{ width: '100px' }}>Price ($)</th>
                <th style={{ width: '150px' }}>Category</th>
                <th>Ingredients</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {editedItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Form.Control 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                    />
                  </td>
                  <td>
                    <Form.Control 
                      type="number" 
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={item.category}
                      onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                    >
                      {editedCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <IngredientsEditor 
                      ingredients={item.ingredients || []}
                      onChange={(ingredients) => handleIngredientsChange(item.id, ingredients)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              
              {/* Add New Item Row */}
              <tr style={{ backgroundColor: '#f0f8ff' }}>
                <td>
                  <Form.Control 
                    type="text" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="New item name"
                  />
                </td>
                <td>
                  <Form.Control 
                    type="number" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <Form.Select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    {editedCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <IngredientsEditor 
                    ingredients={newItem.ingredients}
                    onChange={(ingredients) => setNewItem({ ...newItem, ingredients })}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={handleAddItem}
                    disabled={!newItem.name.trim()}
                  >
                    Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <CategoryManager 
            categories={editedCategories}
            onUpdateCategories={handleUpdateCategories}
            itemCounts={getItemCounts()}
          />
        )}
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

export default MenuManagementModal;
