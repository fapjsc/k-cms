import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// Reducer
import { userReducer } from "../store/reducers/userReducers";
import { messageReducers } from "./reducers/messageReducers";
import { liveOrderReducer, cancelReducer } from "./reducers/liveOrderReducer";
import { socketReducers } from "./reducers/socketReducer";
import { alertReducer } from "./reducers/alertReducer";
import { agentReducer } from "./reducers/agentReducer";

const reducer = combineReducers({
  user: userReducer,
  message: messageReducers,
  liveOrder: liveOrderReducer,
  socket: socketReducers,
  alert: alertReducer,
  cancel: cancelReducer,
  agent: agentReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
