export const selectCheckTime = (state) =>
  state.memberCheckTime.memberCheckTimeMap;

export const selectHasUnReadMessage = (state) =>
  state.memberCheckTime.hasUnReadMessage;

export const selectMemberCheckTimeUserList = (state) =>
  state.memberCheckTime.userList;
