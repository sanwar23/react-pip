import _ from 'lodash';
import request from 'request';
import logger from '../app/common/logger';

class Request {
  constructor(uribase, defaultheaders) {
    this.base = uribase;
    this.headers = defaultheaders;
  }

  get(uri, query, headers) {
    return new Promise((resolve, reject) => {
      const rq = this._prepareRequest('GET', uri, query, headers, true);
      logger.info(`Fetching: ${uri}?${this._getQueryString(query)}`);
      this._call(rq, resolve, reject);
    });
  }

  post(uri, body, query, headers) {
    return new Promise((resolve, reject) => {
      const rq = this._prepareRequest('POST', uri, query, headers, body);
      this._call(rq, resolve, reject);
    });
  }

  postall(uri, body, query, headers) {
    return new Promise.all((resolve, reject) => {
      const rq = this._prepareRequest('POST', uri, query, headers, body);
      this._call(rq, resolve, reject);
    });
  }

  put(uri, body, query, headers) {
    return new Promise((resolve, reject) => {
      const rq = this._prepareRequest('PUT', uri, query, headers, body);
      this._call(rq, resolve, reject);
    });
  }

  patch(uri, body, query, headers) {
    return new Promise((resolve, reject) => {
      const rq = this._prepareRequest('PATCH', uri, query, headers, body);
      this._call(rq, resolve, reject);
    });
  }

  delete(uri, query, headers) {
    return new Promise((resolve, reject) => {
      const rq = this._prepareRequest('DELETE', uri, query, headers, true);
      this._call(rq, resolve, reject);
    });
  }

  _prepareRequest(method, uri = {}, query = {}, heads = {}, json) {
    const url = this._getURL(uri, query);
    const headers = this._getHeaders(heads);
    const requestObj = { method, url, headers };
    const body =
      headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ? { form: json }
        : { json: json };
    Object.assign(requestObj, body);
    return requestObj;
  }

  _getHeaders(headers) {
    return _.extend(headers, this.headers);
  }

  _getURL(uri, query) {
    return `${this.base}${uri}?${this._getQueryString(query)}`;
  }

  _getQueryString(options) {
    return _.map(
      options,
      (value, key) => `${key}=${encodeURIComponent(value)}`
    ).join('&');
  }

  _call(rq, resolve, reject) {
    request(rq, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (Math.floor(response.statusCode / 100) !== 2) {
        return reject(body);
      }
      return resolve({ body, statusCode: response.statusCode });
    });
  }
}

module.exports = Request;
