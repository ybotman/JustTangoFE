import React, { useState } from "react";
import { Modal, Box, List, ListItem, ListItemText, Checkbox, FormControl, Button, InputLabel } from "@mui/material";

import { styled } from "@mui/system";
import styles from './AdvancedFilterModal.css';

const ModalContent = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
});


const AdvancedFilterModal = ({ show, onHide, organizers = [], onApply }) => {
    const [selectedOrganizers, setSelectedOrganizers] = useState([]);

    const handleToggle = (orgId) => {
        const currentIndex = selectedOrganizers.indexOf(orgId);
        const newSelectedOrganizers = [...selectedOrganizers];

        if (currentIndex === -1) {
            newSelectedOrganizers.push(orgId);
        } else {
            newSelectedOrganizers.splice(currentIndex, 1);
        }

        setSelectedOrganizers(newSelectedOrganizers);
    };

    const handleApply = () => {
        onApply(selectedOrganizers);
        onHide();
    };

    return (
        <Modal open={show} onClose={onHide}>
            <ModalContent>
                <FormControl className={styles.modalWrapper}>
                    <InputLabel htmlFor="organizer-select">Organizers</InputLabel>
                    <List style={{ marginTop: 30 }}>
                        {organizers.map((org) => {
                            const labelId = `checkbox-list-label-${org.id}`;
                            return (
                                <ListItem key={org.id} role={undefined} dense button onClick={() => handleToggle(org.id)}>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedOrganizers.indexOf(org.id) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                    <ListItemText id={labelId} primary={org.name} />
                                </ListItem>
                            );
                        })}
                    </List>
                </FormControl>
                <Box mt={2}>
                    <Button onClick={handleApply}>Apply</Button>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default AdvancedFilterModal;