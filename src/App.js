import React, { useState, useEffect, useRef } from 'react';

//FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

//component imports
import CalendarDateNavigation from './components/CalendarDateNavigation';
import CategoryFilter from './components/CategoryFilter';
import OrganizerFilter from './components/OrganizerFilter';
import CalendarViewSwitch from './components/CalendarViewSwitch';

//import from ./src ;
import LoginModal from './LoginModal';
import EventFormModal from './EventFormModal';

//Material User Interfae (MUI) Imports
import { Box, IconButton, } from '@mui/material';
import EditCalendar from '@mui/icons-material/EditCalendar';
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './customStyles.css';
import './calendarStyles.css';
import './App.css';

/**********************  The APP  *******************/


function App() {

  /**********************  Defaulting  *******************/
  const defaultValues = {
    description: "N/A",
    secondary_category: "N/A",
    tri_category: "N/A",
    organizer: "N/A",
    location: "Near Boston",
    recurrence_rule: "",
    owner_organizerId: "4",
  };

  /**********************  State Declarations useState *******************/
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [clickedDate, setClickedDate] = useState('');
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: false, Workshop: false, Festival: false, Class: false, Beginner: false });
  const calendarRef = useRef(null);
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);


  //working fucntion that we have to bring in

  const filterEventsByCategory = (category) => {
    if (category === "All") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.primary_category === category);
      setFilteredEvents(filtered);
    }
  };


  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
  };


  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };


  /**********************  handle Functions  **********************/

  const handleViewChange = (viewType) => {
    calendarRef.current.getApi().changeView(viewType);
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

  const handlePrevButtonClick = () => {
    calendarRef.current.getApi().prev();
  };

  const handleTodayButtonClick = () => {
    calendarRef.current.getApi().today();
  };

  const handleNextButtonClick = () => {
    calendarRef.current.getApi().next();
  };


  /********************** handle funtions with PUT / POST / DELETE   ******/
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


  const handleDeleteEvent = async (eventId) => {
    await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    setEvents(events.filter((event) => event.id !== eventId));
  };

  /********************** Theme and Render functions  ***************/
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
      case "Milonga": backgroundColor = "lightBlue"; textColor = "black"; fontWeight = "bold"; fontSize = "smaller"; break;
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

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventFormModal(true);
  };

  const handleOrganizersButtonClick = () => {
    toggleLoginModal();
  };



  //******************************* useEffects ****************** /
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().render();
    }
  }, [activeFilters]
  );

  useEffect(() => {
    fetch('/api/organizers')
      .then((response) => response.json())
      .then((data) => setOrganizers(data));
    // ...
  }, []);


  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data));

    if (fetchCategories) {
      fetchCategories();
    }
  }, []);

  //  useEffect(() => {
  //    console.log("Active Filters:", activeFilters);
  //  }, [activeFilters]);


  useEffect(() => {
    const isAnyFilterActive = Object.values(activeFilters).some((value) => value);

    const filtered = events.filter((event) => {
      if (isAnyFilterActive) {
        return activeFilters[event.primary_category];
      } else {
        // Force some filters on when all filters are off
        return event.primary_category === "Milonga" || event.primary_category === "Practica";
      }
    });

    setFilteredEvents(filtered);
    //  logFilteredEventIDs();
  }, [activeFilters, events]);

  // In App.js, just before the `return` statement
  //  const logFilteredEventIDs = () => {
  //    const filtered = events.filter((event) => activeFilters[event.primary_category]);
  //    console.log('Filtered event IDs:', filtered.map((event) => event.id));
  //  };


  //  logFilteredEventIDs();


  //******************************* R E T U R N ******************/
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box>
              <CalendarDateNavigation
                handlePrevButtonClick={handlePrevButtonClick}
                handleTodayButtonClick={handleTodayButtonClick}
                handleNextButtonClick={handleNextButtonClick}
              />
            </Box>

            <Box>
              <CategoryFilter
                categories={categories}
                activeFilters={activeFilters}
                handleFilterChange={handleFilterChange}
                onCategoryChange={filterEventsByCategory}
              />
            </Box>

            <Box>
              <OrganizerFilter
                organizers={organizers}
                onOrganizerChange={handleOrganizerChange}
              />
            </Box>

            <Box>
              <IconButton onClick={handleOrganizersButtonClick} aria-label="Edit" sx={{ color: 'lightcoral' }}>
                <SettingsIcon />
              </IconButton>
              <IconButton onClick={handleOrganizersButtonClick} aria-label="Edit" sx={{ color: 'lightcoral' }}>
                <EditCalendar />
              </IconButton>
            </Box>
            <Box>
              <CalendarViewSwitch view={calendarRef.current?.getApi().view.type} onChange={handleViewChange} />

            </Box>
          </Box>

          <FullCalendar
            headerToolbar={{ left: '', center: '', right: '', }}
            nextDayThreshold='05:59:00'
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={filteredEvents}
            eventContent={({ event, el }) => {
              return renderEventContent({ event });
            }}
          />
        </div>
      </div>
    </ThemeProvider >
  );

}

export default App;
