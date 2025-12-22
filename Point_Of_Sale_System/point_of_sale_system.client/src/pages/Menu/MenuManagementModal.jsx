import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Nav, Container, Row, Col } from 'react-bootstrap';
import IngredientsEditor from './IngredientsEditor';
import CategoryManager from './CategoryManager';
import { v4 as uuidv4 } from 'uuid';

const MenuManagementModal = ({
    show,
    editedCategories,
    onCancel,
    selectedItem,
    handleSave,
    taxes,
    discounts
}) => {
    const [activeTab, setActiveTab] = useState('editItem');
    const [editedItem, setEditedItem] = useState(null);


    useEffect(() => {
        if (show) {
            setEditedItem(selectedItem ? { ...selectedItem } : null);
            setActiveTab('editItem');
        }
    }, [show, selectedItem]);

    if (!editedItem) return null;

    const handleItemChange = (field, value) => setEditedItem(prev => ({ ...prev, [field]: value }));

    const handleVariationChange = (index, field, value, isNewItem = false) => {
        if (isNewItem) {
            return;
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
            return;
        } else {
            setEditedItem(prev => ({
                ...prev,
                variations: [...prev.variations, newVar]
            }));
        }
    };


    const removeVariation = (index, isNewItem = false) => {
        if (isNewItem) {
            return;
        } else {
            const updated = [...editedItem.variations];
            updated.splice(index, 1);
            setEditedItem(prev => ({
                ...prev,
                variations: updated
            }));
        }
    };




    return (
        <Modal show={show} onHide={onCancel} size="lg" centered className="menu-modal">
            <Modal.Header closeButton>
                <Modal.Title>Manage Menu</Modal.Title>
            </Modal.Header>

            <Modal.Body>
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
                    {/* Taxes */}
                    <Form.Group className="mb-2">
                        <Form.Label>Assigned Tax</Form.Label>
                        <Form.Select value={editedItem.taxId} onChange={e => handleItemChange('taxId', e.target.value)}>
                            {taxes.map(tax => <option key={tax.id} value={tax.id}>{tax.name + " " + tax.amount + " " + tax.numberType}</option>)}
                        </Form.Select>
                    </Form.Group>

                    {/* Variations */}
                    <Form.Group>
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
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Discounts</Form.Label>
                        <Form.Select value={editedItem.discountId} onChange={e => handleItemChange('discountId', e.target.value)}>
                            <option value={""}>Select option..</option>
                            {discounts.map(discount => 
                                <option key={discount.id} value={discount.id}>{discount.name}</option>
                            )}
                        </Form.Select>
                    </Form.Group>

                </Container>
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
