
import React, { useState, useEffect, useRef } from 'react';

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

// Component imports
import CalendarDateNavigation from './components/CalendarDateNavigation';
import CategoryFilter from './components/CategoryFilter';
import CalendarViewSwitch from './components/CalendarViewSwitch';
import { useHandlers } from "./components/HandlerProvider";
import { useFetchData } from './hooks/useFetchData';
import { useFetchDataEvents } from './hooks/useFetchDataEvents';
import { useEventAPIHandlers } from './hooks/useEventAPIHandlers';

// Modal imports
import LoginModal from './modals/LoginModal';
import EventFormModal from './modals/EventFormModal';
import AdvancedFilterModal from './modals/AdvancedFilterModal';

// MUI Imports
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, IconButton } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './customStyles.css';
import './calendarStyles.css';
import './App.css';

function App() {
  // State Declarations useState
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: true, Workshop: true, Festival: true, Class: true, Beginner: true });
  const calendarRef = useRef(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [userRole, setUserRole] = useState("User");
  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { categories, organizers } = useFetchData();
  const { events, setEvents } = useFetchDataEvents(userRole);

  const categoryBackgroundColors = {
    Milonga: "dodgerblue",
    Practica: "PowderBlue",
    Workshop: "limegreen",
    Festival: "plum",
    Class: "lavender",
    Beginner: "wheat",
  };

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    console.log('toggleLoginModal:', showLoginModal);
  };

  const toggleAdvancedFilterModal = () => {
    setShowAdvancedFilterModal(!showAdvancedFilterModal);
    console.log('toggleAdvancedFilterModal:', !showAdvancedFilterModal);
  };

  // handle Functions
  const {
    handleEventFormPut,
    handleEventFormPost,
    handleDeleteEvent,
    clickedDate,
    setClickedDate,
  } = useEventAPIHandlers(events, setEvents);

  const handleFilterChange = (category) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [category]: !prevFilters[category]
    }));
  };

  const {
    handleEventClick,
    handleDateClick,
    handleRoleChange,
    handleViewChange,
    handlePrevButtonClick,
    handleTodayButtonClick,
    handleNextButtonClick
  } = useHandlers(userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate, setUserRole, calendarRef, setActiveFilters);

  const handleAdvancedFilterApply = (filters) => {
    console.log('Advanced filter applied:', filters);
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
      if (event.recurrence_rule && event.recurrence_rule.trim() === "") {
        console.log("Invalid empty string in event:", event);
      }

      return {
        id: event._id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        rrule: event.recurrenceRule,
        extendedProps: {
          primary_category: event.categoryFirst,
          secondary_category: event.categorySecond,
          tri_category: event.categoryThird,
          organizer: event.eventOrganizerID,
          location: event.locationID,
          owner_organizerId: event.ownerOrganizerID,
          standard_name: event.standardsTitle,
        },
      };
    });
  };

  const renderEventContent = (eventInfo) => {
    const category = eventInfo.event.extendedProps.primary_category;

    let textColor, fontStyle, fontSize, fontWeight, borderWidth, borderStyle, borderColor;

    const backgroundColor = categoryBackgroundColors[category];

    switch (category) {
      case "Milonga": textColor = "white"; fontWeight = "normal"; fontSize = "smaller"; break;
      case "Practica": textColor = "black"; fontWeight = "normal"; fontSize = "smaller"; break;
      case "Workshop": textColor = "black"; fontWeight = "normal"; fontSize = "smaller"; break;
      case "Festival": textColor = "black"; fontWeight = "normal"; fontSize = "smaller"; borderColor = 'Yellow'; break;
      case "Class": textColor = "black"; fontWeight = "normal"; fontSize = "smaller"; break;
      case "Beginner": textColor = "grey"; fontStyle = "italic"; fontWeight = "normal"; fontSize = "smaller"; break;
      default: textColor = "lightgrey"; fontStyle = "italic"; fontSize = "smaller";
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

  // useEffects
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().render();
    }
  }, [activeFilters]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      return activeFilters[event.primary_category];
    });

    setFilteredEvents(filtered);
  }, [activeFilters, events]);

  useEffect(() => {
    if (userRole === "User") {
      setIsEditMode(false);  // force back to non-edit
    }
  }, [userRole]);

  useEffect(() => {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar(calendarEl, {
      plugins: [rrulePlugin, dayGridPlugin],
      events,
    });

    calendar.render();
  }, [events]);


  //******************************* R E T U R N ******************/
  return (
    <ThemeProvider theme={customTheme}>
      <div className="App">
        <header className="App-header">
          <img src="/JustTango2.jpg" className="App-banner" alt="Just Tango Banner" />
          <h1>Welcome to TC</h1>
        </header>
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
          <LoginModal
            show={showLoginModal}
            onClose={toggleLoginModal}
          />
          <AdvancedFilterModal
            show={showAdvancedFilterModal}
            onHide={toggleAdvancedFilterModal}
            onApply={handleAdvancedFilterApply}
            organizers={organizers}
          />
        </div>
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <CalendarDateNavigation
              onPrevClick={handlePrevButtonClick}
              onTodayClick={handleTodayButtonClick}
              onNextClick={handleNextButtonClick}
            />
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
            {userRole === "User" && (
              <Box>
                <IconButton
                  onClick={() => handleRoleChange("Organizer")} sx={{ color: 'lightGreen' }}>
                  <PersonIcon />
                </IconButton>
                <IconButton onClick={toggleAdvancedFilterModal} sx={{ color: 'lightcoral' }}>
                  <FilterAltIcon />
                </IconButton>
                <IconButton sx={{ color: 'lightcoral' }}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            )}
            {userRole === "Organizer" && (
              <Box>
                <IconButton onClick={() => handleRoleChange("Admin")} sx={{ color: 'purple' }}>
                  <SupervisedUserCircleIcon />
                </IconButton>
                {isEditMode ? (
                  <EditCalendarIcon onClick={toggleEditMode} sx={{ color: 'lightcoral' }} />
                ) : (
                  <CalendarIcon onClick={toggleEditMode} sx={{ color: 'lightgreen' }} />
                )}
              </Box>
            )}
            {userRole === "Admin" && (
              <Box>
                <IconButton onClick={() => handleRoleChange("User")} sx={{ color: 'Red' }}>
                  <AdminPanelSettingsIcon />
                </IconButton>
                {isEditMode ? (
                  <EditCalendarIcon onClick={toggleEditMode} sx={{ color: 'lightcoral' }} />
                ) : (
                  <CalendarIcon onClick={toggleEditMode} sx={{ color: 'lightgreen' }} />
                )}
              </Box>
            )}
          </Box>
        </div>
        {/* ***CALENDAR*** */}
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin]} // Include listPlugin here
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' // Ensure listMonth is included here
            }}
            initialView="dayGridMonth"
            editable={isEditMode}
            selectable={isEditMode}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={transformedEvents(events)}
            eventClick={handleEventClick}
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
