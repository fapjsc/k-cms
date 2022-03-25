import { membersActionTypes } from "../types/membersType";

const initialState = {
  memberList: [],
};

export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case membersActionTypes.SET_MEMBER_LIST:
      return {
        ...state,
        memberList: action.payload.memberList,
      };
    default:
      return state;
  }
};

const memberInfoInitialState = {
  loading: false,
  data: null,
  error: "",
};

export const memberInfoReducer = (state = memberInfoInitialState, action) => {
  switch (action.type) {
    case membersActionTypes.SET_MEMBER_INFO_BEGIN:
      return {
        loading: true,
        data: null,
        error: "",
      };

    case membersActionTypes.SET_MEMBER_INFO_SUCCESS:
      return {
        loading: false,
        data: action.payload.memberInfo,
        error: "",
      };

    case membersActionTypes.SET_MEMBER_INFO_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload.error,
      };

    case membersActionTypes.CLEAN_MEMBER_INFO_STATUS:
      return memberInfoInitialState;

    default:
      return state;
  }
};
