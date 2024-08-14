import React, { useState, useEffect, useRef, useCallback } from 'react';

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

// Component imports
import CategoryFilter from './components/CategoryFilter';
import CalendarViewSwitch from './components/CalendarViewSwitch';
import UserStateRole from './components/UserStateRole';

import { useFetchDataDimensional } from './hooks/useFetchDataDimensional';
import { useFetchDataEvents } from './hooks/useFetchDataEvents';
import { useEventAPIHandlers } from './hooks/useEventAPIHandlers';

// Modal imports
import LoginModal from './modals/LoginModal';
import EventFormModal from './modals/EventFormModal';
import OrganizerFilterModal from './modals/OrganizerFilterModal';
import EventDetailsModal from './modals/EventDetails';
//import BuyMeACoffeeButton from './components/BuyMeACoffee';

// MUI
import { Box, IconButton } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './customStyles.css';
import './calendarStyles.css';
import './App.css';


function App() {
  console.log("            --> function App() {...");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [showOrganizerFilterModal, setShowOrganizerFilterModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);


  const [userRole, setUserRole] = useState("GenericUser");
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState('');
  const [activeFilters, setActiveFilters] = useState({ Milonga: true, Practica: true, Workshop: true, Festival: true, Class: false, Trip: false });
  const calendarRef = useRef(null);
  const { categories, organizers } = useFetchDataDimensional();
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState('');
  const { events, setEvents } = useFetchDataEvents(userRole, region);
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

  // Theme and Render functions

  const toggleLoginModal = () => {
    setShowLoginModal((prevShowLoginModal) => !prevShowLoginModal);
    console.log('toggleLoginModal:', !showLoginModal);
  };

  const toggleOrganizerFilterModal = () => {
    setShowOrganizerFilterModal((prevShowOrganizerFilterModal) => !prevShowOrganizerFilterModal);
    console.log('toggledOrganizerFilterModal:', !showOrganizerFilterModal);
  };

  const {
    handleEventFormPut, handleEventFormPost, handleDeleteEvent, clickedDate, setClickedDate,
  } = useEventAPIHandlers(events, setEvents);


  const handleFilterChange = (categories) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [categories]: !prevFilters[categories]
    }));

  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('/api/regions');
        const data = await response.json();
        setRegions(data); // Assuming data is an array of regions
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchRegions();
  }, []); // Empty dependency array to run only once

  const useHandlers = (userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate, setUserRole, calendarRef, setActiveFilters, setShowEventDetailsModal) => {

    const handleEventClick = useCallback((event) => {
      setSelectedEvent(event);
      setShowEventDetailsModal(true); // Show the event details modal
    }, [setSelectedEvent, setShowEventDetailsModal]);

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
  } = useHandlers(userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate, setUserRole, calendarRef, setActiveFilters, setShowEventDetailsModal);

  const handleOrganizerFilterApply = (filters) => {
    console.log(' handleOrganizerFilterApply ', filters);
  };


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
    if (!Array.isArray(events)) {
      console.warn("The events parameter is not an array or is undefined:", events);
      return []; // Return an empty array if events is undefined or not an array
    }

    return events.map((event) => {
      if (event.recurrenceRule === "") {
        console.warn("Invalid empty string in event recurrenceRule:", event);
      }

      console.log('Transform Event:', event.title); // Log the event title for better context

      return {
        id: event._id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        rrule: event.recurrenceRule || null, // Ensure rrule is set to null if it's undefined
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
          region: event.region,
        },
      };
    });
  };
  const renderEventContent = (eventInfo) => {
    const category1 = eventInfo.event.extendedProps.categoryFirst;
    const description = eventInfo.event.extendedProps.eventDescription || '';
    const shortDescription = description.length > 20 ? description.slice(0, 20) + '...' : description;

    console.log('const renderEventContent')
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
          <img src="/TangoTiempo4.jpg" className="App-banner" alt="Tango Tiempo Banner" />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <h1>Welcome to Tango Tiempo for {region}</h1>
            <FormControl variant="outlined" style={{ minWidth: 120, marginLeft: '20px' }}>
              <InputLabel id="region-select-label">Select Region</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={regions.length ? region : ''}  // Use an empty string if regions aren't loaded yet
                onChange={(e) => setRegion(e.target.value)}
                label="Select Region"
              >
                {Array.isArray(regions) && regions.map((regionOption) => (
                  <MenuItem key={regionOption.regionCode} value={regionOption.regionCode}>
                    {regionOption.regionName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </Box>
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
          <EventDetailsModal
            open={showEventDetailsModal}
            onClose={() => setShowEventDetailsModal(false)}
            event={selectedEvent} // Pass the selected event data
          />
        </div>
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <Box display="flex" alignItems="right">
              <UserStateRole />
            </Box>
            <IconButton sx={{ color: 'lightgrey' }}>
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
