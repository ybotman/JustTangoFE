import { useState, useEffect } from 'react';

export const useOrganizerService = () => {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all organizers
    const fetchOrganizers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/organizers');
            const data = await response.json();
            setOrganizers(data);
        } catch (error) {
            setError('Error fetching organizers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch active organizers
    const fetchActiveOrganizers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/organizersActive');
            const data = await response.json();
            setOrganizers(data);
        } catch (error) {
            setError('Error fetching active organizers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new organizer
    const addOrganizer = async (newOrganizer) => {
        setLoading(true);
        try {
            const response = await fetch('/api/organizers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrganizer),
            });
            const data = await response.json();
            setOrganizers((prevOrganizers) => [...prevOrganizers, data]);
        } catch (error) {
            setError('Error adding organizer');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Update an existing organizer
    const updateOrganizer = async (id, updatedOrganizer) => {
        setLoading(true);
        try {
            await fetch(`/api/organizers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrganizer),
            });
            setOrganizers((prevOrganizers) =>
                prevOrganizers.map((org) => (org._id === id ? updatedOrganizer : org))
            );
        } catch (error) {
            setError('Error updating organizer');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Delete an organizer
    const deleteOrganizer = async (id) => {
        setLoading(true);
        try {
            await fetch(`/api/organizers/${id}`, {
                method: 'DELETE',
            });
            setOrganizers((prevOrganizers) => prevOrganizers.filter((org) => org._id !== id));
        } catch (error) {
            setError('Error deleting organizer');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch organizers on mount
    useEffect(() => {
        fetchOrganizers();
    }, []);

    return {
        organizers,
        loading,
        error,
        fetchOrganizers,
        fetchActiveOrganizers,
        addOrganizer,
        updateOrganizer,
        deleteOrganizer,
    };
};