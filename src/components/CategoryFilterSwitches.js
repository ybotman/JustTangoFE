import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

function CategoryFilterSwitches({ categories, activeFilters, handleFilterChange, categoryColors }) {
    const handleChange = (category) => {
        handleFilterChange(category);
    };

    console.log('Updated filters:', activeFilters);

    return (
        <ToggleButtonGroup exclusive aria-label="category filter">
            {categories.map((category) => (
                <ToggleButton
                    key={category.Category_id}
                    value={category.category}
                    aria-label={category.category}
                    selected={activeFilters[category.category]}
                    onClick={() => {
                        handleChange(category.category);
                        console.log('CategoryFilterSwitches.ToggleButton.onChange:', category.category);
                    }} sx={{
                        minWidth: 'auto',
                        margin: '0 1px',
                        padding: '2px 2px',
                        '&.Mui-selected': {
                            backgroundColor: activeFilters[category.category]
                                ? categoryColors[category.category]
                                : undefined,
                            color: 'white',
                        },
                    }}

                >
                    {category.short_name || category.category}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export default CategoryFilterSwitches;

/* import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

function CategoryFilterSwitches({ categories, activeFilters, setActiveFilters }) {
    const handleChange = (event, newActiveFilters) => {
        newActiveFilters = Array(newActiveFilters); // Ensure newActiveFilters is an array
        const oldActiveFilters = categories
            .filter((category) => activeFilters[category.category])
            .map((category) => category.category);

        const toggledFilter = oldActiveFilters.length > newActiveFilters.length
            ? oldActiveFilters.find((filter) => !newActiveFilters.includes(filter))
            : newActiveFilters.find((filter) => !oldActiveFilters.includes(filter));

        setActiveFilters((prevState) => ({
            ...prevState,
            [toggledFilter]: !prevState[toggledFilter],
        }));
    };


    return (
        <ToggleButtonGroup
            value={categories.filter((category) => activeFilters[category.category]).map((category) => category.category)}
            onChange={handleChange}
            exclusive
            aria-label="category filter"

        >
            {categories.map((category) => (
                <ToggleButton key={category.Category_id} value={category.category} aria-label={category.category}
                    sx={{
                        minWidth: 'auto', // Adjust the width of the button
                        margin: '0 1px', // Adjust the margin between buttons
                        padding: '2px 2px' // Adjust the padding inside the button
                    }}>
                    {category.short_name || category.category}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export default CategoryFilterSwitches;

*/

/*
import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
//import Grid from '@mui/material/Grid';

const CategoryFilterSwitches = ({ categories, activeFilters, handleFilterChange, onCategoryChange }) => {
    return (
        <>
            {categories.map((cat) => (
                <FormControlLabel
                    key={cat.category}
                    control={
                        <Switch
                            checked={activeFilters[cat.category] || false}
                            onChange={(event) => {
                                handleFilterChange(cat.category, event.target.checked);
                                onCategoryChange(cat.category);
                            }}
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

*/