# JustTangoV1

## Table of Contents
1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
   - [Development Mode](#development-mode)
   - [Production Mode](#production-mode)
5. [Core Features](#core-features)
6. [Function and Call Overview](#function-and-call-overview)
7. [Data Flow Diagram](#data-flow-diagram)

## Overview
JustTangoV1 is a Tango event calendar application built with React and MongoDB. It allows users to view and filter tango events based on categories and organizers, as well as manage events based on user roles (Admin, Organizer, User).

## Directory Structure
JustTangoV1/
│
├── BE/                        # Backend directory
│   ├── models/                # Mongoose models
│   │   ├── categories.js      # Category model
│   │   ├── events.js          # Event model
│   │   ├── organizers.js      # Organizer model
│   │   └── regions.js         # Region model
│   ├── server.js              # Express server setup
│   ├── insertEvents.js        # Script to insert events into MongoDB
│   └── updateMongo.js         # Script to update MongoDB collections
│
├── FE/                        # Frontend directory
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.js          # Handles filtering by categories
│   │   │   ├── CategoryFilterSwitches.js  # Toggle buttons for categories
│   │   │   ├── EventFormModal.js          # Modal for event creation/editing
│   │   │   └── OrganizerFilter.js         # Filter by organizer
│   │   ├── hooks/
│   │   │   ├── useFetchData.js            # Fetches categories, organizers, etc.
│   │   │   ├── useFetchDataDimensional.js # Specialized fetch data hook
│   │   │   └── useEventAPIHandlers.js     # API handlers for events
│   │   ├── App.js                         # Main application component
│   │   ├── HandlerProvider.js             # Provides handlers for different actions
│   │   └── index.js                       # Application entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── .env                            # Environment variables
├── package.json
└── README.md                       # Project documentation


Serve the production build using any static server (e.g., serve, nginx).

Core Features

	1.	Category-Based Filtering: Users can filter events by categories (Milonga, Practica, Workshop, etc.).
	2.	Organizer-Based Filtering: Users can filter events by organizers.
	3.	User Roles: Different UI and functionalities based on user roles (Admin, Organizer, User).
	4.	Event Management: Create, edit, and delete events using modals.
	5.	Calendar Navigation: Navigate between dates and view events in various formats (month, week, list).
	6.	Recurrence Rules: Manage recurring events with custom recurrence rules.

Function and Call Overview

App.js

	•	useEffect Hooks:
	•	Handles calendar rendering, event filtering, and user role adjustments.
	•	renderEventContent: Renders event details within the calendar.
	•	handleFilterChange: Manages category filter state.

CategoryFilterSwitches.js

	•	handleFilterChange: Toggles category filters and updates the activeFilters state in App.js.

CategoryFilter.js

	•	CategoryFilter: Wraps CategoryFilterSwitches and provides it with necessary props.

useFetchData.js

	•	Fetches initial data for categories, organizers, and events.

useEventAPIHandlers.js

	•	Provides functions for handling API calls related to event creation, editing, and deletion.

Data Flow Diagram

+---------------------+
|      App.js         |
| +-----------------+ |   +-----------------------+
| | useEffect Hooks | |   |  CategoryFilter.js     |
| |   (Filtering)   | +-->+-----------------------+
| +-----------------+ |   | +-------------------+ |
| +-----------------+ |   | | CategoryFilter-   | |
| | FullCalendar    | |   | | Switches.js       | |
| +-----------------+ |   | +-------------------+ |
+---------------------+   +-----------------------+

+-------------------------+
|  useFetchData.js         |
|   - Fetch categories     |
|   - Fetch organizers     |
|   - Fetch events         |
+-------------------------+

+-------------------------+
|  useEventAPIHandlers.js  |
|   - Event API calls      |
+-------------------------+

This diagram shows the flow of data from App.js through the category filtering components and API handlers. It illustrates how the application processes events and interacts with the calendar and filtering systems.

This README.md provides a comprehensive overview of your project, including how to run it, what files are involved, and how the key features and data flows are structured.



High-Level Flow Overview:

	1.	Index Initialization (index.js)
	•	Entry point that renders the App component.
	2.	App Initialization (App.js)
	•	Sets up the main structure, including the calendar, filters, and modals.
	•	Initializes state variables and hooks (useEffect) for managing data and UI updates.
	3.	Filter Interaction (Category and Organizer)
	•	CategoryFilterSwitches.js: Handles category filter toggles.
	•	OrganizerFilter.js: Manages organizer filter selection.
	•	HandlerProvider.js: Provides handlers for filter changes and passes them to App.js.

Detailed Flow:
index.js
└── App.js
    ├── Initialization
    │   ├── useState (events, activeFilters, etc.)
    │   ├── useEffect (Initial Data Fetch & Calendar Rendering)
    │   ├── useFetchDataDimensional (Fetches Categories and Organizers)
    │   └── useFetchDataEvents (Fetches Events)
    │
    ├── Render Components
    │   ├── CategoryFilter (Contains CategoryFilterSwitches)
    │   │   └── CategoryFilterSwitches.js
    │   │       ├── Receives activeFilters and categories as props
    │   │       ├── Renders category toggle buttons
    │   │       └── Updates activeFilters state on toggle
    │   │
    │   ├── OrganizerFilter.js
    │   │   ├── Receives organizers and activeFilters as props
    │   │   └── Updates activeFilters state based on selected organizer
    │   │
    │   ├── FullCalendar
    │   │   ├── Receives filteredEvents for rendering
    │   │   ├── CalendarDateNavigation.js (Handles date navigation)
    │   │   └── Rendered using the events from filteredEvents
    │   │
    │   ├── EventFormModal.js
    │   │   ├── Modal for creating/editing events
    │   │   └── Uses categories and organizer data for form inputs
    │   │
    │   ├── Handlers (Provided by HandlerProvider.js)
    │   │   ├── handleFilterChange (Updates filters based on user input)
    │   │   ├── handleEventClick (Handles event clicks for editing)
    │   │   └── handleViewChange (Switches between calendar views)
    │   │
    │   └── useEffect (Re-renders Calendar based on activeFilters)
    │       ├── Transforms event data for FullCalendar
    │       └── Applies category and organizer filters to events
    │
    └── Final Render
        ├── FullCalendar with filtered and transformed events
        ├── CategoryFilter with CategoryFilterSwitches
        ├── OrganizerFilter with active filters applied
        └── EventFormModal for event creation/editing


        Breakdown of Flow:

	1.	Initialization (App.js):
	•	App.js initializes state for events, activeFilters, filteredEvents, etc.
	•	Fetches data via useFetchDataDimensional (categories, organizers) and useFetchDataEvents (events).
	•	Initializes HandlerProvider.js to provide functions for filtering and interacting with events.
	2.	Rendering Filters:
	•	CategoryFilter and OrganizerFilter are rendered, displaying filter options to the user.
	•	CategoryFilterSwitches.js and OrganizerFilter.js manage their respective filters, updating activeFilters in App.js.
	3.	Applying Filters:
	•	When a filter is toggled, handleFilterChange updates the activeFilters state.
	•	useEffect in App.js listens for changes in activeFilters and events, triggering the transformation and filtering of events.
	4.	Event Transformation and Filtering:
	•	transformedEvents function modifies event data to fit FullCalendar’s expected format.
	•	Filters are applied to the transformed events, producing filteredEvents.
	5.	Final Render:
	•	FullCalendar receives filteredEvents and displays them on the calendar.
	•	Filter components (CategoryFilterSwitches, OrganizerFilter) display the active state.
	•	EventFormModal uses the same category and organizer data for adding or editing events.

This structure should provide a clear understanding of how data flows through the application, particularly focusing on the interaction between filters and the calendar. It also shows where each file plays a role in this flow, helping to pinpoint where issues may arise.