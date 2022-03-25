import {
  SET_LIVE_ORDER_LIST,
  SET_LIVE_SELECT_ORDER,
  SET_LIVE_SELECT_THREAD,
  SET_LIVE_SELECT_TOKEN,
  SET_LIVE_OWN_MESSAGE,
  REMOVE_SELECT_DATA,
  cancelActionTypes,
} from "../types/liveOrderTypes";

import { getHeaders } from "../../lib/api";

export const setLiveOrderList = (liveOrderList) => {
  return {
    type: SET_LIVE_ORDER_LIST,
    liveOrderList,
  };
};

export const setLiveSelectOrder = (selectOrder) => {
  return {
    type: SET_LIVE_SELECT_ORDER,
    selectOrder,
  };
};

export const setLiveSelectThread = (selectThread) => {
  return {
    type: SET_LIVE_SELECT_THREAD,
    selectThread,
  };
};

export const setLiveSelectToken = (selectToken) => {
  return {
    type: SET_LIVE_SELECT_TOKEN,
    selectToken,
  };
};

export const setLiveSelectOwnMessage = (selectThreadOwnMessage) => {
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

export const cancelOrder = (token) => async (dispatch) => {
  dispatch({ type: cancelActionTypes.CANCEL_ORDER_BEGIN });

  const headers = getHeaders();
  const url = `/Req_CancelOrder.aspx`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        Token: token,
      }),
    });

    const data = await response.json();
    dispatch({
      type: cancelActionTypes.CANCEL_ORDER_SUCCESS,
      payload: { data },
    });
  } catch (error) {
    dispatch({
      type: cancelActionTypes.CANCEL_ORDER_ERROR,
      payload: { error },
    });
  }
};

export const cleanCancelStatus = () => {
  return {
    type: cancelActionTypes.CLEAR_CANCEL_ORDER_STATE,
  };
};
