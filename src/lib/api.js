// Local Server
const localServer = 'http://10.168.192.1:6881';

// Get Headers
const getHeaders = (token = null) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `bearer ${token}`);

  return headers;
};

//** Auth */
export const userLogin = async loginData => {
  const url = `${localServer}/SignApi`;
  const headers = getHeaders();

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.msg || 'Login failed.');

  return data;
};

//** Order info */

export const getOrderInfo = async orderToken => {
  const headers = getHeaders();
  const detailApi = `/GetTxDetail.aspx`;

  const response = await fetch(detailApi, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      Token: orderToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.msg || 'Get order info fail');

  if (data.code !== 200) throw new Error(data.msg || 'access denied');

  return data.data;
};
