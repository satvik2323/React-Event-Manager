import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('user');

  useEffect(() => {
    if (!token) {
      toast.error('You must be logged in to access this page.');
    }
  }, [token]);

  if (!token) {
    // Wait for a short time before navigating
    return <DelayedNavigate to="/login" />;
  }

  return children;
};

const DelayedNavigate: React.FC<{ to: string }> = ({ to }) => {
  const [shouldNavigate, setShouldNavigate] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldNavigate(true);
    }, 1000); // Adjust the delay as needed (1000ms = 1s)
    return () => clearTimeout(timer);
  }, []);

  return shouldNavigate ? <Navigate to={to} /> : null;
};

export default ProtectedRoute;
