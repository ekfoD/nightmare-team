import React from 'react';
import { Row, Col, Nav, Card, Button } from 'react-bootstrap';
import '../../styles/MenuGrid.css'

const MenuGrid = ({
    categories,
    activeTab,
    setActiveTab,
    menuItems,
    onItemClick,
    showAddItem = false,
    onAddItemClick,
    setShowAddItemModal,
    setShowAddCategoryModal,
}) => {
    return (
        <>
            <div className="d-flex gap-2">
                <Button
                    style={{
                        borderRadius: '8px',
                        border: '2px solid #0d6efd',
                        fontWeight: '500',
                        padding: '12px 50px',
                        marginBottom: '10px'
                    }}
                    onClick={() => { setShowAddItemModal(true) }}
                >
                    Add Item
                </Button>
                <Button
                    style={{
                        borderRadius: '8px',
                        border: '2px solid #0d6efd',
                        fontWeight: '500',
                        padding: '12px 50px',
                        marginBottom: '10px'

                    }}
                    onClick={() => { setShowAddCategoryModal(true) }}
                >
                    Add Category
                </Button>
            </div>
            {/* Category Tabs */}
            <Nav variant="tabs" className="mb-4" style={{ backgroundColor: '#abb8fbff' }}>
                {categories.map((category) => (
                    <Nav.Item key={category.id}>
                        <Nav.Link
                            active={activeTab === category.id}
                            onClick={() => setActiveTab(category.id)}
                            className={activeTab === category.id ? "MenuGridSomethingActive" : "MenuGridSomethingA"}
                        >
                            {category.name}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            {/* Menu Items Grid */}
            <Row className="g-3">
                {/* Add Item Card */}
                {showAddItem && (
                    <Col md={4} sm={6}>
                        <Card
                            className="text-center h-100"
                            style={{
                                cursor: 'pointer',
                                border: '2px solid #333',
                                backgroundColor: 'white'
                            }}
                            onClick={onAddItemClick}
                        >
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '180px' }}>
                                <div style={{ fontSize: '48px', color: '#333', marginBottom: '10px' }}>+</div>
                                <Card.Text style={{ color: '#666', fontWeight: '500' }}>Add item</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Menu Item Cards */}
                {menuItems
                    .filter(item => item.category === activeTab)
                    .map((item) => (
                        <Col md={4} sm={6} key={item.id}>
                            <Card
                                className="text-center h-100"
                                style={{
                                    cursor: 'pointer',
                                    border: '2px solid #333',
                                    backgroundColor: 'white'
                                }}
                                onClick={() => onItemClick(item)}
                            >
                                <Card.Body className="d-flex flex-column justify-content-center" style={{ minHeight: '180px' }}>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            backgroundColor: '#f0f0f0',
                                            border: '2px solid #999',
                                            marginBottom: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {item.image && <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />}
                                    </div>
                                    <Card.Text style={{ color: '#666', fontWeight: '500' }}>{item.name}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row>
        </>
    );
};

export default MenuGrid;
