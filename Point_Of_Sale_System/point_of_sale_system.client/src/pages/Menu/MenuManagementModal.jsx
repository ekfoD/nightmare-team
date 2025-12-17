import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Nav, Container, Row, Col } from 'react-bootstrap';
import IngredientsEditor from './IngredientsEditor';
import CategoryManager from './CategoryManager';
import { v4 as uuidv4 } from 'uuid';

const MenuManagementModal = ({
    show,
    categories,
    availableTaxes = [],
    onCancel,
    selectedItem,
    handleSave,
    handleAddItem,
    taxes,
    organizationId
}) => {
    const [activeTab, setActiveTab] = useState('editItem');
    const [editedItem, setEditedItem] = useState(null);
    const [editedCategories, setEditedCategories] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        price: 0,
        category: '',
        status: '',
        variations: [],
        taxId: '',
        ingredients: [],
        organizationId: organizationId 
    });

    useEffect(() => {
        if (show) {
            setEditedItem(selectedItem ? { ...selectedItem } : null);
            setEditedCategories([...categories]);
            setNewItem({
                name: '',
                price: 0,
                category: categories[0]?.id || '',
                status: '',
                variations: [],
                taxId: availableTaxes[0]?.id || '',
                ingredients: [],
                organizationId: organizationId
            });
            setActiveTab('editItem');
        }
    }, [show, selectedItem]);

    if (!editedItem) return null;

    const handleItemChange = (field, value) => setEditedItem(prev => ({ ...prev, [field]: value }));
    const handleIngredientsChange = (ingredients) => setEditedItem(prev => ({ ...prev, ingredients }));

    const handleVariationChange = (index, field, value, isNewItem = false) => {
        if (isNewItem) {
            const updated = [...newItem.variations];
            updated[index] = { ...updated[index], [field]: value };
            setNewItem(prev => ({ ...prev, variations: updated }));
        } else {
            const updated = [...editedItem.variations];
            updated[index] = { ...updated[index], [field]: value };
            setEditedItem(prev => ({
                ...prev,
                variations: updated
            }));
        }
    };



    const addVariation = (isNewItem = false) => {
        const newVar = {
            tempId: uuidv4(),
            name: '',
            price: 0,
            status: 'active'
        };

        if (isNewItem) {
            setNewItem(prev => ({
                ...prev,
                variations: [...prev.variations, newVar]
            }));
        } else {
            setEditedItem(prev => ({
                ...prev,
                variations: [...prev.variations, newVar]
            }));
        }
    };


    const removeVariation = (index, isNewItem = false) => {
        if (isNewItem) {
            const updated = [...newItem.variations];
            updated.splice(index, 1);
            setNewItem(prev => ({ ...prev, variations: updated }));
        } else {
            const updated = [...editedItem.variations];
            updated.splice(index, 1);
            setEditedItem(prev => ({
                ...prev,
                variations: updated
            }));
        }
    };


    const handleUpdateCategories = (updatedCategories) => {
        setEditedCategories(updatedCategories);
        if (!updatedCategories.find(c => c.id === editedItem.category)) {
            setEditedItem(prev => ({ ...prev, category: updatedCategories[0]?.id || '' }));
        }
    };

    return (
        <Modal show={show} onHide={onCancel} size="lg" centered className="menu-modal">
            <Modal.Header closeButton>
                <Modal.Title>Manage Menu</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                    <Nav.Item><Nav.Link eventKey="editItem">Edit Item</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="categories">Categories</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="newItem">Add New Item</Nav.Link></Nav.Item>
                </Nav>

                {activeTab === 'editItem' && (
                    <Container className="bg-light rounded p-2 w-100">
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={editedItem.name} onChange={e => handleItemChange('name', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" min="0" value={editedItem.price} onChange={e => handleItemChange('price', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={editedItem.category} onChange={e => handleItemChange('category', e.target.value)}>
                                {editedCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={editedItem.status} onChange={e => handleItemChange('status', e.target.value)} >
                                <option value={"active"}>Active</option>
                                <option value={"inactive"}>Inactive</option>
                                <option value={"unavailable"}>Unavailable</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Ingredients</Form.Label>
                            <IngredientsEditor ingredients={editedItem.ingredients} onChange={handleIngredientsChange} />
                        </Form.Group>
                        {/* Taxes */}
                        <Form.Group className="mb-2">
                            <Form.Label>Assigned Tax</Form.Label>
                            <Form.Select value={editedItem.taxId} onChange={e => handleItemChange('taxId', e.target.value)}>
                                {taxes.map(tax => <option key={tax.id} value={tax.id}>{tax.name + " " + tax.amount + " " + tax.numberType}</option>)}
                            </Form.Select>
                        </Form.Group>

                        {/* Variations */}
                        <Form.Label>Variations</Form.Label>
                        {editedItem.variations.map((v, idx) => (
                            <Row key={v.id || v.tempId} className="mb-2 align-items-center">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        value={v.name}
                                        onChange={(e) => handleVariationChange(idx, 'name', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="Price"
                                        value={v.price}
                                        onChange={(e) => handleVariationChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Select
                                        value={v.status}
                                        onChange={(e) => handleVariationChange(idx, 'status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Select>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="danger" onClick={() => removeVariation(idx)}>Remove</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button size="sm" variant="success" onClick={() => addVariation(false)}>+ Add Variation</Button>


                    </Container>
                )}

                {activeTab === 'categories' && (
                    <CategoryManager categories={editedCategories} onUpdateCategories={handleUpdateCategories} />
                )}

                {activeTab === 'newItem' && (
                    <Container className="bg-light rounded p-2 w-100">
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" value={newItem.name} onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" min="0" value={newItem.price} onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={newItem.category} onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}>
                                {editedCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select required value={newItem.status} onChange={e => setNewItem(prev => ({ ...prev, status: e.target.value }))} >
                                <option value={""}>Select from these options...</option>
                                <option value={"active"}>Active</option>
                                <option value={"inactive"}>Inactive</option>
                                <option value={"unavailable"}>Unavailable</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Assigned Tax</Form.Label>
                            <Form.Select required value={newItem.taxId} onChange={e => setNewItem(prev => ({ ...prev, taxId: e.target.value }))}>
                                <option value={""}>Select from these options...</option>
                                {taxes.map(tax => <option key={tax.id} value={tax.id}>{tax.name + " " + tax.amount + " " + tax.numberType}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Ingredients</Form.Label>
                            <IngredientsEditor ingredients={newItem.ingredients} onChange={ing => setNewItem(prev => ({ ...prev, ingredients: ing }))} />
                        </Form.Group>

                        {/* Variations for new item */}
                        <Form.Label>Variations</Form.Label>
                        {newItem.variations.map((v, idx) => (
                            <Row key={v.id || v.tempId} className="mb-2 align-items-center">
                                <Col>
                                    <Form.Control type="text" placeholder="Name" value={v.name} onChange={e => handleVariationChange(idx, 'name', e.target.value, true)} />
                                </Col>
                                <Col>
                                    <Form.Control type="number" step="0.01" placeholder="Price" value={v.price} onChange={e => handleVariationChange(idx, 'price', e.target.value, true)} />
                                </Col>
                                <Col>
                                    <Form.Select value={v.status} onChange={e => handleVariationChange(idx, 'status', e.target.value, true)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Select>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="danger" onClick={() => removeVariation(idx, true)}>Remove</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button size="sm" variant="success" onClick={() => addVariation(true)}>+ Add Variation</Button>
                        <div className="mt-3">
                            <Button
                                variant="success"
                                onClick={() => { handleAddItem(newItem) } }
                            >Add Item</Button>
                        </div>
                        
                    </Container>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                {activeTab === 'editItem' && <Button variant="primary" onClick={() => {
                    handleSave({
                        ...editedItem,
                        // eslint-disable-next-line no-unused-vars
                        variations: editedItem.variations.map(({ tempId, ...v }) => v)
                    })
                }}>Save Changes</Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default MenuManagementModal;
