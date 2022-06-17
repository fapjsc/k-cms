import { memberChatActionTypes } from "./memberChatTypes";
import { createActions } from "../../lib/createActions";

export const setMemberChatCurrentUser = (user) =>
  createActions(memberChatActionTypes.SET_MEMBER_CHAT_USER, user);

export const setMemberChatMessageList = (messageList) =>
  createActions(
    memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE_LIST,
    messageList
  );

export const setMemberChatMessage = (message) =>
  createActions(memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE, message);
