import { agentActionTypes } from "../types/agentType";
const initialState = {
  agentList: [],
};

export const agentReducer = (state = initialState, action) => {
  switch (action.type) {
    case agentActionTypes.SET_AGENT_LIST:
      return {
        ...state,
        agentList: action.payload.agentList,
      };
    default:
      return state;
  }
};
