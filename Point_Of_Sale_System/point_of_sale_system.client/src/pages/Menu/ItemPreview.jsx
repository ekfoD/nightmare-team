import React from 'react';
import { Card, Badge, ListGroup, Button } from 'react-bootstrap';

const ItemPreview = ({ item, setItem, categories, setShowModal, handleDelete }) => {
    if (!item) return null;

    const categoryName =
        categories?.find(c => c.id === item.category)?.name || item.category;


    const handleModify = () => {
        setShowModal(true);
    };



    return (
        <Card className="item-preview-card">
            <Card.Body>

                {/* Image */}
                <div className="item-preview-image">
                    {item.imagePath ? (
                        <img
                            //src={item.imagePath}
                            //alt={item.name}
                            className="item-preview-image-img"
                        />
                    ) : (
                        <span className="item-preview-image-placeholder">No Image</span>
                    )}
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="modifyButton"
                    onClick={handleModify}
                    style={{
                        borderRadius: '8px',
                        border: '2px solid #0d6efd',
                        fontWeight: '500',
                        padding: '12px 50px',
                        minWidth: '100%',
                    }}
                >
                    Modify
                </Button>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => { setItem(null); handleDelete(item) }}
                    className="bg-danger"
                    style={{
                        minWidth: '100%',
                        padding: '12px 50px',
                        fontWeight: '500',
                        borderRadius: '8px',
                    }}
                    >
                Delete
                </Button>
                {/* Name */}
                <h2 className="item-preview-name">{item.name}</h2>

                {/* Price */}
                {typeof item.price === 'number' && (
                    <p className="item-preview-price">
                        ${item.price.toFixed(2)}
                    </p>
                )}

                {/* Category */}
                <p className="item-preview-category">
                    Category: <strong>{categoryName}</strong>
                </p>

                {/* Status */}
                {item.status && (
                    <div className="item-preview-status">
                        <Badge bg={item.status === 'active' ? 'success' : 'secondary'}>
                            {item.status}
                        </Badge>
                    </div>
                )}

                {/* Timestamp */}
                {item.timestamp && (
                    <p className="item-preview-timestamp">
                        Created: {new Date(item.timestamp).toLocaleString()}
                    </p>
                )}

                {/* Variations */}
                {/* Variations */}
                <h6 className="item-preview-section-title">Variations</h6>
                {Array.isArray(item.variations) && item.variations.length > 0 ? (
                    <ListGroup variant="flush">
                        {item.variations.map((v) => (
                            <ListGroup.Item key={v.id} className="item-preview-list-item">
                                <strong>{v.name}</strong> — ${v.price.toFixed(2)}{' '}
                                <Badge bg={v.status === 'active' ? 'success' : 'secondary'}>
                                    {v.status}
                                </Badge>{' '}
                                <small className="text-muted">
                                    {new Date(v.timestamp).toLocaleString()}
                                </small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p className="item-preview-muted">No variations</p>
                )}

                {/* Tax */}
                {item.taxId && (
                    <>
                        <h6 className="item-preview-section-title">Tax</h6>
                        <p className="item-preview-muted">
                            Tax ID: {item.taxId}
                        </p>
                    </>
                )}

                {/* Discount */}
                {item.discountId && (
                    <>
                        <h6 className="item-preview-section-title">Discount</h6>
                        <p className="item-preview-muted">
                            Discount ID: {item.discountId}
                        </p>
                    </>
                )}

            </Card.Body>
        </Card>
    );
};

export default ItemPreview;
