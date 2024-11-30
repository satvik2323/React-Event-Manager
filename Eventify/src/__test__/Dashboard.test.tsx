import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DashboardPage from '../components/DashboardPage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockEvents = [
  {
    id: 1,
    title: 'Event 1',
    date: '2023-10-01',
    time: '10:00 AM - 12:00 PM',
    location: 'New York',
    price: '$100',
    description: 'Description 1',
    image: 'https://picsum.photos/300/200?random=1',
    eventType: 'festival',
  },
  {
    id: 2,
    title: 'Event 2',
    date: '2023-10-02',
    time: '11:00 AM - 1:00 PM',
    location: 'Los Angeles',
    price: '$200',
    description: 'Description 2',
    image: 'https://picsum.photos/300/200?random=2',
    eventType: 'conference',
  },
  // Add more mock events as needed
];

const store = mockStore({
  event: {
    events: mockEvents,
  },
});

describe('DashboardPage', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );
  });

  it('should render the DashboardPage component', () => {
    expect(screen.getByText('ALL')).toBeInTheDocument();
  });

  it('should filter events by category', () => {
    fireEvent.click(screen.getByText('FESTIVAL'));
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });

  it('should filter events by location', () => {
    fireEvent.change(screen.getByPlaceholderText('Location search'), { target: { value: 'New York' } });
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });

  it('should sort events by date', () => {
    fireEvent.change(screen.getByDisplayValue('Sort by Date (Ascending)'), { target: { value: 'desc' } });
    const sortedEvents = screen.getAllByText(/Event \d/);
    expect(sortedEvents[0]).toHaveTextContent('Event 2');
    expect(sortedEvents[1]).toHaveTextContent('Event 1');
  });

  it('should load more events on scroll', async () => {
    // Mock IntersectionObserver
    const observe = jest.fn();
    const unobserve = jest.fn();

    class MockIntersectionObserver {
      observe = observe;
      unobserve = unobserve;
      disconnect() {}
      takeRecords() { return []; }
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
    }

    window.IntersectionObserver = MockIntersectionObserver as any;

    // Simulate scrolling to the bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    await waitFor(() => {
      expect(observe).toHaveBeenCalled();
    });

    // Add more assertions to verify more events are loaded
  });

  it('should change view mode to list', () => {
    fireEvent.click(screen.getByTestId('view-list'));
    expect(screen.getByTestId('view-list')).toHaveClass('text-primary');
    expect(screen.getByTestId('view-grid')).toHaveClass('text-gray-500');
  });

  it('should change view mode to grid', () => {
    fireEvent.click(screen.getByTestId('view-grid'));
    expect(screen.getByTestId('view-grid')).toHaveClass('text-primary');
    expect(screen.getByTestId('view-list')).toHaveClass('text-gray-500');
  });

  it('should handle errors during data fetching', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject('API is down')
    );

    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching events:')).toBeInTheDocument();
    });
  });

  it('should verify the initial state of the component', () => {
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Location search')).toHaveValue('');
    expect(screen.getByDisplayValue('Sort by Date (Ascending)')).toBeInTheDocument();
    expect(screen.getByTestId('view-grid')).toHaveClass('text-primary');
  });

  it('should load more events when "SEE ALL EVENTS" button is clicked', () => {
    fireEvent.click(screen.getByText('SEE ALL EVENTS'));
    // Add assertions to verify more events are loaded
  });
});
