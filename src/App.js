import React, { useState, useEffect, useRef, useCallback } from 'react';

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
//import { useHandlers } from "./components/HandlerProvider";
import { useFetchDataDimensional } from './hooks/useFetchDataDimensional';
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
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: true, Workshop: true, Festival: true, Class: true, Trip: true });
  const calendarRef = useRef(null);
  const [userRole, setUserRole] = useState("User");
  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);
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
  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const toggleLoginModal = () => {
    setShowLoginModal((prevShowLoginModal) => !prevShowLoginModal);
    console.log('toggleLoginModal:', !showLoginModal);
  };

  const toggleAdvancedFilterModal = () => {
    setShowAdvancedFilterModal((prevShowAdvancedFilterModal) => !prevShowAdvancedFilterModal);
    console.log('toggledAdvancedFilterModal:', !showAdvancedFilterModal);
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
    const [organizerId, setOrganizerId] = useState(null);

    const { events, setEvents } = useFetchDataEvents(userRole, organizerId);

    const handleEventClick = useCallback((event) => {
      setSelectedEvent(event);
      setShowEventFormModal(true);
    }, [setSelectedEvent, setShowEventFormModal]);

    const handleDateClick = useCallback((date) => {
      setClickedDate(date);
      setShowEventFormModal(true);
    }, [setClickedDate, setShowEventFormModal]);

    const handleRoleChange = useCallback((newRole) => {
      setUserRole(newRole);
      if (newRole === 'Organizer') {
        setOrganizerId('6442ccb5f88a6c48aa30be35'); // Set your organizer ID here
      } else {
        setOrganizerId(null);
      }
    }, [setUserRole, setOrganizerId]);

    const handleViewChange = useCallback((view) => {
      calendarRef.current?.getApi().changeView(view);
    }, [calendarRef]);

    const handlePrevButtonClick = useCallback(() => {
      calendarRef.current?.getApi().prev();
    }, [calendarRef]);

    const handleTodayButtonClick = useCallback(() => {
      calendarRef.current?.getApi().today();
    }, [calendarRef]);

    const handleNextButtonClick = useCallback(() => {
      calendarRef.current?.getApi().next();
    }, [calendarRef]);

    return {
      events,
      handleEventClick,
      handleDateClick,
      handleRoleChange,
      handleViewChange,
      handlePrevButtonClick,
      handleTodayButtonClick,
      handleNextButtonClick,
      setEvents
    };
  };

  const {
    handleEventClick,
    handleDateClick,
    handleRoleChange,
    handleViewChange,
    handlePrevButtonClick,
    handleTodayButtonClick,
    handleNextButtonClick,
    //    events
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
      console.log('transforming : ', event.startDate, event.title);

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
          active: event.active,
          featured: event.featured,
          cost: event.cost,
        },
      };
    });
  };

  const renderEventContent = (eventInfo) => {
    const category = eventInfo.event.extendedProps.categoryFirst;
    console.log('Render Event:', eventInfo.event.title, ":", eventInfo.event.extendedProps.categoryFirst, eventInfo.event.extendedProps.categorySecond)

    let textColor, fontStyle, fontSize, fontWeight, borderWidth, borderStyle, borderColor;

    const backgroundColor = categoryBackgroundColors[category];

    switch (category) {
      case "Milonga": textColor = "white"; fontWeight = "normal"; fontSize = "large"; break;
      case "Practica": textColor = "black"; fontWeight = "normal"; fontSize = "Medium"; break;
      case "Workshop": textColor = "black"; fontWeight = "Bold"; fontSize = "larger"; break;
      case "Festival": textColor = "black"; fontWeight = "normal"; fontSize = "large"; borderColor = 'Yellow'; break;
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
      </div>
    );
  };

  // useEffects
  useEffect(() => {
    if (calendarRef.current) {
      setTimeout(() => {
        calendarRef.current.getApi().render();
      }, 0);
    }
  }, [activeFilters]);
  useEffect(() => {
    const transformed = transformedEvents(events); // Transform first
    const filtered = transformed.filter(event => {
      return (
        activeFilters[event.extendedProps.categoryFirst] ||
        activeFilters[event.extendedProps.categorySecond] ||
        activeFilters[event.extendedProps.categoryThird]
      );
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

  //console.log("unfiltered Events:", events);
  console.log("Filtered Events:", filteredEvents);
  //console.log("transformed Events", transformedEvents(events));
  //console.log("transformed Filter Events", transformedEvents(filteredEvents));

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
          <AdvancedFilterModal
            open={showAdvancedFilterModal}
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
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={{
              left: 'prev,next today',
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
            //events={transformedEvents(events)}
            //events={transformedEvents(filteredEvents)}
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
