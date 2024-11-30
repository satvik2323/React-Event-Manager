import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  id: number,
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  image: string;
}

const EventCard = forwardRef<HTMLDivElement, EventCardProps>((props, ref) => {
  const { id, title, date, time, location, price, description, image } = props;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  return (
    <div ref={ref} className="flex mb-4 p-4 border rounded-lg shadow-sm bg-white cursor-pointer" onClick={handleCardClick}>
      <img className="w-32 h-41 object-cover rounded mr-4" src={image} alt={title} />
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            <p>{date} at {time} on {location}</p>
          </div>
          <p className="text-primary font-bold mb-2">Tickets from {price}</p>
          <p className="text-gray-600 mb-4">{description}</p>
        </div>
        <button className="border border-gray-300 text-gray-600 p-2 rounded">TICKETS & DETAILS</button>
      </div>
    </div>
  );
});

export default EventCard;
