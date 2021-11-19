import {
  SET_MESSAGE_LIST,
  SET_SELECT_THREAD,
  REMOVE_SELECT_THREAD,
  SET_UNREAD_MESSAGE_COUNT,
  REMOVE_UNREAD_ITEM,
} from '../types/messageTypes';

export const setMessageList = message => {
  return {
    type: SET_MESSAGE_LIST,
    message,
  };
};

export const setSelectThread = thread => {
  return {
    type: SET_SELECT_THREAD,
    thread,
  };
};

export const removeThreadAndToken = () => {
  return {
    type: REMOVE_SELECT_THREAD,
  };
};

export const setUnreadMessageCount = message => {
  return {
    type: SET_UNREAD_MESSAGE_COUNT,
    message,
  };
};

export const removeUnreadMessageCount = Tx_HASH => {
  return {
    type: REMOVE_UNREAD_ITEM,
    Tx_HASH,
  };
};
