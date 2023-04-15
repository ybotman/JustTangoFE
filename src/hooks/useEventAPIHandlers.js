

import { useState } from 'react';
export const useEventAPIHandlers = (events, setEvents) => {

    const [clickedDate, setClickedDate] = useState('');

    const organizerId = 1; // Replace this with the actual organizer ID

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
                    category: eventData.primary_category,
                    secondary_category: eventData.secondary_category,
                    tri_category: eventData.tri_category,
                    organizer: eventData.organizer,
                    location: eventData.location,
                    recurrence_rule: eventData.recurrence_rule && eventData.recurrence_rule.trim() !== "" ? eventData.recurrence_rule : null,
                    owner_organizerId: organizerId,  // need to fix
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

    const handleEventFormPost = async (eventData) => {
        console.log("Post eventData:", eventData);
        const response = await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...eventData,
                category: eventData.category,
                secondary_category: eventData.secondary_category,
                tri_category: eventData.tri_category,
                organizer: eventData.organizer,
                location: eventData.location,
                recurrence_rule: eventData.recurrence_rule && eventData.recurrence_rule.trim() !== "" ? eventData.recurrence_rule : null,
                owner_organizerId: eventData.owner_organizerId,
            }),
        });

        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
    };

    const handleDeleteEvent = async (eventId) => {
        await fetch(`/api/events/${eventId}`, {
            method: "DELETE",
        });

        setEvents(events.filter((event) => event.id !== eventId));
    };

    return {
        handleEventFormPut,
        handleEventFormPost,
        handleDeleteEvent,
        clickedDate,
        setClickedDate,
    };
};
