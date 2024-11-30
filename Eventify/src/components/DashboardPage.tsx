import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from './Header';
import EventCard from './EventCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faThLarge, faThList, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from '../redux/slices/eventSlice';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  image?: string;
  eventType: string;
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const eventsInStore = useSelector((state: { event: { events: Event[] } }) => state.event.events);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [viewMode, setViewMode] = useState<string>('grid');
  const observer = useRef<IntersectionObserver>();

  const lastEventRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayEvents.length < filteredEvents.length) {
          loadMoreEvents();
        }
      });
      if (node) observer.current.observe(node);
    },
    [displayEvents, filteredEvents]
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();
        // console.log(data);
        if (eventsInStore.length === 0) {
          data.map((event: any) => {
            dispatch(addEvent(event));
          });
        }
        const eventsWithImages = data.map((event: Event) => {
          event.image = `https://picsum.photos/300/200?random=${event.id}`;
          return event;
        });
        setEvents(eventsWithImages);
        setFilteredEvents(eventsWithImages);
        setDisplayEvents(eventsWithImages.slice(0, 12)); // Show only 12 events initially
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [dispatch, eventsInStore]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    filterEvents(category, searchLocation, sortOrder);
  };

  const handleLocationSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const location = event.target.value;
    setSearchLocation(location);
    filterEvents(selectedCategory, location, sortOrder);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value;
    setSortOrder(order);
    filterEvents(selectedCategory, searchLocation, order);
  };

  const filterEvents = (category: string, location: string, order: string) => {
    let filtered = [...events];
    if (category !== 'all') {
      filtered = filtered.filter(event => event.eventType === category);
    }
    if (location) {
      filtered = filtered.filter(event => event.location.toLowerCase().includes(location.toLowerCase()));
    }
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time.split(' - ')[0]}`).getTime();
      const dateB = new Date(`${b.date} ${b.time.split(' - ')[0]}`).getTime();
      if (order === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setFilteredEvents(filtered);
    setDisplayEvents(filtered.slice(0, 3)); // Reset display events to initial 3
  };

  const loadMoreEvents = () => {
    setDisplayEvents((prevDisplayEvents) => [
      ...prevDisplayEvents,
      ...filteredEvents.slice(prevDisplayEvents.length, prevDisplayEvents.length + 3),
    ]);
  };

  const handleSeeAllEventsClick = () => {
    setDisplayEvents(filteredEvents);
  };

  return (
    <>
      <Header />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-2 rounded-full">
              <FontAwesomeIcon icon={faHeart} className="text-white" />
            </div>
            <a
              href="#"
              className={`font-bold ${selectedCategory === 'all' ? 'text-primary underline' : 'text-gray-500'}`}
              onClick={() => handleCategoryClick('all')}
            >
              ALL
            </a>
            <a
              href="#"
              className={`font-bold ${selectedCategory === 'festival' ? 'text-primary underline' : 'text-gray-500'}`}
              onClick={() => handleCategoryClick('festival')}
            >
              FESTIVAL
            </a>
            <a
              href="#"
              className={`font-bold ${selectedCategory === 'conference' ? 'text-primary underline' : 'text-gray-500'}`}
              onClick={() => handleCategoryClick('conference')}
            >
              CONFERENCE
            </a>
            <a
              href="#"
              className={`font-bold ${selectedCategory === 'playground' ? 'text-primary underline' : 'text-gray-500'}`}
              onClick={() => handleCategoryClick('playground')}
            >
              PLAYGROUND
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Location search"
                className="border p-2 rounded pl-10"
                value={searchLocation}
                onChange={handleLocationSearch}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <select className="border p-2 rounded" value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Sort by Date (Ascending)</option>
              <option value="desc">Sort by Date (Descending)</option>
            </select>
            <FontAwesomeIcon
              icon={faThLarge}
              className={`text-2xl cursor-pointer ${viewMode === 'grid' ? 'text-primary' : 'text-gray-500'}`}
              onClick={() => setViewMode('grid')}
            />
            <FontAwesomeIcon
              icon={faThList}
              className={`text-2xl cursor-pointer ${viewMode === 'list' ? 'text-primary' : 'text-gray-500'}`}
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {displayEvents.map((event, index) => (
            <EventCard
              id={event.id}
              key={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              price={event.price}
              description={event.description}
              image={event.image || 'https://via.placeholder.com/300x200'}
              ref={index === displayEvents.length - 1 ? lastEventRef : null} // Attach ref to the last event card for infinite scroll
            />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button className="bg-accent text-white p-2 rounded" onClick={handleSeeAllEventsClick}>SEE ALL EVENTS</button>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
