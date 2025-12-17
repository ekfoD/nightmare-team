import React, { useState } from 'react';
import { Form, Stack } from 'react-bootstrap';

const CategoryManager = ({ categories, onUpdateCategories }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            const newId = newCategory.toLowerCase().replace(/\s+/g, '-');
            onUpdateCategories([...categories, { id: newId, name: newCategory.trim() }]);
            setNewCategory('');
        }
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
                        {category.name}
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
                <button
                    className="btn btn-success"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                >
                    + Add Category
                </button>
            </div>
        </div>
    );
};

export default CategoryManager;
