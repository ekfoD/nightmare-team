import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.jsx';
import api from '../../api/axios.js';
import EditOrganization from './EditOrganization';

function Settings() {
  const [activeTab, setActiveTab] = useState('organization');
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  const organizationId = auth.businessId;

  useEffect(() => {
    async function loadOrg() {
      try {
        const response = await api.get('/Organizations/' + organizationId);
        console.log('Loaded:', response.data);

        setBusiness(response.data);
      } catch (err) {
        console.log(err);
        setError('Failed to load organization.');
      } finally {
        setLoading(false);
      }
    }

    loadOrg();
  }, []);

  async function handleFormSubmit(updatedData) {
    try {
      const response = await api.put(
        `/Organizations/${business.organizationId}`,
        updatedData
      );

      console.log('Update result:', response.data);

      setBusiness(response.data);

      alert('Saved successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to save!');
    }
  }

  return (
    <Container fluid className='p-4'>
      <Row>
        <Col md={3}>
          <Card className='shadow-sm'>
            <ListGroup variant='flush'>
              <ListGroup.Item
                action
                active={activeTab === 'organization'}
                onClick={() => setActiveTab('organization')}
              >
                Organization
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={9}>
          {activeTab === 'organization' && (
            <>
              {loading && <p>Loading organization...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}

              {!loading && business && (
                <EditOrganization
                  business={business}
                  onSubmit={handleFormSubmit}
                />
              )}
            </>
          )}

          {activeTab === 'profile' && <EditAccount username='test' />}
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;
