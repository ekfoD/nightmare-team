import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, InputGroup } from 'react-bootstrap';

const numberTypes = [
  { value: 1, label: "Flat" },
  { value: 2, label: "Percentage" }
];

const statusTypes = [
  { value: 1, label: "Active" },
  { value: 2, label: "Inactive" },
  { value: 3, label: "Unavailable" }
];

const TaxModal = ({ show, taxes, onSave, onCancel }) => {
  const [editedTaxes, setEditedTaxes] = useState([]);
  const [newTax, setNewTax] = useState({
    name: "",
    amount: 0,
    numberType: 1,
    status: 1
  });

  useEffect(() => {
    if (show) {
      setEditedTaxes(taxes.map(t => ({ ...t })));
      setNewTax({ name: "", amount: 0, numberType: 1, status: 1 });
    }
  }, [show, taxes]);

  const handleFieldChange = (id, field, value) => {
    setEditedTaxes(editedTaxes.map(tax =>
      tax.id === id ? { ...tax, [field]: value } : tax
    ));
  };

  const handleDelete = (id) => {
    setEditedTaxes(editedTaxes.filter(tax => tax.id !== id));
  };

  const handleAddNew = () => {
    if (newTax.name.trim()) {
      const maxId = editedTaxes.length > 0 ? Math.max(...editedTaxes.map(t => t.id)) : 0;
      const newId = maxId + 1;

      setEditedTaxes([
        ...editedTaxes,
        {
          id: newId,
          name: newTax.name.trim(),
          amount: parseFloat(newTax.amount) || 0,
          numberType: parseInt(newTax.numberType),
          status: parseInt(newTax.status)
        }
      ]);

      setNewTax({
        name: "",
        amount: 0,
        numberType: 1,
        status: 1
      });
    }
  };

  const handleSave = () => {
    onSave(editedTaxes);
  };

  return (
    <Modal show={show} onHide={onCancel} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa" }}>
        <Modal.Title>Manage Taxes</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table hover className="mb-0">
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "white",
              boxShadow: "0 2px 2px -1px rgba(0, 0, 0, 0.1)"
            }}
          >
            <tr>
              <th>Name</th>
              <th style={{ width: "150px", textAlign: "center" }}>Amount</th>
              <th style={{ width: "150px", textAlign: "center" }}>Number Type</th>
              <th style={{ width: "150px", textAlign: "center" }}>Status</th>
              <th style={{ width: "100px", textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {editedTaxes.map((tax) => (
              <tr key={tax.id}>
                <td>
                  <Form.Control
                    type="text"
                    value={tax.name}
                    onChange={(e) =>
                      handleFieldChange(tax.id, "name", e.target.value)
                    }
                  />
                </td>

                <td className="text-center">
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={tax.amount}
                    onChange={(e) =>
                      handleFieldChange(tax.id, "amount", e.target.value)
                    }
                    style={{ textAlign: "center" }}
                  />
                </td>

                <td className="text-center">
                  <Form.Select
                    value={tax.numberType}
                    onChange={(e) =>
                      handleFieldChange(tax.id, "numberType", e.target.value)
                    }
                  >
                    {numberTypes.map((nt) => (
                      <option key={nt.value} value={nt.value}>
                        {nt.label}
                      </option>
                    ))}
                  </Form.Select>
                </td>

                <td className="text-center">
                  <Form.Select
                    value={tax.status}
                    onChange={(e) =>
                      handleFieldChange(tax.id, "status", e.target.value)
                    }
                  >
                    {statusTypes.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </Form.Select>
                </td>

                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(tax.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {/* Add new tax row */}
            <tr style={{ backgroundColor: "#f0f8ff" }}>
              <td>
                <Form.Control
                  type="text"
                  value={newTax.name}
                  placeholder="Name"
                  onChange={(e) =>
                    setNewTax({ ...newTax, name: e.target.value })
                  }
                />
              </td>

              <td className="text-center">
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={newTax.amount}
                  placeholder="Amount"
                  onChange={(e) =>
                    setNewTax({ ...newTax, amount: e.target.value })
                  }
                  style={{ textAlign: "center" }}
                />
              </td>

              <td className="text-center">
                <Form.Select
                  value={newTax.numberType}
                  onChange={(e) =>
                    setNewTax({ ...newTax, numberType: e.target.value })
                  }
                >
                  {numberTypes.map((nt) => (
                    <option key={nt.value} value={nt.value}>
                      {nt.label}
                    </option>
                  ))}
                </Form.Select>
              </td>

              <td className="text-center">
                <Form.Select
                  value={newTax.status}
                  onChange={(e) =>
                    setNewTax({ ...newTax, status: e.target.value })
                  }
                >
                  {statusTypes.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </Form.Select>
              </td>

              <td className="text-center">
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleAddNew}
                  disabled={!newTax.name.trim()}
                >
                  Add
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#f8f9fa" }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaxModal;
