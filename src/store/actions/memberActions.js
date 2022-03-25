import { membersActionTypes } from "../types/membersType";
import { getHeaders } from "../../lib/api";

export const setMemberList = (memberList) => ({
  type: membersActionTypes.SET_MEMBER_LIST,
  payload: { memberList },
});

export const getMemberInfo = (token) => async (dispatch) => {
  dispatch({ type: membersActionTypes.SET_MEMBER_INFO_BEGIN });

  const headers = getHeaders();
  const url = `GetTxUserHistory.aspx`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        token,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || "Get member info fail");

    if (data.code !== 200) throw new Error(data.msg || "get member denied");

    dispatch({
      type: membersActionTypes.SET_MEMBER_INFO_SUCCESS,
      payload: { memberInfo: data.data },
    });
  } catch (error) {
    dispatch({
      type: membersActionTypes.SET_MEMBER_INFO_ERROR,
      payload: { error },
    });
  }
};

export const cleanMemberInfo = () => ({
  type: membersActionTypes.CLEAN_MEMBER_INFO_STATUS,
});
