/* also not being used 

import { useState, useEffect } from 'react';

export const useEvents = (fetchCategories) => {
    const [events, setEvents] = useState([]);
    const [clickedDate, setClickedDate] = useState('');

    const defaultValues = {
        secondary_category: "default",
        tri_category: "default",
        organizer: "TPB",
        location: "Near Boston",
        recurrence_rule: "",
        owner_organizerId: "4",
    };

    useEffect(() => {
        fetch('/api/events')
            .then((response) => response.json())
            .then((data) => setEvents(data));

        if (fetchCategories) {
            fetchCategories();
        }
    }, []);

    const handleEventFormPost = async (eventData) => {
        console.log("Post eventData:", eventData);
        const response = await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...eventData, ...defaultValues,
                category: eventData.category,
                secondary_category: eventData.secondary_category,
                tri_category: eventData.tri_category,
                organizer: eventData.organizer,
                location: eventData.location,
                recurrence_rule: eventData.recurrence_rule,
                owner_organizerId: eventData.owner_organizerId,
            }),
        });

        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
    };

    const handleEventFormPut = async (updatedEvent) => {
        console.log("PUT eventData:", updatedEvent);
        const { id, ...eventData } = updatedEvent;

        try {
            const response = await fetch(`/api/events/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...eventData,
                    ...defaultValues,
                    category: eventData.primary_category,
                    secondary_category: eventData.secondary_category,
                    tri_category: eventData.tri_category,
                    organizer: eventData.organizer,
                    location: eventData.location,
                    recurrence_rule: eventData.recurrence_rule,
                    owner_organizerId: eventData.owner_organizerId,
                }),
            });

            const updatedEventData = await response.json();
            setEvents(
                events.map((event) => (event.id === updatedEventData.id ? updatedEventData : event))
            );
            setClickedDate('');
        } catch (error) {
            console.error("Error while updating event:", error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        await fetch(`/api/events/${eventId}`, {
            method: "DELETE",
        });

        setEvents(events.filter((event) => event.id !== eventId));
    };

    return {
        events,
        handleEventFormPost,
        handleEventFormPut,
        handleDeleteEvent,
    };
};

*/
