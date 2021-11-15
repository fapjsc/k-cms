import { SET_MESSAGE_LIST, SET_SELECT_THREAD } from '../types/messageTypes';

const initialState = {
  selectThread: '',
  selectToken: '',
  messageList: [],
};

export const messageReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGE_LIST:
      const { Message_Role, Message, Tx_HASH, token, Message_Type, Sysdate } = action.message;

      let item = {
        [Tx_HASH]: [{ Message_Role, Message, token, Message_Type, Sysdate }],
      };

      const existsItem = state.messageList.find(el => Object.keys(el)[0] === Tx_HASH);

      if (existsItem) {
        return {
          ...state,
          messageList: state.messageList.map(el =>
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
      const selectThread = state.messageList.find(el => {
        return Object.keys(el)[0] === action.thread;
      });

      return {
        ...state,
        selectToken: Object.values(selectThread)[0][0].token,
        selectThread: action.thread,
      };

    default:
      return state;
  }
};
