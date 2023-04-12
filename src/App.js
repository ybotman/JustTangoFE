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
//import OrganizerFilter from './components/OrganizerFilter';
import CalendarViewSwitch from './components/CalendarViewSwitch';

//import from ./modals ;
import LoginModal from './modals/LoginModal';
import EventFormModal from './modals/EventFormModal';
import AdvancedFilterModal from './modals/AdvancedFilterModal';

//Material User Interfae (MUI) Imports
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, IconButton, } from '@mui/material';
//import EditCalendar from '@mui/icons-material/EditCalendar';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CalendarIcon from '@mui/icons-material/CalendarToday';

import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: true, Workshop: false, Festival: false, Class: false, Beginner: false });
  const calendarRef = useRef(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [userRole, setUserRole] = useState("User");
  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const categoryBackgroundColors = {
    Milonga: "dodgerblue",
    Practica: "PowderBlue",
    Workshop: "limegreen",
    Festival: "plum",
    Class: "lavender",
    Beginner: "wheat",
  };


  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
    //('fetchCategories:', data);
  };

  const fetchOrganizers = async () => {
    try {
      const response = await fetch('/api/organizers');
      const data = await response.json();
      setOrganizers(data);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
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

  /**********************  handle Functions  **********************/
  const handleRoleChange = (role) => {
    setUserRole(role);
  };

  const handleViewChange = (viewType) => {
    calendarRef.current.getApi().changeView(viewType);
    console.log('viewChanged:', viewType);
  };



  const handleDateClick = (info) => {
    if (userRole === "Organizer" && (isEditMode)) {
      // Existing functionality for Organizer
      setShowEventFormModal(true);
      setClickedDate(info.date);
      setSelectedEvent(null);
    }
    if (userRole === "Admin") {
      // Existing functionality for Organizer
      setShowEventFormModal(true);
      setClickedDate(info.date);
      setSelectedEvent(null);
    }
    console.log(userRole, "Clicked on date:", info.dateStr);
  };


  const handleEventClick = (info) => {
    if (userRole === "Organizer") {
      // Existing functionality for Organizer
      setSelectedEvent(info.event);
      if (isEditMode) {
        setShowEventFormModal(true);
      }
    }

    if (userRole === "Admin") {
      setSelectedEvent(info.event);
      setShowEventFormModal(true);
    }

    if (userRole === "User") {
      setSelectedEvent(info.event);
    }
    console.log(userRole, "Clicked on Event:", info.event);
  };

  const handleAdvancedFilterApply = (filters) => {
    // You can implement your advanced filter logic here, using the filters object
    console.log('Advanced filter applied:', filters);
  };


  const handleFilterChange = (category) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [category]: !prevFilters[category],
    }));
    console.log('handleFilterChange:', category);
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

  //******************************* useEffects ****************** /
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().render();
    }
  }, [activeFilters]);

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

  useEffect(() => {
    fetchOrganizers();
  }, []);

  useEffect(() => {
    console.log("UE:Active Filters:", activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      return activeFilters[event.primary_category];
    });

    setFilteredEvents(filtered);
    //console.log('UE:setFiltered Events :', filtered);
    //console.log('UE:Active Filters :', activeFilters);
  }, [activeFilters, events]);

  useEffect(() => {
    console.log("UE:userRole:", userRole)
    if (userRole === "User") {
      setIsEditMode(false);  // force back to  non-edit
    }
    // Fetch events based on userRole
    if (userRole === "Organizer") {
      const organizerId = 1; // Replace this with the actual organizer ID
      fetch(`/api/organizers/${organizerId}/events`)
        .then((response) => response.json())
        .then((data) => setEvents(data));
      // Fetch only the events for this organizer
    } fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, [userRole]);

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

          {/* ***TOP MENU*** */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* ***NAVIGATION*** */}
            <Box>
              <CalendarDateNavigation
                handlePrevButtonClick={handlePrevButtonClick}
                handleTodayButtonClick={handleTodayButtonClick}
                handleNextButtonClick={handleNextButtonClick}
              />
            </Box>
            {/* ***CAT FILTER*** */}
            <Box>
              <CategoryFilter
                categories={categories}
                activeFilters={activeFilters}
                handleFilterChange={handleFilterChange}
                setActiveFilters={setActiveFilters}
                categoryColors={categoryBackgroundColors}
              />
            </Box>
            {/* ***ROLE ICON*** */}
            <Box>

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
            </Box>
            {/* ***Calendar View Change*** */}
            <Box>
              <CalendarViewSwitch view={calendarRef.current?.getApi().view.type} onChange={handleViewChange} />
            </Box>
          </Box>
          {/* ***CALENDAR*** */}
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
