export const convertTemperature = (celsius) => ({
    type: 'CONVERT_TEMPERATURE',
    payload: celsius,
  });