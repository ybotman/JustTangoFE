// hooks/useFetchDataDimensional.js
import { useEffect, useState } from 'react';

export const useFetchDataDimensional = () => {
    const [categories, setCategories] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [regions, setRegions] = useState([]);
    //    const [events, setEvents] = useState([]);
    const [events] = useState([]);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError(error);
        }
    };

    const fetchRegions = async () => {
        console.log('fetchRegions =move?')
        try {
            const response = await fetch('/api/regions');
            const data = await response.json();
            setRegions(data); // Assuming data is an array of regions
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };


    const fetchOrganizers = async () => {
        try {
            const response = await fetch('/api/organizersActive');
            const data = await response.json();
            setOrganizers(data);
        } catch (error) {
            console.error("Error fetching organizers:", error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchOrganizers();
        fetchRegions();
    }, []);

    return {
        categories,
        organizers,
        regions,
        events,
        error
    };
};