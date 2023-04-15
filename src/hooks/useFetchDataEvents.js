import { useEffect, useState } from 'react';

export const useFetchDataEvents = (userRole, organizerId) => {
    const [events, setEvents] = useState([]);
    organizerId = 1;
    useEffect(() => {
        if (userRole === "Organizer") {
            fetch(`/api/organizers/${organizerId}/events`)
                .then((response) => response.json())
                .then((data) => setEvents(data));
        } else {
            fetch('/api/events')
                .then((response) => response.json())
                .then((data) => setEvents(data));
        }
    }, [userRole, organizerId]);

    return {
        events,
        setEvents
    };
};
