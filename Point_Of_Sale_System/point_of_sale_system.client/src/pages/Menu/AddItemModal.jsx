import IngredientsEditor from './IngredientsEditor'

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Nav, Container, Row, Col } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

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
    const [currentTax, setCurrentTax] = useState(null)

    useEffect(() => {
        if (!newItem.taxId) {
            setCurrentTax(null);
            return;
        }
        const newTax = taxes.find((tax) => tax.id == newItem.taxId)
        setCurrentTax(newTax);
    }, [newItem.taxId, taxes])

    if (!show)
        return null
    return (
        <Modal show={show} onHide={() => setShow(false)} size="lg" centered className="menu-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add Item Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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
                            {taxes.map(tax => <option key={tax.id} value={tax.id}>{tax.name}</option>)}
                        </Form.Select>
                        {currentTax && (
                            <Form.Label className="mt-1">
                                Current Tax selected: {currentTax.name}{" "}
                                ({currentTax.amount}
                                {currentTax.numberType === "flat" ? "$" : "%"})
                            </Form.Label>
                        )}

                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Ingredients</Form.Label>
                        <IngredientsEditor ingredients={newItem.ingredients} onChange={ing => setNewItem(prev => ({ ...prev, ingredients: ing }))} />
                    </Form.Group>

                    {/* Variations for new item */}
                    {/*<Form.Label>Variations</Form.Label>*/}
                    {/*{newItem.variations.map((v, idx) => (*/}
                    {/*    <Row key={v.id || v.tempId} className="mb-2 align-items-center">*/}
                    {/*        <Col>*/}
                    {/*            <Form.Control type="text" placeholder="Name" value={v.name} onChange={e => handleVariationChange(idx, 'name', e.target.value, true)} />*/}
                    {/*        </Col>*/}
                    {/*        <Col>*/}
                    {/*            <Form.Control type="number" step="0.01" placeholder="Price" value={v.price} onChange={e => handleVariationChange(idx, 'price', e.target.value, true)} />*/}
                    {/*        </Col>*/}
                    {/*        <Col>*/}
                    {/*            <Form.Select value={v.status} onChange={e => handleVariationChange(idx, 'status', e.target.value, true)}>*/}
                    {/*                <option value="active">Active</option>*/}
                    {/*                <option value="inactive">Inactive</option>*/}
                    {/*            </Form.Select>*/}
                    {/*        </Col>*/}
                    {/*        <Col xs="auto">*/}
                    {/*            <Button variant="danger" onClick={() => removeVariation(idx, true)}>Remove</Button>*/}
                    {/*        </Col>*/}
                    {/*    </Row>*/}
                    {/*))}*/}
                    {/*<Button size="sm" variant="success" onClick={() => addVariation(true)}>+ Add Variation</Button>*/}
                    <div className="mt-3">
                        <Button
                            variant="success"
                            onClick={() => { handleAddItem(newItem) }}
                        >Add Item</Button>
                    </div>

                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default AddItemModal;