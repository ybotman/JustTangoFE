import { useState, useEffect, useCallback } from 'react';

export const useEventService = (region, startDate, endDate) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch events based on region and date range
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const query = `/api/eventsRegion?region=${region}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            const response = await fetch(query);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError('Error fetching events');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [region, startDate, endDate]);

    // Fetch events whenever the region or date range changes
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]); // fetchEvents is dependent on region, startDate, endDate

    return {
        events,
        loading,
        error,
    };
};