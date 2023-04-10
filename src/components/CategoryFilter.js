import React from 'react';
import CategoryFilterSwitches from './CategoryFilterSwitches';

function CategoryFilter({ categories, activeFilters, handleFilterChange, onCategoryChange }) {
    return (
        <CategoryFilterSwitches
            categories={categories}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            onCategoryChange={onCategoryChange}
        />
    );
};


export default CategoryFilter;

/*

function CategoryFilter({ categories, activeFilters, handleFilterChange, onCategoryChange }) {
    return (
        <CategoryFilterSwitches
            categories={categories}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            onCategoryChange={onCategoryChange}
        />
    );
};
*/
