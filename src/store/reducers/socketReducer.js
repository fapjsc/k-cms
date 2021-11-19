import { SET_CHAT_SOCKET_STATUS, SET_LIVE_ORDER_SOCKET_STATUS } from '../types/socketTypes';

const initialState = {
  chat: null,
  liveOrder: null,
};

export const socketReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_ORDER_SOCKET_STATUS:
      return {
        ...state,
        liveOrder: action.liveOrderSocketStatus,
      };

    case SET_CHAT_SOCKET_STATUS:
      return {
        ...state,
        chat: action.chatSocketStatus,
      };
    default:
      return state;
  }
};
