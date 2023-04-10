import { useState, useEffect } from 'react';
import { App } from './App';

const handleEventFormPost = async (eventData) => {
    console.log("Post eventData:", eventData);
    const response = await fetch("/api/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...eventData,
            ...defaultValues,
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

const handleOrganizerChange = (event) => {
    if (event.target.checked) {
        setSelectedOrganizers([...selectedOrganizers, parseInt(event.target.value)]);
    } else {
        setSelectedOrganizers(selectedOrganizers.filter((id) => id !== parseInt(event.target.value)));
    }
};

const handleDateClick = (info) => {
    console.log("Clicked on date:", info.dateStr);
    setSelectedEvent('');
    setClickedDate(info.date);
    setShowEventFormModal(true);
};

const handlePrevButtonClick = () => {
    calendarRef.current.getApi().prev();
};

const handleTodayButtonClick = () => {
    calendarRef.current.getApi().today();
};

const handleNextButtonClick = () => {
    calendarRef.current.getApi().next();
};

const handleFilterChange = (category, checked) => {
    setActiveFilters((prevFilters) => {
        const updatedFilters = {
            ...prevFilters,
            [category]: checked,
        };
        console.log('Updated filters:', updatedFilters);
        return updatedFilters;
    });
};

const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventFormModal(true);
};


const handleViewChange = (viewType) => {
    calendarRef.current.getApi().changeView(viewType);
};

const handleOrganizersButtonClick = () => {
    toggleLoginModal();
};



const renderEventContent = (eventInfo) => {
    const category = eventInfo.event.extendedProps.primary_category;

    let backgroundColor, textColor, fontStyle, fontSize, fontWeight, borderWidth, borderStyle, borderColor;

    switch (category) {
        case "Practica": backgroundColor = "cyan"; textColor = "black"; fontWeight = "bold"; fontSize = "smaller"; break;
        case "Workshop": backgroundColor = "lightgreen"; textColor = "black"; fontWeight = "bold"; fontSize = "smaller"; break;
        case "Festival": backgroundColor = "LimeGreen"; textColor = "black"; fontWeight = "bold"; borderWidth = "2px"; borderStyle = 'solid'; fontSize = "smaller"; borderColor = 'Yellow'; break;
        case "Class": backgroundColor = "white"; textColor = "black"; fontWeight = "normal"; fontSize = "smaller"; break;
        case "Beginner": backgroundColor = "white"; textColor = "grey"; fontStyle = "italic"; fontWeight = "normal"; fontSize = "smaller"; break;
        default: backgroundColor = "white"; textColor = "lightgrey"; fontStyle = "italic"; fontSize = "smaller";
    }

    return (
        <div style={{
            backgroundColor, color: textColor, fontStyle, fontWeight,
            fontSize, borderWidth, borderStyle, borderColor
        }}>
            {eventInfo.event.title}
        </div>
    );
};




export {
    App,
    handleDeleteEvent,
    handleEventFormPost,
    handleEventFormPut,
    handleFilterChange,
    handleOrganizerChange,
    handleOrganizersButtonClick,
    handlePrevButtonClick,
    handleNextButtonClick,
    handleTodayButtonClick,
    handleViewChange,
    renderEventContent
};
