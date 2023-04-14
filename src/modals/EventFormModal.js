import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Grid,
} from '@mui/material';


import { formatDate, isValidDates } from '../utilities/DateUtils';
import { buildRRuleString } from '../utilities/rruleUtils';

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
    const [primaryCategory, setPrimaryCategory] = useState('');
    const [secondaryCategory, setSecondaryCategory] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [recurrenceType, setRecurrenceType] = useState('None');
    const [recurrenceWeekOfMonth, setRecurrenceWeekOfMonth] = useState('');
    const [exclusionDates, setExclusionDates] = useState('');
    const [repeat, setRepeat] = useState(false);

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);
            setPrimaryCategory(selectedEvent.extendedProps.primary_category);
            setSecondaryCategory(selectedEvent.extendedProps.secondary_category);
            setDescription(selectedEvent.extendedProps.description);
            setStart(formatDate(new Date(selectedEvent.start)));
            setEnd(selectedEvent.end ? formatDate(new Date(selectedEvent.end)) : '');

        } else {
            setTitle('');
            setPrimaryCategory('');
            setSecondaryCategory('');

            setDescription('');
            setStart('');
            setEnd('');
        }
    }, [selectedEvent]);

    const handleSubmit = () => {
        if (!isValidDates(start, end, primaryCategory)) {
            return;
        }

        const rruleString = buildRRuleString(recurrenceType, recurrenceWeekOfMonth, exclusionDates);

        if (selectedEvent) {
            console.log("PUT request event with title category:", title, primaryCategory);
            onPut({
                id: selectedEvent.id,
                title,
                primary_category: primaryCategory,
                secondary_category: secondaryCategory,
                description,
                start,
                end,
                rrecurrence_rule: rruleString,
            });
        } else {
            console.log("POST request event with title category:", title, primaryCategory);
            onPost({
                title,
                primary_category: primaryCategory,
                secondary_category: secondaryCategory,
                description,
                start,
                end,
                rrecurrence_rule: rruleString,
            });
        }

        onHide();
    };
    const handleRepeatClick = () => {
        setRepeat(!repeat);
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Primary Category</InputLabel>
                            <Select
                                value={primaryCategory || ''}
                                onChange={(e) => setPrimaryCategory(e.target.value)}
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
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Secondary Category</InputLabel>
                            <Select
                                value={secondaryCategory || ''}
                                onChange={(e) => setSecondaryCategory(e.target.value)}
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
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                        <Button variant="outlined" onClick={handleRepeatClick}>
                            Repeat
                        </Button>
                    </Grid>
                </Grid>
                {repeat && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Recurrence Type</InputLabel>
                                <Select
                                    value={recurrenceType}
                                    onChange={(e) => setRecurrenceType(e.target.value)}
                                >
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {recurrenceType === 'Monthly' && (
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Recurrence Week of Month</InputLabel>
                                    <Select
                                        value={recurrenceWeekOfMonth}
                                        onChange={(e) => setRecurrenceWeekOfMonth(e.target.value)}
                                    >
                                        <MenuItem value="First">First</MenuItem>
                                        <MenuItem value="Second">Second</MenuItem>
                                        <MenuItem value="Third">Third</MenuItem>
                                        <MenuItem value="Fourth">Fourth</MenuItem>
                                        <MenuItem value="Last">Last</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Exclusion Dates"
                                    value={exclusionDates}
                                    onChange={(e) => setExclusionDates(e.target.value)}
                                    placeholder="YYYY-MM-DD, YYYY-MM-DD, ..."
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
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


