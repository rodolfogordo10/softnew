import Cookies from 'js-cookie';

const TOKEN_IDENTIFIER = 'PLING-TOKEN';
const PLING_NAME = 'pling';
const PLING_DOMAIN = '.pling.net.br';
const UNDEFINED_STRING = 'undefined';

/**
 * @function isStorageEnabled
 * @description Returns if it's possible to use the storage
 * @return {Boolean} Is it possible to use the storage
 */
export const isStorageEnabled = () => typeof window !== UNDEFINED_STRING && window.localStorage;

/**
 * @function isCookieEnabled
 * @description Returns if it's possible to use cookies
 * @return {Boolean} Is is possible to use cookies
 */
const isCookieEnabled = () => typeof navigator !== UNDEFINED_STRING && navigator.cookieEnabled;

/**
 * @function saveToken
 * @description Saves the user's token to the storage
 * @param  {String} token User's token
 */
export const saveToken = token => {
  if (isStorageEnabled()) {
    localStorage.setItem(TOKEN_IDENTIFIER, token);
  }

  if (isCookieEnabled()) {
    const cookieOptions = {
      expires: 365
    };

    if (location.host.includes(PLING_NAME)) {
      cookieOptions.domain = PLING_DOMAIN;
    }

    Cookies.set(TOKEN_IDENTIFIER, token, cookieOptions);
  }
};

/**
 * @function getToken
 * @description Returns the saved token
 * @param  {Object} request Request HTTP object
 * @return {String} Token
 */
export const getToken = request => {
  if (request && request.cookies) {

    // Verify in the request
    // Verify if the token exists
    if (Object.keys(request.cookies).includes(TOKEN_IDENTIFIER)) {
      return request.cookies[TOKEN_IDENTIFIER];
    }
  }

  // Verify cookies in the client
  if (isCookieEnabled()) {
    const cookie = Cookies.get(TOKEN_IDENTIFIER);

    if (cookie) {
      return cookie;
    }
  }

  // Verify localStorage
  if (isStorageEnabled()) {
    const token = localStorage.getItem(TOKEN_IDENTIFIER);

    if (token) {
      return token;
    }
  }

  return null;
};

/**
 * @function clearStorage
 * @description Clears the storage of the token
 */
export const clearStorage = () => {
  if (isStorageEnabled()) {
    localStorage.clear();
  }

  if (isCookieEnabled()) {
    const cookieOptions = {};

    if (location.host.includes(PLING_NAME)) {
      cookieOptions.domain = PLING_DOMAIN;
    }

    Cookies.remove(TOKEN_IDENTIFIER);
  }
};