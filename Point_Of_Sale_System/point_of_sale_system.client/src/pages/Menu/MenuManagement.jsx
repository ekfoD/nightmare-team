import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuGrid from './MenuGrid';
import ItemPreview from './ItemPreview';
import MenuManagementModal from './MenuManagementModal';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('starters');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // API: Fetch menu data on component mount
  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/menu');
      // const data = await response.json();
      
      // Mock data for now
      const mockCategories = [
        { id: 'starters', name: 'Starters' },
        { id: 'mains', name: 'Mains' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'beverages', name: 'Beverages' },
        { id: 'snacks', name: 'Snacks' },
      ];

      const mockItems = [
        { id: 1, name: 'Caesar Salad', price: 12.99, category: 'starters', ingredients: ['Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing'] },
        { id: 2, name: 'Bruschetta', price: 8.99, category: 'starters', ingredients: ['Tomatoes', 'Basil', 'Olive Oil', 'Bread'] },
        { id: 3, name: 'Grilled Salmon', price: 24.99, category: 'mains', ingredients: ['Salmon', 'Lemon', 'Herbs', 'Vegetables'] },
        { id: 4, name: 'Steak', price: 29.99, category: 'mains', ingredients: ['Beef', 'Pepper', 'Garlic', 'Butter'] },
        { id: 5, name: 'Chocolate Cake', price: 7.99, category: 'desserts', ingredients: ['Chocolate', 'Flour', 'Eggs', 'Sugar'] },
        { id: 6, name: 'Ice Cream', price: 5.99, category: 'desserts', ingredients: ['Cream', 'Sugar', 'Vanilla'] },
        { id: 7, name: 'Coffee', price: 3.99, category: 'beverages', ingredients: ['Coffee Beans', 'Water'] },
        { id: 8, name: 'Orange Juice', price: 4.99, category: 'beverages', ingredients: ['Fresh Oranges'] },
      ];

      setCategories(mockCategories);
      setMenuItems(mockItems);
      setSelectedItem(mockItems[0]);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleModify = () => {
    setShowModal(true);
  };

  // API: Save menu changes
  const handleSave = async (updatedItems, updatedCategories) => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/menu', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: updatedItems, categories: updatedCategories })
      // });

      setMenuItems(updatedItems);
      setCategories(updatedCategories);
      setShowModal(false);
      
      // Update selected item if it still exists
      const updatedSelectedItem = updatedItems.find(item => item.id === selectedItem?.id);
      setSelectedItem(updatedSelectedItem || updatedItems[0]);
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
      <Row>
        <Col lg={8} md={7}>
          <MenuGrid 
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            menuItems={menuItems}
            onItemClick={handleItemClick}
            showAddItem={false}
          />
          
          <div className="text-center mt-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleModify}
              style={{ 
                borderRadius: '8px',
                border: '2px solid #0d6efd',
                fontWeight: '500',
                padding: '12px 50px',
                minWidth: '200px'
              }}
            >
              Modify
            </Button>
          </div>
        </Col>

        <Col lg={4} md={5}>
          <ItemPreview item={selectedItem} categories={categories} />
        </Col>
      </Row>

      <MenuManagementModal 
        show={showModal}
        menuItems={menuItems}
        categories={categories}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default MenuManagement;
