// hooks/useFetchData.js
import { useEffect, useState } from 'react';

export const useFetchData = () => {
    const [categories, setCategories] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [events, setEvents] = useState([]);
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

    const fetchOrganizers = async () => {
        try {
            const response = await fetch('/api/organizers');
            const data = await response.json();
            setOrganizers(data);
        } catch (error) {
            console.error("Error fetching organizers:", error);
            setError(error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchOrganizers();
        fetchEvents(); // Fetch events on load
    }, []);

    return {
        categories,
        organizers,
        events,
        error
    };
};