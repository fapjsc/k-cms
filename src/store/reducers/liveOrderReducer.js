import {
  SET_LIVE_ORDER_LIST,
  SET_LIVE_SELECT_ORDER,
  SET_LIVE_SELECT_THREAD,
  SET_LIVE_SELECT_TOKEN,
  SET_LIVE_OWN_MESSAGE,
  REMOVE_SELECT_DATA,
} from '../types/liveOrderTypes';

const initialState = {
  orderList: null,
  length: null,
  selectOrder: null,
  selectToken: null,
  selectThread: null,
  selectThreadOwnMessageFromClient: null,
  selectThreadOwnMessageFromClientLength: null,
  unReadCount: null,
};

export const liveOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_ORDER_LIST:
      return {
        ...state,
        orderList: [...action.liveOrderList],
        length: action.liveOrderList.length,
      };

    case SET_LIVE_SELECT_ORDER:
      return {
        ...state,
        selectOrder: action.selectOrder,
      };

    case SET_LIVE_SELECT_THREAD:
      return {
        ...state,
        selectThread: action.selectThread,
      };

    case SET_LIVE_SELECT_TOKEN:
      return {
        ...state,
        selectToken: action.selectToken,
      };

    case SET_LIVE_OWN_MESSAGE:
      return {
        ...state,
        selectThreadOwnMessageFromClient: action.selectThreadOwnMessage.filter(
          el => el.Message_Role !== 2
        ),
        selectThreadOwnMessageFromClientLength: action.selectThreadOwnMessage.filter(
          el => el.Message_Role !== 2
        ).length,
        unReadCount:
          action.selectThreadOwnMessage.filter(el => el.Message_Role !== 2).length -
          localStorage.getItem(state.selectThread),
      };

    case REMOVE_SELECT_DATA:
      return {
        ...state,
        selectToken: null,
        selectThread: null,
        selectThreadOwnMessageFromClient: null,
        selectThreadOwnMessageFromClientLength: null,
        unReadCount: null,
      };
    default:
      return state;
  }
};