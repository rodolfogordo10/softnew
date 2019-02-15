/**
 * @function getUserAgent
 * @description Returns the user agent of the request or from the navigator
 * @param  {Object} request Http request
 * @return {String} User Agent
 */
export function getUserAgent(request) {
  if (request) {
    return request.headers['user-agent'];
  } else if (typeof window !== 'undefined' && window.navigator) {
    return window.navigator.userAgent;
  }

  return '';
}
