import React, { useState } from 'react';
import { Button, Form, Badge, Stack } from 'react-bootstrap';

const CategoryManager = ({ categories, onUpdateCategories, itemCounts }) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = newCategory.toLowerCase().replace(/\s+/g, '-');
      onUpdateCategories([...categories, { id: newId, name: newCategory.trim() }]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Delete this category? All items in it will also be removed.')) {
      onUpdateCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      onUpdateCategories(categories.map(cat => 
        cat.id === editingId ? { ...cat, name: editValue.trim() } : cat
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div>
      <h5 className="mb-3">Categories</h5>
      
      {/* Horizontal Category List */}
      <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
        {categories.map((category) => (
          <div 
            key={category.id}
            style={{
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '10px 15px',
              backgroundColor: 'white'
            }}
          >
            {editingId === category.id ? (
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="text"
                  size="sm"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  style={{ width: '120px' }}
                  autoFocus
                />
                <Button size="sm" variant="success" onClick={saveEdit}>✓</Button>
                <Button size="sm" variant="secondary" onClick={cancelEdit}>✕</Button>
              </div>
            ) : (
              <>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <strong>{category.name}</strong>
                  <Badge bg="secondary">{itemCounts[category.id] || 0}</Badge>
                </div>
                <div className="d-flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline-primary"
                    onClick={() => startEditing(category)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-danger"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </Stack>

      {/* Add New Category */}
      <div className="d-flex gap-2" style={{ maxWidth: '400px' }}>
        <Form.Control
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
        />
        <Button 
          variant="success"
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
        >
          + Add Category
        </Button>
      </div>
    </div>
  );
};

export default CategoryManager;
