import { memberCheckTimeTypes } from "./memberCheckTimeTypes";

const initialState = {
  memberCheckTimeMap: {},
  userList: [],
};

export const memberCheckTimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case memberCheckTimeTypes.SET_CHECK_TIME:
      const newObj = {
        ...state.memberCheckTimeMap,
        [action.payload.token]: action.payload.checkTime,
      };
      return {
        memberCheckTimeMap: newObj,
      };

    case memberCheckTimeTypes.REMOVE_ITEM:
      console.log(action.payload);

      const obj = { ...state.memberCheckTimeMap };
      Object.keys(obj).forEach((el) => {
        if (!el.includes(action.payload)) {
          delete obj.el;
        }
      });
      return {
        ...state,
        memberCheckTimeMap: obj,
      };

    case memberCheckTimeTypes.CLEAR_ALL:
      return {
        ...state,
        memberCheckTimeMap: {},
      };

    case memberCheckTimeTypes.SET_USER_LIST:
      return {
        ...state,
        userList: action.payload,
      };

    default:
      return state;
  }
};
