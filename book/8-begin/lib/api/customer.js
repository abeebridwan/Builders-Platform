import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/customer';

export const fetchCheckoutSessionApiMethod = ({ bookId, redirectUrl }) =>
  sendRequest(`${BASE_PATH}/stripe/fetch-checkout-session`, {
    body: JSON.stringify({ bookId, redirectUrl }),
  });
