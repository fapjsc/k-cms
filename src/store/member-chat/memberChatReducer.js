import moment from "moment";
import { memberChatActionTypes } from "./memberChatTypes";

const initialState = {
  online: false,
  currentUser: null,
  message: null,
  messageList: [],
};

export const memberChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case memberChatActionTypes.SET_MEMBER_CHAT_ONLINE:
      return {
        ...state,
        online: action.payload,
      };

    case memberChatActionTypes.SET_MEMBER_CHAT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE_LIST:
      return {
        ...state,
        messageList: action.payload.sort(
          (a, b) => moment(a.SysDate) - moment(b.SysDate)
        ),
      };

    case memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE:
      return {
        ...state,
        message: action.payload,
        messageList: [...state.messageList, action.payload],
      };

    default:
      return state;
  }
};
