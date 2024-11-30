import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faClock, faVideo, faPlus, faMinus, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventHeader from './EventHeader';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  eventType: string;
  organiser: string;
  email: string;
  phoneNumber: string;
  speaker: string;
  videoUrl: string;
  zip: string;
  image?: string;
  latitude: number;
  longitude: number;
  isRegistered: boolean;
}

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [showWhenWhere, setShowWhenWhere] = useState<boolean>(true);
  const [showOrganiser, setShowOrganiser] = useState<boolean>(true);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`);
        const data = await response.json();
        data.image = `https://picsum.photos/800/400?random=${data.id}`;
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    const fetchRelatedEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();
        setRelatedEvents(data.filter((e: Event) => e.id !== Number(id)));
      } catch (error) {
        console.error('Error fetching related events:', error);
      }
    };

    fetchEvent();
    fetchRelatedEvents();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const mapUrl = `https://www.google.com/maps?q=${event.latitude},${event.longitude}&output=embed`;

  const handleRegister = async () => {
    if (!event.isRegistered) {
      try {
        // Update the event on the server
        const updatedEvent = { ...event, isRegistered: true };
        const response = await fetch(`http://localhost:5000/events/${event.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedEvent)
        });

        if (response.ok) {
          setEvent(updatedEvent);
          toast.success('Successfully registered for the event!');
        } else {
          toast.error('Error registering for the event.');
        }
      } catch (error) {
        console.error('Error registering for the event:', error);
        toast.error('Error registering for the event.');
      }
    } else {
      toast.error('You have already registered for this event.');
    }
  };

  return (
    <>
      <ToastContainer />
      <EventHeader />
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <img src={event.image} alt={event.title} className="w-full h-auto rounded mb-4" />
            <h2 className="text-3xl font-bold mb-4 pl-3">{event.title}</h2>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <h3 className="text-xl font-bold text-blue-900 mb-2">WHAT'S ABOUT EVENT</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>
            <div className="flex space-x-4 mb-4">
              <button 
                onClick={event.isRegistered ? undefined : handleRegister} 
                className={`px-4 py-2 rounded-md shadow-sm ${event.isRegistered ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-primary text-white cursor-pointer'}`}>
                {event.isRegistered ? 'REGISTERED' : 'REGISTER'}
              </button>
              <a href={event.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white px-4 py-2 rounded-md shadow-sm flex items-center">
                <FontAwesomeIcon icon={faVideo} className="mr-2" />
                WATCH VIDEO
              </a>
            </div>
          </div>
          <div className="md:w-1/3 md:pl-6">
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">WHEN & WHERE</h3>
                <button className="text-black" onClick={() => setShowWhenWhere(!showWhenWhere)}>
                  <FontAwesomeIcon icon={showWhenWhere ? faMinus : faPlus} />
                </button>
              </div>
              {showWhenWhere && (
                <div className="transition-all duration-300 ease-in-out">
                  <p className="text-gray-600 mb-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{event.location}</p>
                  <p className="text-gray-600 mb-2"><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />{event.date}</p>
                  <p className="text-gray-600 mb-2"><FontAwesomeIcon icon={faClock} className="mr-2" />{event.time}</p>
                  <p className="text-gray-600 mb-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{event.zip}</p>
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">ORGANISER</h3>
                <button className="text-black" onClick={() => setShowOrganiser(!showOrganiser)}>
                  <FontAwesomeIcon icon={showOrganiser ? faMinus : faPlus} />
                </button>
              </div>
              {showOrganiser && (
                <div className="transition-all duration-300 ease-in-out">
                  <p className="text-gray-600 mb-2">{event.organiser}</p>
                  <p className="text-gray-600 mb-2">{event.email}</p>
                  <p className="text-gray-600 mb-2">{event.phoneNumber}</p>
                  <p className="text-gray-600 mb-2">{event.speaker}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Section for Date, Time, Location, Description, Speaker */}
        <div className="bg-white p-6 rounded mt-8">
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-900 text-2xl mr-2 pl-1" />
            <div className="text-2xl font-bold text-blue-900">{event.date}</div>
          </div>
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faClock} className="text-blue-900 text-2xl mr-2 pl-1" />
            <div className="text-2xl font-bold text-blue-900">{event.time}</div>
          </div>
          <div className="border border-gray-500 p-4 rounded">
            <p className="text-gray-800 mb-4"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{event.location}</p>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <p className="text-gray-800"><FontAwesomeIcon icon={faMicrophone} className="mr-2" />Speakers: {event.speaker}</p>
          </div>
        </div>

        {/* You May Like Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">You May Like</h3>
          <div className="flex overflow-x-auto space-x-4">
            {relatedEvents.map((relatedEvent) => (
              <div key={relatedEvent.id} className="flex-shrink-0 w-1/3 bg-white p-4 rounded shadow-sm">
                <img src={`https://picsum.photos/300/200?random=${relatedEvent.id}`} alt={relatedEvent.title} className="w-full h-auto rounded mb-2" />
                <h4 className="text-lg font-bold mb-2">{relatedEvent.title}</h4>
                <p className="text-gray-600 mb-2"><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />{relatedEvent.date}</p>
                <p className="text-gray-600 mb-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{relatedEvent.location}</p>
                <a href={`/event/${relatedEvent.id}`} className="text-blue-500 hover:underline">View Details</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailsPage;
