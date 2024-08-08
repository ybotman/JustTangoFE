import { useEffect, useState } from 'react';

export const useFetchDataEvents = (userRole, organizerId) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let response;
                if (userRole === "Organizer") {
                    response = await fetch(`/api/events/owner/${organizerId}`);
                } else {
                    response = await fetch('/api/events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [userRole, organizerId]);

    return {
        events,
        setEvents
    };
};