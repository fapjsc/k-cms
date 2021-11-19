import { SET_CHAT_SOCKET_STATUS, SET_LIVE_ORDER_SOCKET_STATUS } from '../types/socketTypes';

export const setChatSocketStatus = chatSocketStatus => {
  return {
    type: SET_CHAT_SOCKET_STATUS,
    chatSocketStatus,
  };
};

export const setLiveOrderSocketStatus = liveOrderSocketStatus => {
  return {
    type: SET_LIVE_ORDER_SOCKET_STATUS,
    liveOrderSocketStatus,
  };
};
