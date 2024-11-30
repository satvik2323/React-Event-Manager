import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import image from '../assets/event-manager.png';
import { useNavigate } from 'react-router-dom';

const EventHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-slate-200 shadow">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center h-16 space-x-4">
        <div className="flex items-center space-x-2 h-full">
          <img src={image} alt="Event Logo" className="h-8 sm:h-10 md:h-12 my-1 mr-2" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black text-center">
          Event Manager
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center bg-secondary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow-sm hover:bg-secondary-dark"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Dashboard
        </button>
      </div>
    </header>
  );
};

export default EventHeader;
