import { alertActionTypes } from "../types/alertType";

const initialState = {
  soundSwitch: false,
  alertList: {
    pair: [],
    appeal: [],
  },
};

export const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case alertActionTypes.SET_ALERT:
      if (!state.soundSwitch) {
        return state;
      }

      const pairArr = action.payload.filter((el) => el.Order_StatusID === 31);
      const appealArr = action.payload.filter((el) => el.Order_StatusID === 35);

      return {
        ...state,
        alertList: {
          pair: pairArr,
          appeal: appealArr,
        },
      };

    case alertActionTypes.OPEN_ALERT:
      return {
        ...state,
        soundSwitch: true,
      };

    case alertActionTypes.CLOSE_ALERT:
      return {
        soundSwitch: false,
        alertList: {
          pair: [],
          appeal: [],
        },
      };

    default:
      return state;
  }
};
