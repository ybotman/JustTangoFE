import React from 'react';
import CategoryFilterSwitches from './CategoryFilterSwitches';

function CategoryFilter({ categories, activeFilters, handleFilterChange }) {
    return (
        <CategoryFilterSwitches
            categories={categories}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
        />
    );
};

export default CategoryFilter;

