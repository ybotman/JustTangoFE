import React from 'react';
import CategoryFilterSwitches from './CategoryFilterSwitches';

function CategoryFilter({ categories, activeFilters, handleFilterChange, setActiveFilters, categoryColors }) {
    console.log("CategoryFilter")
    return (
        <CategoryFilterSwitches
            categories={categories}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            setActiveFilters={setActiveFilters}
            categoryColors={categoryColors}
        />
    );
}

export default CategoryFilter;