import { AsyncStorage } from 'react-native';

import asynckit from 'asynckit';

export default class Storage {

  /**
   * Assigns storage key (prefix)
   *
   * @param {string} key - storage prefix
   */
  constructor(key) {
    this.key = '_' + key;
  }

  /**
   *
   */
  meta(callback) {
    AsyncStorage.getItem(this.key, (error, result) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      const ids = this._decode(result, []);

      // nothing to return?
      if (!Array.isArray(ids) || !ids.length) {
        callback(null, []);
        return;
      }

      callback(null, ids);
    });
  }

  /**
   *
   */
  get(id, callback) {
    AsyncStorage.getItem(this._encodeId(id), (error, value) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      value = this._decode(value);

      callback(null, value);
    });
  }

  /**
   *
   */
  set(id, value, callback) {
    AsyncStorage.getItem(this.key, (error, result) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      const pairs = [[this._encodeId(id), this._encode(value)]];
      let ids = this._decode(result, []);

      // nothing to return?
      if (!Array.isArray(ids) || !ids.length) {
        ids = [];
      }

      if (ids.indexOf(id) == -1) {
        ids.push(id);
      }

      pairs.push([this.key, this._encode(ids)]);

      AsyncStorage.multiSet(pairs, (error) => {
        if (error) {
          // log this
          callback(error);
          return;
        }

        callback(null, value);
      });
    });
  }

  /**
   *
   */
  load(callback) {
    AsyncStorage.getItem(this.key, (error, result) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      let ids = this._decode(result, []);

      // nothing to return?
      if (!Array.isArray(ids) || !ids.length) {
        callback(null, {});
        return;
      }

      ids = ids.map((id) => this._encodeId(id));

      // get all the things!
      AsyncStorage.multiGet(ids, (error, entries) => {
        const values = {};

        if (error) {
          // log this
          callback(error);
          return;
        }

        entries.forEach((pair) => {
          values[this._decodeId(pair[0])] = this._decode(pair[1]);
        });

        // add update token to bust caches
        values['$'] = '' + Date.now() + Math.random();

        requestAnimationFrame(() => {
          callback(null, values);
        });
      });
    });
  }

  /**
   *
   */
  save(values, callback) {
    const ids = [];

    const pairs = Object.entries(values).map((pair) => {
      ids.push(pair[0]);
      pair[0] = this._encodeId(pair[0]);
      pair[1] = this._encode(pair[1]);

      return pair;
    });

    pairs.push([this.key, this._encode(ids)]);

    AsyncStorage.multiSet(pairs, (error) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      callback(null, values);
    });
  }

  /**
   *
   */
  update(values, callback) {
    this.meta((error, ids) => {

      const pairs = {Merge: [], Set: []};

      if (error) {
        // log this
        callback(error);
        return;
      }

      Object.entries(values).forEach((pair) => {
        if (ids.indexOf(pair[0]) < 0) {
          ids.push(pair[0]);
          pairs['Set'].push([this._encodeId(pair[0]), this._encode(pair[1])]);
        // only merge objects and arrays
        // not sure if it'd work with array though
        } else if (typeof pair[1] != 'object') {
          pairs['Set'].push([this._encodeId(pair[0]), this._encode(pair[1])]);
        } else {
          pairs['Merge'].push([this._encodeId(pair[0]), this._encode(pair[1])]);
        }
      });

      // reset list of ids
      pairs['Set'].push([this.key, this._encode(ids)]);

      asynckit.parallel(['Merge', 'Set'], (type, cb) => {
        requestAnimationFrame(() => {
          AsyncStorage['multi' + type](pairs[type], cb);
        });
      }, (error) => {
        if (error) {
          // log this
          callback(error);
          return;
        }

        requestAnimationFrame(() => {
          // reload all the things
          this.load(callback);
        });
      });
    });
  }

  /**
   *
   */
  delete(idsToRemove, callback) {

    // support single-value id invocation
    if (!Array.isArray(idsToRemove)) {
      this.delete([idsToRemove], (error, result) => {
        // return single-value response
        callback(error, Array.isArray(result) ? result[0] : result);
      });
      return;
    }

    AsyncStorage.getItem(this.key, (error, result) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      let ids = this._decode(result, []);
      // nothing to return?
      if (!Array.isArray(ids) || !ids.length) {
        ids = [];
      }
      // filter out removed id
      ids = ids.filter((id) => idsToRemove.indexOf(id) === -1);

      const pairs = idsToRemove.map((id) => {
        return [this._encodeId(id), this._encode(null)];
      });
      // and update index key
      pairs.push([this.key, this._encode(ids)]);

      AsyncStorage.multiSet(pairs, (error) => {
        if (error) {
          // log this
          callback(error);
          return;
        }

        callback(null, idsToRemove);
      });
    });
  }

  /**
   *
   */
  reset(callback) {
    AsyncStorage.getItem(this.key, (error, result) => {
      if (error) {
        // log this
        callback(error);
        return;
      }

      let ids = this._decode(result, []);

      // nothing to return?
      if (!Array.isArray(ids) || !ids.length) {
        ids = [];
      }

      ids = ids.map((id) => this._encodeId(id));
      ids.push(this.key);

      AsyncStorage.multiRemove(ids, (error) => {
        if (error) {
          // log this
          callback(error);
          return;
        }

        callback(null);
      });
    });
  }

  /**
   *
   */
  _encodeId(id) {
    return this.key + ':' + id;
  }

  /**
   *
   */
  _decodeId(id) {
    return id.replace(new RegExp('^' + this.key + ':'), '');
  }

  /**
   *
   */
  _encode(input) {
    let output;
    try {
      output = JSON.stringify(input);
    } catch (error) {
      // log this
      output = '';
    }

    return output;
  }

  /**
   *
   */
  _decode(input, fallback = {}) {
    let output;
    try {
      output = JSON.parse(input);
    } catch (error) {
      // log this
      return fallback;
    }

    return output;
  }
}
