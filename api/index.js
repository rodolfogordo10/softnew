// Dependencies
import 'isomorphic-unfetch';

import { getLoginUrl, getAppUrl } from '../services/auth';
import { getToken } from '../utils/auth';

/**
* Constants
*/
// Default headers to call the api
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

const QUERY_SEPARATOR = '?';

const UNAUTHORIZED_STATUS = 401;

/**
* Helpers
*/

// Concats the api url with the specific endpoint
const getApiUrl = url => {
  if (url.includes('http')) {
    return url;
  }

  return `${process.env.API_URL}${url}`;
};

/**
 * @function checkApiResponse
 * @description Checks the response from the API to take the right path
 * @param  {Object} response Response of the HTTP request
 * @param  {Object} opts Options of the request
 * @return {Promise} Resolves the promise if the response is OK or rejects in case of error.
 * If the response is 401 (UNAUTHORIZED), redirect to login
 */
const checkApiResponse = (response, opts) =>
  new Promise(async (resolve, reject) => {
    if (response.ok) {
      return resolve();
    }

    if (response.status !== UNAUTHORIZED_STATUS) {
      return reject(response);
    }

    try {
      const isServer = opts && opts.res;
      const [ loginUrl, marcaUrl ] = await Promise.all([
        getLoginUrl(),
        getAppUrl(process.env.APP_NAME)
      ]);

      let callbackUrl = '';

      if (!isServer && !!window) {
        callbackUrl = window.location.href;
      } else {
        callbackUrl = marcaUrl;

        if (opts && opts.req && opts.req.url) {
          if (callbackUrl.endsWith('/')) {
            callbackUrl = callbackUrl.substring(0, callbackUrl.length - 1);
          }

          callbackUrl += opts.req.url;
        }
      }

      const urlWithCallback = loginUrl + `?callbackurl=${callbackUrl}`;

      if (opts && opts.res) {
        opts.res.redirect(302, urlWithCallback);
        opts.res.finished = true;
      } else if (typeof window !== 'undefined') {
        window.location = urlWithCallback;
      }

      return;
    } catch (err) {
      return reject(err);
    }
  });

/**
* @class Api
* @description Executes API calls
*/
export default class Api {

  static getApiUrl () {
    return process.env.API_URL;
  }

  /**
  * @function get
  * @description Executes a GET request
  * @param  {String} url URL to call
  * @param  {Object} payload Request payload to include in the query parameters
  * @param  {Object} opts Options to the api
  * @return {Promise<Object>} Response data
  */
  static get (url, payload, opts) {
    return new Promise(async (resolve, reject) => {
      const headers = {
        ...DEFAULT_HEADERS
      };

      if (opts && opts.authorization !== false) {
        if (opts.token) {
          headers.Authorization = opts.token;
        } else {
          const request = opts ? opts.req : null;
          const token = getToken(request);

          if (token) {
            headers.Authorization = token;
          }
        }
      }

      const urlParts = [ getApiUrl(url) ];

      if (payload) {
        // Verify query parameter separator
        if (!url.includes(QUERY_SEPARATOR)) {
          urlParts[0] += QUERY_SEPARATOR;
        }

        // Includes all payload properties in the query parameter
        Object.keys(payload).forEach(key => {
          if (typeof payload[key] !== 'number')
            if (!payload[key]) {
              return;
            }

          let value = payload[key];

          if (typeof value !== 'string' && typeof value !== 'number') {
            value = JSON.stringify(value);
          }

          urlParts.push(`${key}=${value}`);
        });
      }

      try {
        const data = await fetch(urlParts.join('&'), {
          method: 'GET',
          headers
        });

        await checkApiResponse(data, opts);

        return resolve(await data.json());
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
  * @function post
  * @description Executes a POST request
  * @param  {String} url URL to call
  * @param  {Object} payload Request payload
  * @return {Promise<Object>} Response data
  */
  static post (url, payload, opts) {
    return new Promise(async (resolve, reject) => {
      const headers = {
        ...DEFAULT_HEADERS
      };

      if (opts && opts.authorization !== false) {
        if (opts.token) {
          headers.Authorization = opts.token;
        } else {
          const request = opts ? opts.req : null;
          const token = getToken(request);

          if (token) {
            headers.Authorization = token;
          }
        }
      }

      try {
        const data = await fetch(getApiUrl(url), {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        await checkApiResponse(data);

        return resolve(await data.json());
      } catch (err) {
        return reject(err);
      }
    });
  }


  /**
  * @function put
  * @description Executes a PUT request
  * @param  {String} url URL to call
  * @param  {Object} payload Request payload
  * @return {Promise<Object>} Response data
  */
  static put (url, payload, opts) {
    return new Promise(async (resolve, reject) => {
      const headers = {
        ...DEFAULT_HEADERS
      };

      if (opts && opts.authorization !== false) {
        if (opts.token) {
          headers.Authorization = opts.token;
        } else {
          const request = opts ? opts.req : null;
          const token = getToken(request);

          if (token) {
            headers.Authorization = token;
          }
        }
      }

      try {
        const data = await fetch(getApiUrl(url), {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });

        await checkApiResponse(data);

        return resolve(await data.json());
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
  * @function patch
  * @description Executes a PATCH request
  * @param  {String} url URL to call
  * @param  {Object} payload Request payload
  * @return {Promise<Object>} Response data
  */
  static patch (url, payload, opts) {
    return new Promise(async (resolve, reject) => {
      const headers = {
        ...DEFAULT_HEADERS
      };

      if (opts && opts.authorization !== false) {
        if (opts.token) {
          headers.Authorization = opts.token;
        } else {
          const request = opts ? opts.req : null;
          const token = getToken(request);

          if (token) {
            headers.Authorization = token;
          }
        }
      }

      try {
        const data = await fetch(getApiUrl(url), {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload)
        });

        await checkApiResponse(data);

        return resolve(await data.json());
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
   * @function upload
   * @description Uploads files using XMLHttpRequest
   * @param  {String} url                URL to call
   * @param  {Object} formData           Form data to send to the request
   * @param  {Function} progressCallback Callback function executed on every each progress event
   * @return {Promise<Object>} Response data
  */
  static upload (url, formData, opts, progressCallback) {
    return new Promise((resolve, reject) => {
      try {
        const request = new XMLHttpRequest();
        const headers = {};

        request.addEventListener('load', function () {
          const { response } = this;
          const formattedResponse = JSON.parse(response);

          return resolve(formattedResponse);
        });

        if (opts && opts.authorization !== false) {
          if (opts.token) {
            headers.Authorization = opts.token;
          } else {
            const token = getToken(request);
  
            if (token) {
              headers.Authorization = token;
            }
          }
        }

        if (progressCallback) {
          request.upload.onprogress = event => {
            if (!event.lengthComputable) {
              return;
            }

            const { total, loaded } = event;
            const percent = (loaded / total) * 100;

            return progressCallback(Math.round(percent));
          };
        }

        request.open('POST', getApiUrl(url));
        request.setRequestHeader("Authorization", headers.Authorization);
        request.send(formData);
      } catch (err) {
        return reject(err);
      }
    });
  }

}
