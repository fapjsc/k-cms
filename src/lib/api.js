// Local Server
export const localServer = "http://10.168.192.1:6881";

// Get Headers
export const getHeaders = (token = null) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `bearer ${token}`);

  return headers;
};

//** Auth */
export const userLogin = async (loginData) => {
  const url = `${localServer}/SignApi`;
  const headers = getHeaders();

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.msg || "Login failed.");

  return data;
};

//** Order info */

export const getOrderInfo = async (orderToken) => {
  const headers = getHeaders();
  const detailApi = `/GetTxDetail.aspx`;

  const response = await fetch(detailApi, {
    method: "POST",
    headers,
    body: JSON.stringify({
      Token: orderToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.msg || "Get order info fail");

  if (data.code !== 200) throw new Error(data.msg || "access denied");

  return data.data;
};

export const getOrderHistory = async ({ beginDate, endDate }) => {
  const url = "GetTxHistory.aspx";
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      BeginDate: beginDate,
      EndDate: endDate,
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error("fetch order history api fail");
  if (data.code !== 200) throw new Error("Fail");

  return data.data;
};

export const getValidCode = async (data) => {
  const detailApi = "/GetoneTimePwd.aspx";

  const res = await fetch(detailApi, {
    method: "POST",
    body: JSON.stringify({
      reg_countrycode: data.countryCode,
      reg_tel: data.phoneNumber,
    }),
  });

  const resData = await res.json();

  if (!res.ok) throw new Error("Fail");

  if (resData.code !== 200) throw new Error("Fail");

  return resData.data;
};

export const setUpCredit = async (data) => {
  const detailApi = "/Req_UpdateAgentCredit.aspx";

  try {
    const res = await fetch(detailApi, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    return resData;
  } catch (error) {
    return error.message;
  }
};
