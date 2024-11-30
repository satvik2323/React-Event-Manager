import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import EventHeader from './EventHeader';
import { useDispatch } from 'react-redux';
import { addEvent } from '../redux/slices/eventSlice';

const CreateEventPage: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: 'United States', // Default location
    price: '',
    description: '',
    eventType: 'festival', // Default event type
    organiser: '',
    email: '',
    phoneNumber: '',
    speaker: '',
    videoUrl: '',
    zip: '',
  });

  const validateForm = () => {
    const { title, date, startTime, endTime, location, price, description, eventType, organiser, email, phoneNumber, speaker, videoUrl, zip } = formData;

    if (!title || !date || !startTime || !endTime || !location || !price || !description || !eventType || !organiser || !email || !phoneNumber || !speaker || !videoUrl || !zip) {
      toast.error('All fields are required.');
      return false;
    }

    if (title.length > 15 || organiser.length > 15 || speaker.length > 50) {
      toast.error('Event name and organiser should be of max 15 characters. Speaker name should be of max 50 characters.');
      return false;
    }

    if (description.length > 50) {
      toast.error('Description should be of max 50 characters.');
      return false;
    }

    if (new Date(`1970-01-01T${endTime}:00`) < new Date(`1970-01-01T${startTime}:00`)) {
      toast.error('End time cannot be less than start time.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format.');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Phone number should be 10 digits.');
      return false;
    }

    const zipRegex = /^[0-9]{6}$/;
    if (!zipRegex.test(zip)) {
      toast.error('Zip code should be exactly 6 digits.');
      return false;
    }

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(videoUrl)) {
      toast.error('Invalid video URL format.');
      return false;
    }

    return true;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) {
      return;
    }

    const eventData = {
      title: formData.title,
      date: formData.date,
      time: `${formData.startTime} - ${formData.endTime}`,
      location: formData.location,
      price: formData.price,
      description: formData.description,
      eventType: formData.eventType,
      organiser: formData.organiser,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      speaker: formData.speaker,
      videoUrl: formData.videoUrl,
      zip: formData.zip,
    };

    function getRandomInt(min: number, max: number): number {
      min = Math.ceil(min); // Round up the minimum to ensure it's included
      max = Math.floor(max); // Round down the maximum to ensure it's included
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        toast.success('Event created successfully!');
        const randomNumber = getRandomInt(1, 10000);
        dispatch(addEvent({ ...eventData, id: randomNumber }));
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <EventHeader />
      <div className="p-6 border-2 border-slate-400 m-4 rounded mt-20 md:mt-6">
        <h2 className="text-2xl mb-4 text-center text-cyan-800">Create Event</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Event Name</label>
            <input
              type="text"
              placeholder="Event Name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            <label className="block mb-2">Event Date</label>
            <div className="relative mb-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="block w-full p-2 pl-10 border"
              />
            </div>
            <label className="block mb-2">Time</label>
            <div className="flex space-x-4 mb-4">
              <div className="relative flex-1">
                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="block w-full p-2 pl-10 border"
                />
              </div>
              <div className="relative flex-1">
                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="block w-full p-2 pl-10 border"
                />
              </div>
            </div>
            <label className="block mb-2">Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="block w-full p-2 mb-4 border"
            >
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
            <label className="block mb-2">Price</label>
            <input
              type="text"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            <label className="block mb-2">Description</label>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full p-2 mb-4 border h-32"
            />
            <label className="block mb-2">Event Type</label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="block w-full p-2 mb-4 border"
            >
              <option value="festival">Festival</option>
              <option value="conference">Conference</option>
              <option value="playground">Playground</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Organiser</label>
            <input
              type="text"
              placeholder="Organiser"
              value={formData.organiser}
              onChange={(e) => setFormData({ ...formData, organiser: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            <label className="block mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            <label className="block mb-2">Speaker</label>
            <input
              type="text"
              placeholder="Speaker"
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            <label className="block mb-2">Video URL</label>
            <input
              type="text"
              placeholder="Video URL"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
            {formData.videoUrl && (
              <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                View Video
              </a>
            )}
            <label className="block mb-2">Zip Code</label>
            <input
              type="text"
              placeholder="Zip"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              className="block w-full p-2 mb-4 border"
            />
          </div>
        </div>
        <button onClick={handleCreateEvent} className="bg-primary text-white p-2 mt-4 w-full">Create Event</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateEventPage;
