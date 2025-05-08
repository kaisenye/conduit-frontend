# Conduit Frontend

A modern React application for the Tri-Party Conversational System.

## Tech Stack

- React 18 (Vite)
- TailwindCSS
- TanStack Query
- Socket.io Client
- React Flow

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- The application uses TailwindCSS for styling
- TanStack Query for data fetching and caching
- Socket.io for real-time communication
- React Flow for message flow visualization

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `hooks/` - Custom React hooks
  - `services/` - API and socket services
  - `utils/` - Utility functions
