import Api from '../api';

const BASE_PATH = '/v2/system';

/**
 * @function getContacts
 * @description Returns the contacts of the customer
 * @return {Promise<String>} Resolves with the contacts or rejects with the error
 */
export const getContacts = (limit, skip, options) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = {
        limit : limit,
        skip : skip
      };

      const url = `${BASE_PATH}/contacts`;

      const contacts = await Api.get(url, query, options);

      return resolve(contacts);
    } catch (err) {
      return reject(err);
    }
  });

/**
 * @function getContactsSearch
 * @description Returns the contacts of the customer
 * @return {Promise<String>} Resolves with the contacts or rejects with the error
 */
export const getContactsSearch = (limit, skip, search, options) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = {
        limit : limit,
        skip : skip,
        search : search
      };

      const url = `${BASE_PATH}/contacts`;

      const contacts = await Api.get(url, query, options);

      return resolve(contacts);
    } catch (err) {
      return reject(err);
    }
  });

/**
 * @function getContactsId
 * @description Returns the contacts of the customer
 * @return {Promise<String>} Resolves with the contacts or rejects with the error
 */
export const getContactsId = (id, options) =>
  new Promise(async (resolve, reject) => {
    try {
      const url = `${BASE_PATH}/contacts/${id}`;

      const contact = await Api.get(url, null, options);

      return resolve(contact);
    } catch (err) {
      return reject(err);
    }
  });

/**
  * @function postContactsIdHistory
  * @description Returns the contacts history of the customer
  * @return {Promise<String>} Resolves with the contacts or rejects with the error
  */
 export const postContactsIdHistory = (payload, id, options) =>
   new Promise(async (resolve, reject) => {
     try {
       const url = `${BASE_PATH}/contacts/${id}/history`;

       const data = await Api.post(url, payload, options);

      if (!data) {
        throw new Error('Post error');
      }

      return resolve(data);
     } catch (err) {
       return reject(err);
     }
   });

  /**
  * @function patchContactsId
  * @description Returns the contacts of the customer
  * @return {Promise<String>} Resolves with the contacts or rejects with the error
  */
 export const patchContactsId = (payload, id, credential_id,  options) =>
  new Promise(async (resolve, reject) => {
    try {
      const url = `${BASE_PATH}/contacts/${id}/${credential_id}`;

      const data = await Api.patch(url, payload, options);

      if (!data) {
        throw new Error('Post error');
      }

      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });

 /**
 * @function putContactsId
 * @description Returns the contacts of the customer
 * @return {Promise<String>} Resolves with the contacts or rejects with the error
 */
  export const putContactsId = (payload, id, credential_id,  options) =>
    new Promise(async (resolve, reject) => {
      try {
        const url = `${BASE_PATH}/contacts/${id}/${credential_id}`;

        const data = await Api.put(url, payload, options);

      if (!data) {
        throw new Error('Post error');
      }

      return resolve(data);
      } catch (err) {
        return reject(err);
      }
    });

  /**
   * @function getContactsIdHistory
   * @description Returns the history of the customer
   * @return {Promise<String>} Resolves with the contacts or rejects with the error
   */
  export const getContactsIdHistory = (id, limit, skip, options) =>
    new Promise(async (resolve, reject) => {
      try {
        const query = {
          limit : limit,
          skip : skip
        };

        const url = `${BASE_PATH}/contacts/${id}/history`;

        const history = await Api.get(url, query, options);

        return resolve(history);
      } catch (err) {
        return reject(err);
      }
    });
