import asynckit from 'asynckit';
import moment from 'moment';

import config from '../config';

export default class Api {

  static endpointPackages       = config.api.npms
  static endpointPackageDetails = config.api.npmsPackage
  static endpointDownloads      = config.api.npmjs
  static endpointRegistry       = config.api.registry

  /**
   *
   */
  static getPackageDetails(id, callback) {

    // partially escape package id o_0
    id = id.replace(/\//g, '%2F');

    const endpoints = [this.endpointRegistry, this.endpointPackageDetails];

    asynckit.parallel(endpoints, (endpoint, cb) => {
      this._request(endpoint + id, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      },
      function(error, result)
      {
        if (error || (!result.name && !result.analyzedAt)) {
          cb(error || 'unable to fetch package details for [' + id + '] package from [' + endpoint + '] endpoint');
          return;
        }

        cb(null, result);
      });
    }, (error, results) => {
      if (error) {
        callback(error);
        return;
      }

      // assume shallow merge
      const combined = Object.assign.apply(Object, [{}].concat(results));

      callback(null, combined);
    });
  }

  /**
   *
   */
  static getDownloadsByDay(packageId, from, callback) {
    // no downloads for the scoped packages
    if (packageId[0] == '@') {
      callback(null, []);
      return;
    }

    from     = moment(from).format('YYYY-MM-DD');
    const to = moment().format('YYYY-MM-DD');

    this._request(this.endpointDownloads + 'range/' + from + ':' + to + '/' + packageId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    },
    function(error, result)
    {
      if (error) {
        callback(error || 'unable to fetch package downloads by day for [' + packageId + '] package');
        return;
      }

      // nothing found, make it as empty results
      if (!result.downloads) {
        result.downloads = [];
      }


      callback(null, result.downloads);
    });
  }

  /**
   *
   */
  static getMetaAuthor(handle, callback) {
    this._request(this.endpointPackages, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      query: {
        q: 'author:' + handle,
        size: 1
      }
    },
    function(error, result)
    {
      const meta = {
        handle: handle
      };

      if (error || !result.results) {
        callback(error || 'unable to fetch packages for [' + handle + '] username');
        return;
      }

      meta.total = result.total;

      if (meta.total && result.results) {
        const email = result.results[0].package.author.email || null;
        const name = result.results[0].package.author.name || null;

        email && (meta.email = email);
        name && (meta.name = name);
      }

      callback(null, meta);
    });
  }

  /**
   *
   */
  static getMetaMaintainer(handle, callback) {
    this._request(this.endpointPackages, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      query: {
        q: 'maintainer:' + handle,
        size: 1
      }
    },
    function(error, result)
    {
      const meta = {
        handle: handle,
        total : 0,
        email : null
      };

      if (error || !result.results) {
        callback(error || 'unable to fetch packages for [' + handle + '] username');
        return;
      }

      meta.total = result.total;

      if (meta.total && result.results) {
        const maintainer = result.results[0].package.maintainers.find((o) => o.username == handle);
        (maintainer && maintainer.email) && (meta.email = maintainer.email);
      }

      callback(null, meta);
    });
  }

  /**
   *
   */
  static getDownloads(type, packageIds, callback) {

    // skip scoped packages, since api doesn't return data for them anyway
    packageIds = packageIds.filter((pkg) => pkg[0] != '@');

    this._fetchDownloads(type, packageIds, {}, (error, response) => {

      const downloads = {};

      if (error) {
        callback(error);
        return;
      }

      // adjust for inconsistences of the downloads api
      // when it's single result, package name is omitted
      const results = packageIds.length == 1 ? {[packageIds[0]]: response.results} : response.results;

      packageIds.forEach((p) => {
        downloads[p] = {
          downloads: results[p] ? results[p].downloads : 0,
          date: moment().format()
        };
      });

      callback(null, downloads);
    });
  }

  /**
   *
   */
  static getPackages(handle, callback)
  {
    this._fetchPackages(handle, {}, (error, response) => {

      const packages = {total: 0, author: {}, maintainer: {}};

      if (error) {
        callback(error);
        return;
      }

      packages.total = response.total;

      response.results.forEach((p) => {
        // it's always maintainer
        packages.maintainer[p.package.name] = p.package;

        if (p.package.author && p.package.author.username == handle) {
          packages.author[p.package.name] = p.package;
        }
      });

      callback(null, packages);
    });
  }

  static _fetchDownloads(type, ids, accumulator, callback) {

    if (!accumulator.total) {
      accumulator.results = {};
      accumulator.total = ids.length;
      // untangled `ids`
      ids = ids.concat();
    }

    if (!ids.length)
    {
      callback(null, accumulator);
      return;
    }

    const idsToFetch = ids.splice(0, 100);
    const uri = this.endpointDownloads + 'point/' + type + '/' + idsToFetch.map((p) => encodeURIComponent(p)).join(',');

    this._request(uri,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    },
    (error, result) => {

      if (error || !Object.keys(result).length) {
        callback(error || 'unable to fetch downloads for [' + idsToFetch.join(',') + '] packages');
        return;
      }

      accumulator.results = {...accumulator.results, ...result};

      this._fetchDownloads(type, ids, accumulator, callback);
    });
  }

  static _fetchPackages(handle, accumulator, callback) {

    if (accumulator.results && accumulator.results.length >= accumulator.total)
    {
      callback(null, accumulator);
      return;
    }

    this._request(this.endpointPackages,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      query: {
        q: 'maintainer:' + handle,
        from: accumulator.results ? accumulator.results.length : 0,
        size: 200
      }
    },
    (error, result) => {

      if (error || !result.results || !result.results.length) {
        callback(error || 'unable to fetch packages for [' + handle + '] username');
        return;
      }

      accumulator.total = result.total;
      accumulator.results = (accumulator.results || []).concat(result.results);

      this._fetchPackages(handle, accumulator, callback);
    });
  }

  static _request(uri, options = {}, callback) {

    if (typeof options == 'function') {
      callback = options;
      options  = {};
    }

    // handle query params manually
    if (options.query) {
      uri = uri + '?' + this._encodeQS(options.query);
      delete options.query;
    }

    fetch(uri, options)
      .then((response) => response.json())
      .then((responseJson) => {
        setTimeout(() => {
          callback(null, responseJson);
        }, 0)

        return responseJson;
      })
      .catch((error) => {
        setTimeout(() => {
          callback(error);
        }, 0)
      });
  }

  static _encodeQS(query) {
    return Object.keys(query).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
    }).join('&');
  }
}
