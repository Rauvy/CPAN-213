import { createStore } from 'redux';
import temperatureReducer from "./reducers";

const store = createStore(temperatureReducer);

export default store;