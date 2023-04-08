import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Typography,
} from '@mui/material';

import { formatDate, isValidDates } from './Utils';

const EventFormModal = ({
  show,
  onHide,
  onPost,
  onPut,
  onDelete,
  selectedEvent,
  categories,
  clickedDate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setCategory(selectedEvent.extendedProps.primary_category);
      setDescription(selectedEvent.extendedProps.description);
      setStart(formatDate(new Date(selectedEvent.start)));
      setEnd(selectedEvent.end ? formatDate(new Date(selectedEvent.end)) : '');

    } else {
      setTitle('');
      setCategory('');
      setDescription('');
      setStart('');
      setEnd('');
    }
  }, [selectedEvent]);

  const handleSubmit = () => {
    if (!isValidDates(start, end, category)) {
      return;
    }

    if (selectedEvent) {
      console.log("PUT request event with title category:", title, category);
      onPut({
        id: selectedEvent.id,
        title,
        primary_category: category,
        description,
        start,
        end,
      });
    } else {
      console.log("POST request event with title category:", title, category);
      onPost({
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
    <Dialog open={show} onClose={onHide} maxWidth="md" fullWidth>
      <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
      <DialogContent>
        {selectedEvent && (
          <Typography variant="caption" color="textSecondary">
            Event ID: {selectedEvent.id}
          </Typography>
        )}

        <FormControl fullWidth margin="normal">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category || ''}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>Select category</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.category} value={cat.category}>
                {cat.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Start"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="End"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        {selectedEvent && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button variant="outlined" onClick={onHide}>
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {selectedEvent ? 'Update Event' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventFormModal;