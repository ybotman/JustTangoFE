import React, { useState, useEffect, useRef, useCallback } from 'react';

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

// Component imports
//import CalendarDateNavigation from './components/CalendarDateNavigation';
import CategoryFilter from './components/CategoryFilter';
import CalendarViewSwitch from './components/CalendarViewSwitch';
//import { useHandlers } from "./components/HandlerProvider";
import { useFetchDataDimensional } from './hooks/useFetchDataDimensional';
import { useFetchDataEvents } from './hooks/useFetchDataEvents';
import { useEventAPIHandlers } from './hooks/useEventAPIHandlers';

// Modal imports
import LoginModal from './modals/LoginModal';
import EventFormModal from './modals/EventFormModal';
import OrganizerFilterModal from './modals/OrganizerFilterModal';

// MUI Imports
//import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
//import PersonIcon from '@mui/icons-material/Person';
//import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
//import EditCalendarIcon from '@mui/icons-material/EditCalendar';
//import CalendarIcon from '@mui/icons-material/CalendarToday';
import { Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './customStyles.css';
import './calendarStyles.css';
import './App.css';

function App() {

  console.log("            --> function App() {...");
  // State Declarations useState
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: true, Workshop: true, Festival: true, Class: true, Trip: true });
  const calendarRef = useRef(null);
  const [userRole, setUserRole] = useState("GenericUser");
  const [showOrganizerFilterModal, setShowOrganizerFilterModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { categories, organizers } = useFetchDataDimensional();
  const { events, setEvents } = useFetchDataEvents(userRole);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const categoryBackgroundColors = {
    Milonga: "dodgerblue",
    Practica: "PowderBlue",
    Workshop: "green",
    Festival: "plum",
    Class: "lightGreen",
    Trip: "wheat",

  };

  // const toggleEditMode = () => {
  //   setIsEditMode((prevEditMode) => !prevEditMode);
  // };

  const toggleLoginModal = () => {
    setShowLoginModal((prevShowLoginModal) => !prevShowLoginModal);
    console.log('toggleLoginModal:', !showLoginModal);
  };

  const toggleOrganizerFilterModal = () => {
    setShowOrganizerFilterModal((prevShowOrganizerFilterModal) => !prevShowOrganizerFilterModal);
    console.log('toggledOrganizerFilterModal:', !showOrganizerFilterModal);
  };

  // handle Functions
  const {
    handleEventFormPut,
    handleEventFormPost,
    handleDeleteEvent,
    clickedDate,
    setClickedDate,
  } = useEventAPIHandlers(events, setEvents);

  const handleFilterChange = (categories) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [categories]: !prevFilters[categories]
    }));

  };


  const useHandlers = (userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate, setUserRole, calendarRef, setActiveFilters) => {

    const handleEventClick = useCallback((event) => {
      setSelectedEvent(event);
      setShowEventFormModal(true);
    }, [setSelectedEvent, setShowEventFormModal]);

    const handleDateClick = useCallback((date) => {
      setClickedDate(date);
      setShowEventFormModal(true);
    }, [setClickedDate, setShowEventFormModal]);

    const handleViewChange = useCallback((view) => {
      calendarRef.current?.getApi().changeView(view);
    }, [calendarRef]);

    return {
      events,
      handleEventClick,
      handleDateClick,
      handleViewChange,
      setEvents
    };
  };

  const {
    handleEventClick,
    handleDateClick,
    handleViewChange,
  } = useHandlers(userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate, setUserRole, calendarRef, setActiveFilters);

  const handleOrganizerFilterApply = (filters) => {
    console.log(' handleOrganizerFilterApply ', filters);
  };

  // Theme and Render functions
  const customTheme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: { width: '40px', height: '24px', padding: '4px' },
          switchBase: { padding: '4px' },
          thumb: { width: '16px', height: '16px' },
          track: { borderRadius: '20px', opacity: 1 },
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

  const transformedEvents = (events) => {
    return events.map((event) => {
      if (event.recurrenceRule === "") {
        console.warn("Invalid empty string in event recurrenceRule:", event);
      }
      console.log('Transform Event:')
      //const rrule = event.recurrenceRule ? event.recurrenceRule : null;
      return {
        id: event._id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        rrule: event.recurrenceRule,
        extendedProps: {
          categoryFirst: event.categoryFirst,
          categorySecond: event.categorySecond,
          categoryThird: event.categoryThird,
          eventOrganizerID: event.eventOrganizerID,
          locationID: event.locationID,
          ownerOrganizerID: event.ownerOrganizerID,
          standardsTitle: event.standardsTitle,
          eventDescription: event.eventDescription,
          recurrenceRule: event.rrule,
          active: event.active,
          featured: event.featured,
          cost: event.cost,
        },
      };
    });
  };

  const renderEventContent = (eventInfo) => {
    const category1 = eventInfo.event.extendedProps.categoryFirst;
    const description = eventInfo.event.extendedProps.eventDescription || '';
    const shortDescription = description.length > 20 ? description.slice(0, 20) + '...' : description;

    console.log('const renderEventContent :')//, eventInfo.event.title, ":", eventInfo.event.extendedProps.categoryFirst, eventInfo.event.extendedProps.categorySecond)

    let textColor, fontStyle, fontSize, fontWeight, borderWidth, borderStyle, borderColor;

    const backgroundColor = categoryBackgroundColors[category1];

    switch (category1) {
      case "Milonga": textColor = "white"; fontWeight = "normal"; fontSize = "large"; break;
      case "Practica": textColor = "black"; fontWeight = "normal"; fontSize = "Medium"; break;
      case "Workshop": textColor = "black"; fontWeight = "Bold"; fontSize = "larger"; break;
      case "Festival": textColor = "black"; fontWeight = "normal"; fontSize = "large"; borderColor = 'Red'; break;
      case "Class": textColor = "black"; fontWeight = "normal"; fontSize = "Small"; break;
      case "Trip": textColor = "grey"; fontStyle = "italic"; fontWeight = "Small"; fontSize = "smaller"; break;
      default: textColor = "lightgrey"; fontStyle = "italic"; fontSize = "large";
    }

    return (
      <div style={{
        backgroundColor, color: textColor, fontStyle, fontWeight,
        fontSize, borderWidth, borderStyle, borderColor
      }}>
        {eventInfo.event.title}
        <div
          style={{
            fontSize: '0.75em', // Smaller font size
            color: 'gray', // Gray text color
            backgroundColor: 'transparent', // No background
            marginTop: '4px', // Small space between title and description
          }}
        >
          {shortDescription}
        </div>
      </div>
    );
  };
  // UseEffects
  useEffect(() => {
    console.log("1. useEffect Rendering the Calendar after Filter Changes:");
    if (calendarRef.current) {
      setTimeout(() => {
        calendarRef.current.getApi().refetchEvents(); // More efficient than render
      }, 0);
    }
  }, [activeFilters]);


  useEffect(() => {
    console.log("2. useEffect Transforming and Filtering Events:");

    // Transform the raw events into the FullCalendar-compatible structure
    const transformed = transformedEvents(events); // Transform first
    console.log(" ... useEffect  const transformed = ");

    // Filter the transformed events based on the active filters
    const filtered = transformed.filter(event => {

      console.log(" ... useEffect  const filtered = transformed.filter:");
      const match = (
        activeFilters[event.extendedProps.categoryFirst] ||
        activeFilters[event.extendedProps.categorySecond] ||
        activeFilters[event.extendedProps.categoryThird]
      );
      // console.log("Event:", event.title, "Match:", match);
      return match;
    });


    // Update the filteredEvents state with the result
    setFilteredEvents(filtered);
  }, [activeFilters, events]);



  useEffect(() => {
    console.log("3. Adjusting Edit Mode Based on User Role:");
    if (userRole === "User") {
      setIsEditMode(false);  // Force back to non-edit mode
    }
  }, [userRole]);


  //******************************* R E T U R N ******************/
  return (
    <ThemeProvider theme={customTheme}>
      <div className="App">
        <header className="App-header">
          <img src="/TangoTiempo3.jpg" className="App-banner" alt="Tango Tiempo Banner" />
          <h1>Welcome to Tango Tiempo</h1>
        </header>
        <div className="app-content">
          <EventFormModal
            open={showEventFormModal}
            onHide={() => setShowEventFormModal(false)}
            onPost={handleEventFormPost}
            onPut={handleEventFormPut}
            onDelete={handleDeleteEvent}
            selectedEvent={selectedEvent}
            categories={categories}
            clickedDate={clickedDate}
          />
          <LoginModal
            show={showLoginModal}
            onClose={toggleLoginModal}
          />
          <OrganizerFilterModal
            open={showOrganizerFilterModal}
            onHide={toggleOrganizerFilterModal}
            onApply={handleOrganizerFilterApply}
            organizers={organizers}
          />
        </div>
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', backgroundColor: '#f9f9f9' }}>
              Active and Select Region
            </div>
          </Box>
          <Box display="flex" alignItems="center">
            <CategoryFilter
              categories={categories}
              activeFilters={activeFilters}
              handleFilterChange={handleFilterChange}
              categoryColors={categoryBackgroundColors}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <CalendarViewSwitch view={calendarRef.current?.getApi().view.type} onChange={handleViewChange} />
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton onClick={toggleOrganizerFilterModal} sx={{ color: 'lightcoral' }}>
              <FilterAltIcon />
            </IconButton>
            <IconButton sx={{ color: 'lightcoral' }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </div>
        {/* ***CALENDAR*** */}
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={{
              left: 'prev,today,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            }}
            initialView="dayGridMonth"
            editable={isEditMode}
            selectable={isEditMode}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={filteredEvents}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            dateClick={handleDateClick}
            ref={calendarRef}
          />
        </div>
      </div>
    </ThemeProvider>
  );
  //end of return

}

export default App;
