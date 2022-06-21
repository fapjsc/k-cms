import { memberCheckTimeTypes } from "./memberCheckTimeTypes";
import { createActions } from "../../lib/createActions";

export const setMemberCheckTime = (updateCheckTime) =>
  createActions(memberCheckTimeTypes.SET_CHECK_TIME, updateCheckTime);

export const removeMemberCheckItem = (userList) =>
  createActions(memberCheckTimeTypes.REMOVE_ITEM, userList);

export const clearAllMemberCheckTime = () =>
  createActions(memberCheckTimeTypes.CLEAR_ALL);

export const setMemberCheckTimeUserList = (userList) =>
  createActions(memberCheckTimeTypes.SET_USER_LIST, userList);


