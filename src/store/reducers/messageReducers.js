import {
  SET_MESSAGE_LIST,
  SET_SELECT_THREAD,
  REMOVE_SELECT_THREAD,
  SET_UNREAD_MESSAGE_COUNT,
  REMOVE_UNREAD_ITEM,
} from "../types/messageTypes";

const initialState = {
  selectThread: "",
  selectToken: "",
  messageList: [],
  unReadMessage: [],
};

export const messageReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGE_LIST:
      const { Message_Role, Message, Tx_HASH, token, Message_Type, Sysdate } =
        action.message;

      let item = {
        [Tx_HASH]: [{ Message_Role, Message, token, Message_Type, Sysdate }],
      };

      const existsItem = state.messageList.find(
        (el) => Object.keys(el)[0] === Tx_HASH
      );

      if (existsItem) {
        return {
          ...state,
          messageList: state.messageList.map((el) =>
            Object.keys(el)[0] !== Tx_HASH
              ? el
              : {
                  [Tx_HASH]: [
                    ...Object.values(existsItem)[0],
                    { Message_Role, Message, token, Message_Type, Sysdate },
                  ],
                }
          ),
        };
      } else {
        return {
          ...state,
          messageList: [...state.messageList, item],
        };
      }

    case SET_SELECT_THREAD:
      const selectThread = state.messageList.find((el) => {
        return Object.keys(el)[0] === action.thread;
      });

      return {
        ...state,
        selectToken: Object.values(selectThread)[0][0].token,
        selectThread: action.thread,
      };

    case REMOVE_SELECT_THREAD:
      return {
        ...state,
        selectToken: "",
        selectThread: "",
      };

    case SET_UNREAD_MESSAGE_COUNT:
      // state.messageList.forEach(el => console.log(Object.keys(el)));
      const findItem = state.messageList.find(
        (el) => Object.keys(el)[0] === action.message.Tx_HASH
      );
      // console.log(Object.values(existsitem)[0].length);
      let filterItem = [];
      if (findItem) {
        filterItem = Object.values(findItem)[0].filter(
          (el) => el.Message_Role !== 2
        );
      }

      const unReadItem = {
        token: action.message.token,
        Tx_HASH: action.message.Tx_HASH,
        count: filterItem.length,
      };

      // const readCount = localStorage.getItem(unReadItem.token) * 1 || 0;

      const existsUnread = state.unReadMessage.find(
        (el) =>
          el.token === unReadItem.token && el.Tx_HASH === unReadItem.Tx_HASH
      );

      if (existsUnread) {
        // console.log(readCount);
        return {
          ...state,
          // unReadMessage: [{ token: '', length: null, hash: '' }],
          unReadMessage: state.unReadMessage.map((el) =>
            el.token === unReadItem.token && el.Tx_HASH === unReadItem.Tx_HASH
              ? { ...el, count: el.count + 1 }
              : el
          ),
        };
      } else {
        return {
          ...state,
          unReadMessage: [...state.unReadMessage, unReadItem],
        };
      }
    // const unReadItem = {
    //   token: action.message.token,
    //   Tx_HASH: action.message.Tx_HASH,
    //   count: 1,
    // };

    // const existsUnread = state.unReadMessage.find(
    //   el => el.token === unReadItem.token && el.Tx_HASH === unReadItem.Tx_HASH
    // );

    // if (existsUnread) {
    //   const readCount = localStorage.getItem(unReadItem.token) * 1 || 0;
    //   console.log(readCount);
    //   return {
    //     ...state,
    //     // unReadMessage: [{ token: '', length: null, hash: '' }],
    //     unReadMessage: state.unReadMessage.map(el =>
    //       el.token === unReadItem.token && el.Tx_HASH === unReadItem.Tx_HASH
    //         ? { ...el, count: el.count + 1 }
    //         : el
    //     ),
    //   };
    // } else {
    //   return {
    //     ...state,
    //     unReadMessage: [...state.unReadMessage, unReadItem],
    //   };
    // }

    case REMOVE_UNREAD_ITEM:
      return {
        ...state,
        unReadMessage: state.unReadMessage.filter(
          (el) => el.Tx_HASH !== action.Tx_HASH
        ),
      };

    default:
      return state;
  }
};
