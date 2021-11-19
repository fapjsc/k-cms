import {
  SET_LIVE_ORDER_LIST,
  SET_LIVE_SELECT_ORDER,
  SET_LIVE_SELECT_THREAD,
  SET_LIVE_SELECT_TOKEN,
  SET_LIVE_OWN_MESSAGE,
  REMOVE_SELECT_DATA,
} from '../types/liveOrderTypes';

export const setLiveOrderList = liveOrderList => {
  return {
    type: SET_LIVE_ORDER_LIST,
    liveOrderList,
  };
};

export const setLiveSelectOrder = selectOrder => {
  return {
    type: SET_LIVE_SELECT_ORDER,
    selectOrder,
  };
};

export const setLiveSelectThread = selectThread => {
  return {
    type: SET_LIVE_SELECT_THREAD,
    selectThread,
  };
};

export const setLiveSelectToken = selectToken => {
  return {
    type: SET_LIVE_SELECT_TOKEN,
    selectToken,
  };
};

export const setLiveSelectOwnMessage = selectThreadOwnMessage => {
  return {
    type: SET_LIVE_OWN_MESSAGE,
    selectThreadOwnMessage,
  };
};

export const removeSelectData = () => {
  return {
    type: REMOVE_SELECT_DATA,
  };
};
