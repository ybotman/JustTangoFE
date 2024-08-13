import { useEffect, useState } from 'react';

export const useFetchDataEvents = (userRole, organizerId) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            console.log('userRole:', userRole)
            try {
                let response;
                if (userRole === "GenericUser") {
                    response = await fetch(`/api/events/ region???`);
                } else {
                    console.log('Error return all events:');
                    response = await fetch('/api/events');
                }


                if (userRole === "KnonwUser") {
                    response = await fetch(`/api/events/ region???`);
                } else {
                    console.log('Error return all events:');
                    response = await fetch('/api/events');
                }


                if (userRole === "Organizer") {
                    response = await fetch(`/api/events/owner/${organizerId}`);
                } else {
                    response = await fetch('/api/events');
                }

                if (userRole === "RegionalAdmin") {
                    response = await fetch(`/api/events/owner/${organizerId}`);
                } else {
                    console.log('Error return all events:');
                    response = await fetch('/api/events');
                }

                if (userRole === "SystemAdmin") {
                    response = await fetch(`/api/events/owner/${organizerId}`);
                } else {
                    console.log('Error return all events:');
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