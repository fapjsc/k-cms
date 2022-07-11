import moment from 'moment'

export const selectMessagesMap = (state) => {
  const messagesMap = state.memberChat.messageList.reduce((acc, message) => {
    const { token, ...others } = message;

    if (!acc[token]) {
      acc[token] = {
        messages: [others],
        lastTime: others.SysDate

      };
    } else {
      acc[token].messages.push(others);
      acc[token].lastTime = acc[token].messages.sort((a, b) => moment(b.SysDate).valueOf() - moment(a.SysDate).valueOf())[0].SysDate
    }
    return acc;
  }, {});

  return messagesMap;
};

export const selectLastMessage = (state) => {
  const lastMessagesMap = state.memberChat.messageList.reduce(
    (acc, message) => {
      const { token, ...others } = message;
      acc[token] = others;
      return acc;
    },
    {}
  );

  return lastMessagesMap;
};

export const selectMemberChatOnline = (state) => state.memberChat.online;

export const selectMemberChatCurrentUser = (state) =>
  state.memberChat.currentUser;

export const selectMemberChatUserDetail = (state) => {
  if (!state.memberChat.fetchUserData) return;

  const userDetail = state.memberChat.fetchUserData.reduce((acc, message) => {
    const { token, ...others } = message;
    acc[token] = { ...others };

    return acc;
  }, {});
  return userDetail;
};
