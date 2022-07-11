export const getUserLevel = (level) => {
  switch (level) {
    case 0:
      return {
        text: "一般",
      };
    case 1:
      return {
        text: "白銀",
      };
    case 2:
      return {
        text: "白金",
      };
    case 3:
      return {
        text: "鑽石",
      };
    case 4:
      return {
        text: "黑鑽",
      };
    case 5:
      return {
        text: "無法交易",
      };

    default:
      return {
        text: "無法獲得會員等級",
      };
  }
};
