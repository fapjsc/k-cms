import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// // 持久儲存
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// Reducer
import { userReducer } from '../store/reducers/userReducers';
import { messageReducers } from './reducers/messageReducers';
import { liveOrderReducer } from './reducers/liveOrderReducer';
import { socketReducers } from './reducers/socketReducer';
import {alertReducer  } from "./reducers/alertReducer";

// const persistConfig = {
//   key: 'alert',
//   storage,
//   whitelist: ['soundSwitch'] 
// }


const reducer = combineReducers({
  user: userReducer,
  message: messageReducers,
  liveOrder: liveOrderReducer,
  socket: socketReducers,
  alert: alertReducer
});

// const myPersistReducer = persistReducer(persistConfig, alertReducer)

const store = createStore(reducer, composeWithDevTools());

// export const persistor = persistStore(createStore(myPersistReducer))

export default store;
