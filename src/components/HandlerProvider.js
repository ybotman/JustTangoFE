import { useCallback } from 'react';

export const useHandlers = (userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate, setUserRole, calendarRef, setActiveFilters) => {
    const handleEventClick = useCallback((info) => {
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
    }, [userRole, isEditMode, setSelectedEvent, setShowEventFormModal]);


    const handleDateClick = useCallback((info) => {
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
    }, [userRole, isEditMode, setClickedDate, setSelectedEvent, setShowEventFormModal]);



    const handleRoleChange = useCallback((role) => {
        setUserRole(role);
    }, [setUserRole]);



    const handleViewChange = useCallback((viewType) => {
        calendarRef.current.getApi().changeView(viewType);
        console.log('viewChanged:', viewType);
    }, [calendarRef]);



    const handleFilterChange = useCallback((category) => {
        setActiveFilters((prevFilters) => ({
            ...prevFilters,
            [category]: !prevFilters[category],
        }));
        console.log('handleFilterChange:', category);
    }, [setActiveFilters]);



    const handlePrevButtonClick = useCallback(() => {
        calendarRef.current.getApi().prev();
    }, [calendarRef]);



    const handleTodayButtonClick = useCallback(() => {
        calendarRef.current.getApi().today();
    }, [calendarRef]);



    const handleNextButtonClick = useCallback(() => {
        calendarRef.current.getApi().next();
    }, [calendarRef]);



    return {
        handleEventClick,
        handleDateClick,
        handleRoleChange,
        handleViewChange,
        handleFilterChange,
        handlePrevButtonClick,
        handleTodayButtonClick,
        handleNextButtonClick
    };
};