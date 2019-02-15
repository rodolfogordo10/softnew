import Api from '../api';

const getCepEndpoint = cep => `https://viacep.com.br/ws/${cep}/json/`;

/**
 * @function cep
 * @param  {String} cep Cep to search for
 * @return {Object} Informations of the cep
 */
export const searchCep = cep =>
  new Promise(async (resolve, reject) => {
    const transformedCep = cep.replace(/\D/g, '');

    if (transformedCep.length < 8) {
      return reject(false);
    }

    try {
      const serviceUrl = getCepEndpoint(transformedCep);
      const cepData = await Api.get(serviceUrl, null, { authorization: false });

      if (cepData.erro) {
        return reject(cepData.erro);
      }

      const responseData = {
        address: cepData.logradouro || '',
        neighborhood: cepData.bairro || '',
        state: cepData.uf || '',
        city: cepData.localidade || ''
      };

      return resolve(responseData);
    } catch (err) {
      return reject(err);
    }
  });
