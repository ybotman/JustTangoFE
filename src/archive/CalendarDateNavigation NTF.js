import React from 'react';
import { Box, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';

const CalendarDateNavigation = ({ handlePrevButtonClick, handleTodayButtonClick, handleNextButtonClick }) => {
    return (
        <Box>
            <IconButton onClick={handlePrevButtonClick} aria-label="previous">
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={handleTodayButtonClick} aria-label="Today">
                <TodayIcon />
            </IconButton>
            <IconButton onClick={handleNextButtonClick} aria-label="next">
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
};

export default CalendarDateNavigation;
