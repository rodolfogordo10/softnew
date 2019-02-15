import Api from '../api';

/**
 * @function getLoginUrl
 * @description Returns the url of the login
 * @return {String} Url of the login app
 */
export const getLoginUrl = callbackUrl =>
  new Promise(async (resolve, reject) => {
    const nodeEnv = process.env.NODE_ENV;

    try {

      const data = await Api.get(`/v1/accounts/products/Login/${nodeEnv}`);

      if (!data.callbackUrl) {
        throw new Error('Login application not found.');
      }

      let url = data.callbackUrl;

      if (callbackUrl) {
        url += `?callbackurl=${callbackUrl}`;
      }

      return resolve(url);
    } catch (err) {
      return reject(err);
    }
  });

/**
 * @function getAppUrl
 * @param  {String} app App name to find the url
 * @return {Promise<String>} App url
 */
export const getAppUrl = app =>
  new Promise(async (resolve, reject) => {
    const nodeEnv = process.env.NODE_ENV;

    try {
      const data = await Api.get(`/v1/accounts/products/${app}/${nodeEnv}/${app}`);

      if (!data || !data.callbackUrl) {
        throw new Error('Application not found.');
      }

      return resolve(data.callbackUrl);
    } catch (err) {
      return reject(err);
    }
  });


/**
  * @function createToken
  * @description Creates a new token to the credential that owns the ticket
  * @param  {String} ticketId Identifier of the ticket to generate the token
  * @return {Promise<String>} Created token
  */
export const createToken = ticketId =>
  new Promise(async (resolve, reject) => {
    try {
      const payload = {
        ticketId
      };

      const response = await Api.get(`/v2/credentials/token`, payload, { authorization: false });

      if (!response || !response.data) {
        throw new Error('Get error');
      }

      const { data: { token } } = response;

      return resolve(token);
    } catch (err) {
      return reject(err);
    }
  });

/**
 * @function logout
 * @return {Promise<String>} API Response
 */
export const logout = () =>
  new Promise(async (resolve, reject) => {
    try {
      const data = await Api.post(`/v1/accounts/logout`, {}, { authorization: true });

      if (!data) {
        throw new Error('Post error');
      }

      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });

/**
 * @function whoami
 * @description Returns who is the user with the given token
 * @param  {String} token User's token
 * @return {Object} User informations
 */
export const whoami = token =>
  new Promise(async (resolve, reject) => {
    try {
      const data = await Api.get('/v2/credentials/me', null, { token });

      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });

/**
 * @function verifyEmailExistence
 * @description Verify email existence, validity and quality
 * @return {Promise<Object>} Is valid
 */
export const verifyEmailExistence = email => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Api.get(
        `/v1/accounts/emails/verify/${email.toLowerCase().trim()}`
      );

      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
};