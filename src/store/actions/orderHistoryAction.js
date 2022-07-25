import { orderHistoryTypes } from "../types/orderHistoryTypes";

export const setSearchParams = (params) => ({
  type: orderHistoryTypes.SET_SEARCH_PARAMS,
  payload: params,
});

export const clearSearchParams = () => ({
  type: orderHistoryTypes.CLEAR_SEARCH_PARAMS,
});

export const setCurrentPage = (currentPage) => ({
  type: orderHistoryTypes.SET_CURRENT_PAGE,
  payload: currentPage,
});

export const clearCurrentPage = () => ({
  type: orderHistoryTypes.CLEAR_CURRENT_PAGE,
});

export const setFilters = (filters) => ({
  type: orderHistoryTypes.SET_FILTER_VALUE,
  payload: filters,
});

export const clearFilters = () => ({
  type: orderHistoryTypes.CLEAR_FILTER_VALUE,
});

export const clearAll = () => ({
  type: orderHistoryTypes.CLEAR_ALL,
});
