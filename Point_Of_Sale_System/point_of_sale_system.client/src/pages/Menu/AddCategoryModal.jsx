import CategoryManager from './CategoryManager'
import {Modal} from 'react-bootstrap'

const AddCategoryModal = ({ show, setShow, editedCategories, setEditedCategories }) => {
    const handleUpdateCategories = (updatedCategories) => {
        setEditedCategories(updatedCategories);
    };

    if (!show)
        return null

    return (
        <Modal show={show} onHide={() => setShow(false)} size="lg" centered className="menu-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add Category Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CategoryManager categories={editedCategories} onUpdateCategories={handleUpdateCategories} />
            </Modal.Body>
        </Modal>
    );
}

export default AddCategoryModal;