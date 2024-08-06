# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# JustTango Frontend

This is the frontend application for JustTango, a calendaring application for organizing and viewing tango events.

## Table of Contents

- [JustTango Frontend](#justtango-frontend)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running Locally](#running-locally)
  - [Deployment](#deployment)
  - [Project Structure](#project-structure)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)

## Project Overview

JustTango is a web application that allows organizers of tango events to add and manage events, while users can view and filter events based on various categories and tags.

## Tech Stack

- React
- FullCalendar
- Material-UI (MUI)
- Firebase
- Bootstrap

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development environment:

- Node.js (version 14.x or later)
- npm (version 6.x or later)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ybotman/JustTangoFE.git
    cd JustTangoFE
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

### Running Locally

1. Ensure your backend server is running on `http://localhost:3001`.

2. Start the frontend application:
    ```bash
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`.

## Deployment

This project is configured for continuous integration and deployment using GitHub Actions and Azure Static Web Apps.

### Azure Static Web Apps CI/CD

To deploy your frontend application to Azure Static Web Apps, ensure you have the correct configuration in your GitHub Actions workflow file (`.github/workflows/azure-static-web-apps-black-coast-02af35a0f.yml`).

## Project Structure

```plaintext
├── public
│   ├── index.html
│   ├── JustTango3.jpg
│   └── ...
├── src
│   ├── components
│   │   ├── CalendarDateNavigation.js
│   │   ├── CategoryFilter.js
│   │   ├── CalendarViewSwitch.js
│   │   ├── HandlerProvider.js
│   │   ├── OrganizerFilter.js
│   │   ├── CategoryFilterSwitches.js
│   │   └── ...
│   ├── hooks
│   │   ├── useFetchData.js
│   │   ├── useFetchDataEvents.js
│   │   ├── useEventAPIHandlers.js
│   │   └── ...
│   ├── modals
│   │   ├── AdvancedFilterModal.js
│   │   ├── EventFormModal.js
│   │   └── LoginModal.js
│   ├── utilities
│   │   ├── DateUtils.js
│   │   └── rruleUtils.js
│   ├── App.css
│   ├── App.js
│   ├── customStyles.css
│   ├── index.css
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md