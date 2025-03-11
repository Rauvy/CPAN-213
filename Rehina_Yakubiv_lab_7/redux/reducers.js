const initialState = {
    fahrenheit: '',
    error: '',
  };
  
  const temperatureReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'CONVERT_TEMPERATURE':
        const celsius = parseFloat(action.payload);
        if (isNaN(celsius)) {
          return { ...state, error: 'Please enter a valid number.', fahrenheit: '' };
        }
        const fahrenheit = (celsius * 9) / 5 + 32;
        return { ...state, fahrenheit: fahrenheit.toFixed(2), error: '' };
  
      default:
        return state;
    }
  };
  
  export default temperatureReducer;