import { alertActionTypes } from "../types/alertType";

export const setAlertItem = (data) => ({
  type: alertActionTypes.SET_ALERT,
  payload: data,
});

export const openAlert = () => ({
  type: alertActionTypes.OPEN_ALERT,
});

export const closeAlert = () => ({
  type: alertActionTypes.CLOSE_ALERT,
});
