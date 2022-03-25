import { agentActionTypes } from "../types/agentType";

export const setAgentList = (agentList) => ({
  type: agentActionTypes.SET_AGENT_LIST,
  payload: { agentList },
});
