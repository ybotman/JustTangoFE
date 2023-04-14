import { useCallback } from 'react';

export const useHandlers = (userRole, isEditMode, setSelectedEvent, setShowEventFormModal, setClickedDate) => {

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

    return { handleEventClick, handleDateClick };


};

