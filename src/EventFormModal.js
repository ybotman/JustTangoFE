import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EventFormModal = ({
  show,
  onHide,
  onSubmit,
  onUpdate,
  onDelete,
  selectedEvent,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setCategory(selectedEvent.extendedProps.category);
      setDescription(selectedEvent.extendedProps.description);
      setStart(selectedEvent.start.toISOString());
      setEnd(selectedEvent.end?.toISOString() || '');
    } else {
      setTitle('');
      setCategory('');
      setDescription('');
      setStart('');
      setEnd('');
    }
  }, [selectedEvent]);

  const handleSubmit = () => {
    if (selectedEvent) {
      onUpdate({
        id: selectedEvent.id,
        title,
        primary_category: category,
        description,
        start,
        end,
      });
    } else {
      onSubmit({
        title,
        primary_category: category,
        description,
        start,
        end,
      });
    }
    onHide();
  };


  const handleDelete = () => {
    if (selectedEvent) {
      onDelete(selectedEvent.id);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedEvent ? 'Edit Event' : 'Create Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="eventTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="eventCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>


          <Form.Group controlId="eventDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="eventStart">
            <Form.Label>Start</Form.Label>
            <Form.Control
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="eventEnd">
            <Form.Label>End</Form.Label>
            <Form.Control
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {selectedEvent && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {selectedEvent ? "Update Event" : "Create Event"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventFormModal;