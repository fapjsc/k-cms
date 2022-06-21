import moment from "moment";
import { memberChatActionTypes } from "./memberChatTypes";

const initialState = {
  online: false,
  currentUser: null,
  message: null,
  messageList: [],
  fetchUserLoading: false,
  fetchUserData: null,
  fetchUserFAiled: null,
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
          (a, b) => moment(a.SysDate).valueOf() - moment(b.SysDate).valueOf()
        ),
      };

    case memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE:
      return {
        ...state,
        message: action.payload,
        messageList: [...state.messageList, action.payload],
      };

    case memberChatActionTypes.FETCH_USER_DETAIL_START:
      return {
        ...state,
        fetchUserLoading: true,
        fetchUserData: null,
        fetchUserFAiled: null,
      };

    case memberChatActionTypes.FETCH_USER_DETAIL_SUCCESS:
      return {
        ...state,
        fetchUserLoading: false,
        fetchUserData: action.payload,
        fetchUserFAiled: null,
      };

    case memberChatActionTypes.FETCH_USER_DETAIL_FAILED:
      return {
        ...state,
        fetchUserLoading: false,
        fetchUserData: null,
        fetchUserFAiled: action.payload,
      };

    default:
      return state;
  }
};
