import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import LoginModal from './LoginModal';
import EventFormModal from "./EventFormModal";
import CategoryFilterSwitches from './CategoryFilterSwitches';
import { Switch, FormControlLabel, Box } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './customStyles.css';
import './calendarStyles.css';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [clickedDate, setClickedDate] = useState('');
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: true, Workshop: true, });
  const [isListView, setIsListView] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().render();
    }
  }, [activeFilters]);


  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data));

    fetchCategories();
  }, []);

  const handleViewSwitchChange = (event) => {
    setIsListView(event.target.checked);
    const newView = event.target.checked ? 'listWeek' : 'dayGridMonth';
    calendarRef.current.getApi().changeView(newView);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const handleDateClick = (info) => {
    console.log("Clicked on date:", info.dateStr);
    setSelectedEvent('');
    setClickedDate(info.date);
    setShowEventFormModal(true);
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

  useEffect(() => {
    console.log("Active Filters:", activeFilters);
  }, [activeFilters]);


  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
  };

  const customTheme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: { width: '40px', height: '24px', padding: '4px', },
          switchBase: { padding: '4px', },
          thumb: { width: '16px', height: '16px', },
          track: { borderRadius: '20px', opacity: 1, },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            fontSize: '0.8rem',
          },
        },
      },
    },
  });

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

  const defaultValues = {
    secondary_category: "default",
    tri_category: "default",
    organizer: "TPB",
    location: "Near Boston",
    recurrence_rule: "",
    owner_organizerId: "4",
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventFormModal(true);
  };

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
    <ThemeProvider theme={customTheme}>
      <div className="App">
        <div className="app-content">
          <EventFormModal
            show={showEventFormModal}
            onHide={() => setShowEventFormModal(false)}
            onPost={handleEventFormPost}
            onPut={handleEventFormPut}
            onDelete={handleDeleteEvent}
            selectedEvent={selectedEvent}
            categories={categories}
            clickedDate={clickedDate}
          />
          <LoginModal show={showLoginModal} onClose={toggleLoginModal} />
          <CategoryFilterSwitches
            categories={categories}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon />
            <FormControlLabel
              control={
                <Switch
                  checked={isListView}
                  onChange={handleViewSwitchChange}
                  name="viewSwitch"
                  inputProps={{ 'aria-label': 'change view' }}
                />
              }
              label=""
              sx={{ margin: 0 }}
            />
            <ListIcon />
          </Box>
          <FullCalendar
            nextDayThreshold='05:59:00'
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            /*          events={events.filter((event) => {
                        if (event.extendedProps) {
                          const category = event.extendedProps.primary_category;
                          return activeFilters[category] === undefined || activeFilters[category] === true;
                        }
                        return true;
                      })}
          */

            //           events={filteredEvents}
            events={events}

            headerToolbar={{
              left: 'prev,next today organizersButton',
            }}
            customButtons={{
              organizersButton: {
                text: 'Organizers',
                click: handleOrganizersButtonClick,
              },
            }}
            eventContent={({ event, el }) => {
              return renderEventContent({ event });
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );

}

export default App;
