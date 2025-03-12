import { ADD_BOOKING, DELETE_BOOKING } from './types';

// Action to add a new room booking
export const addBooking = (bookingData) => {
  return {
    type: ADD_BOOKING,
    payload: bookingData
  };
};

// Action to delete a room booking
export const deleteBooking = (roomNumber) => {
  return {
    type: DELETE_BOOKING,
    payload: roomNumber
  };
}; 