import React from 'react';
import { Form, Button, InputGroup, ListGroup } from 'react-bootstrap';

const IngredientsEditor = ({ ingredients, onChange }) => {
  const [newIngredient, setNewIngredient] = React.useState('');

  const addIngredient = () => {
    if (newIngredient.trim()) {
      onChange([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div>
      {/* Existing Ingredients */}
      {ingredients.length > 0 && (
        <ListGroup className="mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {ingredients.map((ingredient, index) => (
            <ListGroup.Item 
              key={index}
              className="d-flex justify-content-between align-items-center p-2"
            >
              <span>{ingredient}</span>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Add New Ingredient */}
      <InputGroup>
        <Form.Control 
          type="text"
          placeholder="Add ingredient (press Enter)"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          variant="success"
          onClick={addIngredient}
          disabled={!newIngredient.trim()}
        >
          + Add
        </Button>
      </InputGroup>
    </div>
  );
};

export default IngredientsEditor;
