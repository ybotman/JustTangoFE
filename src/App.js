import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import LoginModal from './LoginModal';
import EventFormModal from "./EventFormModal";
import './App.css';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data));

    fetchCategories();
  }, []);

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const handleDateClick = (info) => {
    setSelectedEvent(null);
    setShowEventFormModal(true);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
  };

  const renderEventContent = (eventInfo) => {
    const category = eventInfo.event.extendedProps.primary_category;

    let backgroundColor;
    let textColor;
    let fontStyle;
    let fontWeight;
    let fontSize;

    switch (category) {
      case "Milonga":
        backgroundColor = "royalblue";
        textColor = "white";
        fontWeight = "bold";
        break;
      case "Practica":
        backgroundColor = "cyan";
        textColor = "black";
        fontWeight = "bold";
        break;
      case "Class":
        backgroundColor = "white";
        textColor = "black";
        fontWeight = "normal";
        fontSize = "smaller";
        break;
      case "Beginner":
        backgroundColor = "white";
        textColor = "grey";
        fontStyle = "italic";
        fontWeight = "normal";
        fontSize = "smaller";
        break;
      default:
        backgroundColor = "white";
        textColor = "black";
    }

    return (
      <div style={{ backgroundColor, color: textColor, fontStyle, fontWeight, fontSize }}>
        {eventInfo.event.title}
      </div>
    );
  };


  const defaultValues = {
    secondary_category: "",
    tri_category: "",
    organizer: "",
    location: "",
    recurrence_rule: "",
    owner_organizerId: "",
  };

  const handleEventFormPost = async (eventData) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...eventData, ...defaultValues, primary_category: eventData.category }),
    });

    const createdEvent = await response.json();
    setEvents([...events, createdEvent]);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventFormModal(true);
  };

  const handleEventFormPut = async (updatedEvent) => {
    const response = await fetch(`/api/events/${updatedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...updatedEvent, primary_category: updatedEvent.category }),
    });

    const updatedEventData = await response.json();
    setEvents(
      events.map((event) => (event.id === updatedEventData.id ? updatedEventData : event))
    );
  };

  const handleOrganizersButtonClick = () => {
    toggleLoginModal();
  };

  const handleDeleteEvent = async (eventId) => {
    await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <div className="App">
      <EventFormModal
        show={showEventFormModal}
        onHide={() => setShowEventFormModal(false)}
        onPost={handleEventFormPost}
        onPut={handleEventFormPut}
        onDelete={handleDeleteEvent}
        selectedEvent={selectedEvent}
        categories={categories}
      />

      <LoginModal show={showLoginModal} onClose={toggleLoginModal} />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        headerToolbar={{
          left: 'prev,next today organizersButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        customButtons={{
          organizersButton: {
            text: 'Organizers',
            click: handleOrganizersButtonClick,
          },
        }}
        eventContent={renderEventContent}
      />
    </div>

  );
}

export default App;
