import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import image from '../assets/event-manager.png';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-slate-200 shadow">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2 h-full">
          <img src={image} alt="Event Logo" className="h-8 sm:h-10 md:h-12 my-1 mr-2" />
        </div>
        {/* Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black">
          Dashboard
        </h1>
        {/* Buttons */}
        <div className="flex items-center space-x-2">
          {/* Add Event Button */}
          <button
            onClick={() => navigate('/create-event')}
            className="flex items-center bg-secondary text-white text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 py-1 rounded-md shadow-sm hover:bg-secondary-dark"
          >
            <FontAwesomeIcon icon={faCalendarPlus} className="mr-1 sm:mr-2" />
            Add Event
          </button>
          {/* Analysis Page Button */}
          <button
            onClick={() => navigate('/analysis')}
            className="flex items-center bg-secondary text-white text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 py-1 rounded-md shadow-sm hover:bg-secondary-dark"
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-1 sm:mr-2" />
            Analysis
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
