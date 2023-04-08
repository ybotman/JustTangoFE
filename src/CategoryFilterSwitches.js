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


/*
const CategoryFilterSwitches = ({ categories, activeFilters, handleFilterChange }) => (
    <Grid container justifyContent="center" alignItems="center" spacing={1}>
        {categories.map((category, index) => (
            <Grid item xs={6} key={category.name}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={activeFilters.includes(category.name)}
                            onChange={() => handleFilterChange(category.name)}
                            name={category.name}
                            inputProps={{ 'aria-label': `Toggle ${category.name} filter` }}
                        />
                    }
                    label={category.label}
                    sx={{ margin: 0 }}
                />
            </Grid>
        ))}
    </Grid>
);

*/


export default CategoryFilterSwitches;
