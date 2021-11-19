import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// Reducer
import { userReducer } from '../store/reducers/userReducers';
import { messageReducers } from './reducers/messageReducers';
import { liveOrderReducer } from './reducers/liveOrderReducer';
import { socketReducers } from './reducers/socketReducer';

const reducer = combineReducers({
  user: userReducer,
  message: messageReducers,
  liveOrder: liveOrderReducer,
  socket: socketReducers,
});

const store = createStore(reducer, composeWithDevTools());

export default store;
