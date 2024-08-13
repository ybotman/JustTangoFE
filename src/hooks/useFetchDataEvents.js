import { useEffect, useState } from 'react';

export const useFetchDataEvents = (userRole, region) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            console.log('userRole:', userRole);
            console.log('region:', region);

            try {
                let query = `/api/events?region=${region}`;

                const response = await fetch(query);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [userRole, region]);

    return { events, setEvents };
};