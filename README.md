# React Quiz Application

A modern, single-page quiz application built with React. This project demonstrates advanced state management patterns by implementing a feature-rich quiz with a timer, progress tracking, and persistent high scores.

**Live Demo:** [https://amjadvc.github.io/react-quiz/](https://amjadvc.github.io/react-quiz/)

## Features

- **Dynamic Question Flow:** Fetches quiz data from a remote API upon initialization.
- **Timer-Based Challenge:** Configurable time limit (30 seconds per question) to add pressure.
- **Real-Time Progress Tracking:** Visual progress bar updates with each answered question.
- **Score Calculation:** Points are awarded based on question difficulty.
- **High Score Persistence:** Maintains a record of the best performance across sessions.
- **Responsive UI:** Fully responsive design ensures compatibility across desktop and mobile devices.

## Technology Stack

- **Framework:** React 18
- **State Management:** React Context API & useReducer Hook
- **Data Fetching:** Native Fetch API
- **Styling:** Pure CSS

## State Management

The application utilizes a `useReducer` hook within a Context Provider to manage complex state transitions efficiently. The state object includes:

- `status`: Tracks the application phase (`loading`, `ready`, `active`, `finished`)
- `questions`: Array of quiz questions fetched from the API
- `index`: Current question index
- `answer`: User's selected answer
- `points`: Accumulated score
- `highscore`: Persistent best performance
- `secondsRemaining`: Timer state
