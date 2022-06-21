import { memberChatActionTypes } from "./memberChatTypes";
import { createActions } from "../../lib/createActions";

export const setMemberChatOnline = (bool) =>
  createActions(memberChatActionTypes.SET_MEMBER_CHAT_ONLINE, bool);

export const setMemberChatCurrentUser = (user) =>
  createActions(memberChatActionTypes.SET_MEMBER_CHAT_USER, user);

export const setMemberChatMessageList = (messageList) =>
  createActions(
    memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE_LIST,
    messageList
  );

export const setMemberChatMessage = (message) =>
  createActions(memberChatActionTypes.SET_MEMBER_CHAT_MESSAGE, message);

export const memberChatGetUserDetails = (tokenList) => async (dispatch) => {
  dispatch({ type: memberChatActionTypes.FETCH_USER_DETAIL_START });
  const url = `GetUserDetails.aspx`;

  try {
    const data = await Promise.all(
      tokenList.map(async (token) => {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        const responseData = await response.json();
        // console.log({[token]: {...messagesMap[token], tel: responseData?.data?.User_Tel}});
        return {
          ...responseData?.data,
          token,
        };
      })
    );

    dispatch({
      type: memberChatActionTypes.FETCH_USER_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: memberChatActionTypes.FETCH_USER_DETAIL_FAILED,
      payload: error,
    });
  }
};
