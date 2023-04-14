// hooks/useFetchData.js
import { useEffect, useState } from 'react';

export const useFetchData = () => {
    const [categories, setCategories] = useState([]);
    const [organizers, setOrganizers] = useState([]);

    const fetchCategories = async () => {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
    };

    const fetchOrganizers = async () => {
        try {
            const response = await fetch('/api/organizers');
            const data = await response.json();
            setOrganizers(data);
        } catch (error) {
            console.error("Error fetching organizers:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchOrganizers();
    }, []);

    return {
        categories,
        organizers,
    };
};
