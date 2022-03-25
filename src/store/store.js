import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// 持久化存储 state
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducer
import { userReducer } from "../store/reducers/userReducers";
import { messageReducers } from "./reducers/messageReducers";
import { liveOrderReducer, cancelReducer } from "./reducers/liveOrderReducer";
import { socketReducers } from "./reducers/socketReducer";
import { alertReducer } from "./reducers/alertReducer";
import { memberReducer, memberInfoReducer } from "./reducers/memberReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["memberInfo"], // only member will be persisted
};

const reducer = combineReducers({
  user: userReducer,
  message: messageReducers,
  liveOrder: liveOrderReducer,
  socket: socketReducers,
  alert: alertReducer,
  cancel: cancelReducer,
  member: memberReducer,
  memberInfo: memberInfoReducer,
});

const middleware = [thunk];

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    storage.removeItem("persist:root");
    return reducer(undefined, action);
  }

  return reducer(state, action);
};

// 持久化根reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persisStore = persistStore(store);
