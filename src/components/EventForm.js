


import { useState } from 'react';

function EventForm(props) {
    const [formData, setFormData] = useState(props.selectedEvent || {});

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (props.selectedEvent) {
            props.onPut(formData);
        } else {
            props.onPost(formData);
        }
        props.onHide();
    };

    const handleDeleteButtonClick = () => {
        props.onDelete(props.selectedEvent.id);
        props.onHide();
    };

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{props.selectedEvent ? 'Edit Event' : 'Create Event'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="category"
                            value={formData.category || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {props.categories.map((category) => (
                                <option value={category.name} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {props.selectedEvent ? 'Update Event' : 'Create Event'}
                    </Button>

                    {props.selectedEvent && (
                        <Button variant="danger" onClick={handleDeleteButtonClick}>
                            Delete Event
                        </Button>
                    )}
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EventForm;
