import { useState, useEffect } from 'react';

export const useCategoryService = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError('Error fetching categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
    };
};