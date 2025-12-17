import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import useAuth from "../../hooks/useAuth.jsx"
import MenuGrid from './MenuGrid';
import ItemPreview from './ItemPreview';
import MenuManagementModal from './MenuManagementModal';
import api from '../../api/axios.js';

const MenuManagement = () => {
    const { auth } = useAuth();
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeTab, setActiveTab] = useState('starters');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [taxes, setTaxes] = useState([]);

    const organizationId = auth.businessId;

    // API: Fetch menu data on component mount
    useEffect(() => {
        fetchMenuData();
        fetchTaxes();
    }, []);

    const fetchTaxes = async () => {
        try {
            const response = await api.get("Tax/Organization/" + organizationId);
            setTaxes(response.data);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }

    }

    const fetchMenuData = async () => {
        setLoading(true);
        try {
            const response = await api.get('MenuBusiness/' + organizationId + '/GetMenuItems');
            const data = response.data;
            // Map categories from the actual fetched items
            const uniqueCategories = [
                ...new Map(
                    data.map(item => [
                        item.category,
                        {
                            id: item.category,
                            name: item.category.charAt(0).toUpperCase() + item.category.slice(1)
                        }
                    ])
                ).values()
            ];
            setCategories(uniqueCategories);

            await Promise.all(
                data.map(async (it) => {
                    const variationResponse = await api.get(
                        `MenuBusiness/${it.id}/GetVariations`
                    );
                    it.variations = variationResponse.data;
                })
            );

            setMenuItems(data);
            console.log("categories: ", uniqueCategories);
            console.log("menuItems: ", data);

        } catch (error) {
            console.error('Error fetching menu data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = async (item) => {
        if (selectedItem != null && item.id === selectedItem.id)
            return;
        setSelectedItem(item);
    };

    const handleAddItem = async (item) => {
        try {
            await api.post("MenuBusiness/PostMenuItem", item);
            fetchMenuData();
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
        setShowModal(false);
    }

    const handleSave = async (updatedItem) => {
        try {

            const response = await api.put("MenuBusiness/PutMenuItem", updatedItem)

            console.log(updatedItem);

            setSelectedItem(response.data);
            fetchMenuData();
            setShowModal(false);
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
                    </div>
                </Col>

                <Col lg={4} md={5}>
                    <ItemPreview item={selectedItem} categories={categories} setShowModal={setShowModal} />
                </Col>
            </Row>

            <MenuManagementModal
                show={showModal}
                categories={categories}
                onCancel={handleCancel}
                selectedItem={selectedItem}
                handleSave={handleSave}
                handleAddItem={handleAddItem}
                taxes={taxes}
                organizationId={organizationId }
            />
        </Container>
    );
};

export default MenuManagement;
