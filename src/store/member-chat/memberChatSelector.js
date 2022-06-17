export const selectorMessagesMap = (state) => {
  const messagesMap = state.memberChat.messageList.reduce((acc, message) => {
    const { token, ...others } = message;

    if (!acc[token]) {
      acc[token] = {
        messages: [others],
      };
    } else {
      acc[token].messages.push(others);
    }

    return acc;
  }, {});

  return messagesMap;
};

export const selectorLastMessage = (state) => {
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


export const selectorMemberChatOnline = (state) => state.memberChat.online

export const selectorMemberChatSelectorUser = (state) =>
  state.memberChat.currentUser;
