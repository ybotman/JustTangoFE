import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
//import Grid from '@mui/material/Grid';

const CategoryFilterSwitches = ({ categories, activeFilters, handleFilterChange }) => {
    return (
        <>
            {categories.map((cat) => (
                <FormControlLabel
                    key={cat.category}
                    control={
                        <Switch
                            checked={activeFilters[cat.category] || false}
                            onChange={(event) => handleFilterChange(cat.category, event.target.checked)}
                            name={cat.category}
                        />
                    }
                    label={cat.category}
                />
            ))}
        </>
    );
};


export default CategoryFilterSwitches;

