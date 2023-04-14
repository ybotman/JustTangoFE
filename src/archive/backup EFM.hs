
    {/*
    return (
        <Dialog open={show} onClose={onHide} maxWidth="md" fullWidth>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogContent>
                {selectedEvent && (
                    <Typography variant="caption" color="textSecondary">
                        Owner ID: {ownerOrganizerId}
                        <ArrowCircleRightIcon />
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
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Start"
                                type="datetime-local"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="End"
                                type="datetime-local"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                style={{ marginTop: '16px' }}
                            />
                        </FormControl>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setShowRepeatingOptions(!showRepeatingOptions)}
                            style={{ marginTop: '32px', minWidth: '150px' }}
                        >
                            Repeating Event
                        </Button>
                        <Collapse in={showRepeatingOptions}>
                            <div>
                            </div>
                        </Collapse>
                    </Grid>
                </Grid>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{ marginBottom: '16px' }}>
                    {selectedEvent ? 'Update Event' : 'Create Event'}
                </Button>
            </DialogActions>
        </Dialog>
    );

        

  */}