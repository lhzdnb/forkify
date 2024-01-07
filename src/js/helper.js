import { TIMEOUT_SEC } from './config.js';

/**
 * Returns a promise that rejects after a specified timeout.
 * @param {number} s - The number of seconds to wait before rejecting the
 *     promise.
 * @returns {Promise} - A promise that rejects after the specified timeout.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Makes an AJAX request.
 * @param {string} url - The URL to make the request to.
 * @param {Object} [uploadData=undefined] - The data to upload as part of a
 *     POST request.
 * @returns {Promise} - A promise that resolves with the data from the
 *     response.
 * @throws {Error} - An error that occurs during the fetch or if the response
 *     is not ok.
 */
export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}
