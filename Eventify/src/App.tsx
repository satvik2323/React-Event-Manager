import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import CreateEventPage from './components/CreateEventPage';
import EventDetailsPage from './components/EventDetailsPage';
import EventAnalysisPage from './components/EventAnalysisPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<div>The page you are looking for does not exist !!</div>} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } />
        <Route path="/event/:id" element={
          <ProtectedRoute>
            <EventDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/analysis" element={
          <ProtectedRoute>
            <EventAnalysisPage />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
