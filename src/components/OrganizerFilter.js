import React from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';

const OrganizerFilter = ({ organizers, onOrganizerChange }) => {
    const handleOrganizerChange = (organizerId, isChecked) => {
        onOrganizerChange(organizerId, isChecked);
    };

    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="organizers-filter-content"
                    id="organizers-filter-header"
                >
                    <GroupIcon />
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                    {organizers.map((organizer) => (
                        <FormControlLabel
                            key={organizer.id}
                            control={
                                <Checkbox
                                    onChange={(event) =>
                                        handleOrganizerChange(organizer.id, event.target.checked)
                                    }
                                    name={`organizer-${organizer.id}`}
                                />
                            }
                            label={organizer.name}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default OrganizerFilter;
