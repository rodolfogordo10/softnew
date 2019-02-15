import { getUserAgent } from '../utils/request';

/**
 * @class Mobile
 * @description Represents Mobile stuff
 */
export default class Mobile {

  /**
   * @function isMobile
   * @description Returns if the current device is mobile
   * @param  {Object} request Http request
   * @return {Boolean} Is mobile or not
   */
  static isMobile (request) {
    const userAgent = getUserAgent(request);

    return /Mobi/.test(userAgent);
  }

  /**
   * @function isMobile
   * @description Returns if the current device is iPhone iOS 9
   * @param  {Object} request Http request
   * @return {Boolean} Is mobile or not
   */
  static isMacNine (request) {
    const userAgent = getUserAgent(request);

    return /iphone.*9_.*mac/i.test(userAgent);
  }
}
