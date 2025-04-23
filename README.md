# PackWise Frontend

PackWise is an AI-powered travel assistant that helps you create smart packing lists customized for your destination and travel style.

## Features

- **Smart Packing Lists**: AI-generated packing recommendations based on your destination, weather predictions, and trip purpose
- **Weather Forecasting**: Intelligent weather predictions for your travel dates
- **Interactive Lists**: Customizable packing lists with progress tracking
- **Travel Management**: Create, track, and manage all your trips in one place
- **Recommendations**: Get personalized recommendations based on similar travelers' packing lists

## Technology Stack

- **React 18**: Modern frontend framework
- **React Router**: For navigation and routing
- **Recharts**: Data visualization for weather analytics
- **CSS Modules**: For component-scoped styling

## Project Structure

```
src/
├── App.jsx             # Main application component with routing
├── components/         # Reusable UI components
│   ├── AuthForms/      # Authentication related components
│   ├── Dashboard/      # Dashboard components
│   ├── Header/         # Application header
│   ├── LandingPage/    # Landing page components
│   ├── TripPage/       # Trip details components
├── context/            # React context providers
│   └── auth-context.jsx # Authentication context
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── CreateTripPage/ # Trip creation page
│   ├── Dashboard/      # Dashboard page
│   ├── LandingPage/    # Landing page
│   ├── ProfilePage/    # User profile page
│   ├── TripPage/       # Trip details page
├── services/           # API service layer
│   └── api.jsx         # API client and service methods
```

## Setup and Installation

### Prerequisites

- Node.js 16+ and npm installed
- Packwise Backend running locally

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/packwise-frontend.git
   cd packwise-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API endpoint:
   - Open `src/services/api.jsx`
   - Set the `API_URL` to your backend endpoint

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features Breakdown

### Authentication

- User registration and login
- JWT-based authentication
- Protected routes

### Dashboard

- Overview of all trips
- Trip statistics and progress
- Real-time notifications
- Quick access to create new trips

### Trip Management

- Create new trips with destination, dates, and purpose
- View detailed trip information
- Weather forecasts with historical data visualization
- Delete and edit trips

### Packing Lists

- AI-generated packing lists based on trip data
- Interactive packing interface with progress tracking
- Add, remove, and modify packing items
- Get recommendations based on similar travelers

### User Profile

- View and edit personal information
- Account management

## License

This project is licensed under the MIT License - see the LICENSE file for details.