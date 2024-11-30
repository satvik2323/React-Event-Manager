import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Event interface
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

// Events interface
interface Events {
  events: Event[];
}

// Initial state
const initialState: Events = {
  events: [],
};


// Create the slice
const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
      // Reducer to set events
      setEvents(state, action: PayloadAction<Event[]>) {
        state.events = action.payload;
      },
      // Reducer to add a single event
      addEvent(state, action: PayloadAction<Event>) {
        state.events.push(action.payload);
      },
    },
  });
  
  // Export actions and reducer
  export const { setEvents, addEvent } = eventSlice.actions;
  export const eventReducer= eventSlice.reducer;
  