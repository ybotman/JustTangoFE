import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

function CategoryFilterSwitches({ categories, activeFilters, handleFilterChange, categoryColors }) {
    const handleChange = (category) => {
        handleFilterChange(category);
    };

    console.log('Updated filters:', activeFilters);

    return (
        <ToggleButtonGroup exclusive aria-label="category filter">
            {categories.map((category) => {
                const categoryValue = category?.CategoryName || 'default'; // Using CategoryName as the value
                return (
                    <ToggleButton
                        key={category?._id || categoryValue}
                        value={categoryValue}
                        aria-label={categoryValue}
                        selected={!!activeFilters[categoryValue]}
                        onClick={() => {
                            handleChange(categoryValue);
                            console.log('CategoryFilterSwitches.ToggleButton.onChange:', categoryValue);
                        }}
                        sx={{
                            minWidth: 'auto',
                            margin: '0 1px',
                            padding: '2px 2px',
                            '&.Mui-selected': {
                                backgroundColor: activeFilters[categoryValue]
                                    ? categoryColors[categoryValue]
                                    : undefined,
                                color: 'white',
                            },
                        }}
                    >
                        {category?.CategoryName || categoryValue}
                    </ToggleButton>
                );
            })}
        </ToggleButtonGroup>
    );
}

export default CategoryFilterSwitches;