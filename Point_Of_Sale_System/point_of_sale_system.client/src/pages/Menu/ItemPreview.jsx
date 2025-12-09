import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const ItemPreview = ({ item, categories }) => {
  if (!item) return null;

  const categoryName = categories.find(c => c.id === item.category)?.name || 'Unknown';

  return (
    <Card style={{ border: '2px solid #333', backgroundColor: 'white' }}>
      <Card.Body>
        {/* Image Placeholder */}
        <div 
          style={{ 
            width: '100%', 
            height: '150px', 
            backgroundColor: '#f0f0f0',
            border: '2px solid #999',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {item.image && <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />}
        </div>

        {/* Item Details */}
        <div className="text-center mb-3">
          <h5 style={{ color: '#666', marginBottom: '5px' }}>{item.name}</h5>
          <p style={{ color: '#666', marginBottom: '5px' }}>${item.price?.toFixed(2)}</p>
          <p style={{ color: '#666', marginBottom: '0' }}>{categoryName}</p>
        </div>

        {/* Ingredients Section */}
        {item.ingredients && item.ingredients.length > 0 && (
          <>
            <h6 style={{ color: '#333', fontWeight: 'bold', marginBottom: '15px' }}>Consists of:</h6>
            <ListGroup variant="flush">
              {item.ingredients.map((ingredient, index) => (
                <ListGroup.Item 
                  key={index} 
                  style={{ 
                    backgroundColor: '#e9ecef', 
                    border: 'none',
                    marginBottom: '8px',
                    padding: '12px',
                    color: '#666'
                  }}
                >
                  <span style={{ marginRight: '10px' }}>●</span>
                  {ingredient}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ItemPreview;
