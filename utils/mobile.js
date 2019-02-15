import { getUserAgent } from './browser';

/**
 * @function isMobile
 * @description Returns if the current device is mobile
 * @param  {Object} request Http request
 * @return {Boolean} Is mobile or not
 */
export function isMobile(request) {
  const userAgent = getUserAgent(request);

  return /Mobi/.test(userAgent);
}
