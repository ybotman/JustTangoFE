import React from 'react';
import IconButton from '@mui/material/IconButton';
import CalendarViewMonth from '@mui/icons-material/CalendarViewMonth';
import ListIcon from '@mui/icons-material/List';

const CalendarViewSwitch = ({ view, onChange }) => {
    return (
        <div>
            <IconButton
                color={view === 'dayGridMonth' ? 'primary' : 'default'}
                onClick={() => onChange('dayGridMonth')}
                aria-label="Month View"
            >
                <CalendarViewMonth />
            </IconButton>
            <IconButton
                color={view === 'listMonth' ? 'primary' : 'default'}
                onClick={() => onChange('listMonth')}
                aria-label="List View"
            >
                <ListIcon />
            </IconButton>
        </div>
    );
};

export default CalendarViewSwitch;
