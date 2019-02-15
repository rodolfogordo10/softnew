import Api from '../api';

const BASE_PATH = '/v2/system';

const CLOUDFRONT_KEY = 'cloudfront-url';

function isStorageEnabled() {
  return typeof window !== 'undefined' && window.sessionStorage;
}

/**
 * @function getCloudFrontUrl
 * @description Returns the CloudFront url of the public bucket
 * @return {String} CloudFront url to load images
 */
export function getCloudFrontUrl() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Api.get('/v2/drive/cloudfront/url/pling-public');

      if (!data) {
        throw new Error('CloudFront url not found.');
      }

      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * @function saveCloudFrontUrlToStorage
 * @description Saves the CloudFront url to the storage of the browser
 * @param  {String} url CloudFront url
 */
export function saveCloudFrontUrlToStorage(url) {
  if (!isStorageEnabled()) {
    return;
  }

  window.sessionStorage.setItem(CLOUDFRONT_KEY, url);
}

/**
 * @function getCloudFrontUrlFromStorage
 * @description Returns the CloudFront url stored in the browser storage
 * @return {String} CloudFront url
 */
export function getCloudFrontUrlFromStorage() {
  if (!isStorageEnabled()) {
    return null;
  }

  return window.sessionStorage.getItem(CLOUDFRONT_KEY);
}

// Exif orientation value to css transform mapping
// Does not include flipped orientations
const rotation = {
  1: 0,
  3: 180,
  6: 90,
  8: 270
};

function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

export function orientation(file) {
  return new Promise((resolve, reject) => {
    try {

      var fileReader = new FileReader();

      fileReader.onloadend = function() {
        var base64img = "data:"+file.type+";base64," + _arrayBufferToBase64(fileReader.result);
        var scanner = new DataView(fileReader.result);
        var idx = 0;
        var value = 1; // Non-rotated is the default
        if(fileReader.result.length < 2 || scanner.getUint16(idx) != 0xFFD8) {
          // Not a 
          const data = {
            base64img,
            rotation: rotation[value]
          };

          return resolve(data);
        }
        idx += 2;
        var maxBytes = scanner.byteLength;
        while(idx < maxBytes - 2) {
          var uint16 = scanner.getUint16(idx);
          idx += 2;
          switch(uint16) {
            case 0xFFE1: // Start of EXIF
              var exifLength = scanner.getUint16(idx);
              maxBytes = exifLength - idx;
              idx += 2;
              break;
            case 0x0112: // Orientation tag
              // Read the value, its 6 bytes further out
              // See page 102 at the following URL
              // http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
              value = scanner.getUint16(idx + 6, false);
              maxBytes = 0; // Stop scanning
              break;
          }
        }
        // Not a 
        const data = {
          base64img,
          rotation: rotation[value]
        };

        return resolve(data);
      };

      fileReader.readAsArrayBuffer(file);

    } catch (err) {
      return reject(err);
    }
  });

}

/**
 * @function getImageSrc
 * @description Read image file and return content as string
 * @param  {Object} file File object
 * @return {String} File content as string
 */
export function getImageSrc(file) {
  return new Promise((resolve, reject) => {
    try {
      const imageFileReader = new FileReader();

      imageFileReader.onload = e => resolve(e.srcElement.result);
      imageFileReader.readAsDataURL(file);
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * @function uploadFile
 * @description Send file to be stored
 * @param  {Object}   file File object
 * @param  {String}   customerId Customer ID
 * @param  {String}   credentialId Customer ID
 * @return {Promise<Object>} API Response
 */
export function uploadFile(file, customerId, credentialId, options, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();

      formData.append('file', file);
      const url = `${BASE_PATH}/contacts/${customerId}/${credentialId}/files`;

      const data = await Api.upload(url, formData, options, onProgress);

      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
}