import IngredientsEditor from './IngredientsEditor'

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Nav, Container, Row, Col } from 'react-bootstrap';

const AddItemModal = ({ show, setShow, organizationId, categories, taxes, handleAddItem }) => {
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

    const [currentTax, setCurrentTax] = useState(null);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!newItem.taxId) {
            setCurrentTax(null);
            return;
        }
        const newTax = taxes.find(tax => tax.id == newItem.taxId);
        setCurrentTax(newTax);
    }, [newItem.taxId, taxes]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(false);
        handleAddItem(newItem);
    };

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            centered
            className="menu-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Item Menu</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container className="bg-light rounded p-2 w-100">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                        {/* Name */}
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={newItem.name}
                                onChange={e =>
                                    setNewItem(prev => ({ ...prev, name: e.target.value }))
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                Name is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Price */}
                        <Form.Group className="mb-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={newItem.price}
                                onChange={e =>
                                    setNewItem(prev => ({ ...prev, price: e.target.value }))
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                Price is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Category */}
                        <Form.Group className="mb-2">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                required
                                value={newItem.category}
                                onChange={e =>
                                    setNewItem(prev => ({ ...prev, category: e.target.value }))
                                }
                            >
                                <option value="">Select category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Category is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Status */}
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                required
                                value={newItem.status}
                                onChange={e =>
                                    setNewItem(prev => ({ ...prev, status: e.target.value }))
                                }
                            >
                                <option value="">Select from these options...</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Status is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Tax */}
                        <Form.Group className="mb-2">
                            <Form.Label>Assigned Tax</Form.Label>
                            <Form.Select
                                required
                                value={newItem.taxId}
                                onChange={e =>
                                    setNewItem(prev => ({ ...prev, taxId: e.target.value }))
                                }
                            >
                                <option value="">Select from these options...</option>
                                {taxes.map(tax => (
                                    <option key={tax.id} value={tax.id}>
                                        {tax.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Tax selection is required.
                            </Form.Control.Feedback>

                            {currentTax && (
                                <Form.Text className="d-block mt-1">
                                    Current Tax selected: {currentTax.name} (
                                    {currentTax.amount}
                                    {currentTax.numberType === 'flat' ? '$' : '%'})
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            
                        </Form.Group>

                        <div className="mt-3">
                            <Button variant="success" type="submit">
                                Add Item
                            </Button>
                        </div>

                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default AddItemModal;