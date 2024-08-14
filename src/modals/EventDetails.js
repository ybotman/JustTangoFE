import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const EventDetailsModal = ({ open, onClose, event }) => {
    if (!event) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2">
                    {event.title}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Start: {new Date(event.start).toLocaleString()}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    End: {new Date(event.end).toLocaleString()}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Description: {event.extendedProps.eventDescription}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Location: {event.extendedProps.locationID}
                </Typography>
                <Button onClick={onClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default EventDetailsModal;