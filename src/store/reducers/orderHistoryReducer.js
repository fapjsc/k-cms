import { orderHistoryTypes } from "../types/orderHistoryTypes";

const initState = {
  searchParams: null,
  currentPage: null,
  filters: null,
};

export const orderHistoryReducer = (state = initState, action) => {
  switch (action.type) {
    case orderHistoryTypes.SET_SEARCH_PARAMS:
      return {
        ...state,
        searchParams: action.payload,
      };

    case orderHistoryTypes.CLEAR_SEARCH_PARAMS:
      return {
        ...state,
        searchParams: null,
      };

    case orderHistoryTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case orderHistoryTypes.CLEAR_CURRENT_PAGE:
      return {
        ...state,
        currentPage: null,
      };

    case orderHistoryTypes.SET_FILTER_VALUE:
      // const obj = { ...state.filters, ...action.payload };
      // Object.keys(obj).forEach((key) => {
      //   if (obj[key] === null) {
      //     delete obj[key];
      //   }
      // });
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case orderHistoryTypes.CLEAR_FILTER_VALUE:
      return {
        ...state,
        filters: null,
      };

    case orderHistoryTypes.CLEAR_ALL:
      return initState;

    default:
      return state;
  }
};
