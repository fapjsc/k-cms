import { SET_MESSAGE_LIST, SET_SELECT_THREAD } from '../types/messageTypes';

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
