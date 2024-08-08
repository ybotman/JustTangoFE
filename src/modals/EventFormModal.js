import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/system';
//import styles from './EventFormModal.css';

const ModalContent = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
    width: '600px',  // Adjust the width as needed
    maxWidth: '90vw',  // Ensure it doesn't exceed viewport width
});

const EventFormModal = ({ open, onClose, categories = [], onSave }) => {
    const [formValues, setFormValues] = useState({
        title: '',
        startDate: '',
        endDate: '',
        category: '',
    });

    useEffect(() => {
        if (!open) {
            setFormValues({
                title: '',
                startDate: '',
                endDate: '',
                category: '',
            });
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSave = () => {
        onSave(formValues);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalContent>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Title"
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Start Date"
                        name="startDate"
                        type="datetime-local"
                        value={formValues.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="End Date"
                        name="endDate"
                        type="datetime-local"
                        value={formValues.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        value={formValues.category}
                        onChange={handleChange}
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.CategoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default EventFormModal;