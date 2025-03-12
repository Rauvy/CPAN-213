import { ADD_BOOKING, DELETE_BOOKING } from '../actions/types';

const initialState = {
  bookedRooms: []
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOKING:
      return {
        ...state,
        bookedRooms: [...state.bookedRooms, action.payload]
      };
    case DELETE_BOOKING:
      return {
        ...state,
        bookedRooms: state.bookedRooms.filter(
          room => room.roomNumber !== action.payload
        )
      };
    default:
      return state;
  }
};

export default bookingReducer; 