import asynckit from 'asynckit';
import moment from 'moment';

import Storage from './Storage';
import Api from './Api';
import Package from './Package';

export default class Profile {

  static db = new Storage('profiles');

  constructor(handle) {
    this.handle     = handle;
    this.email      = null;
    this.name       = null;
    this.author     = 0;
    this.maintainer = 0;
    this.updated    = null;
    this.packages   = {
      author    : [],
      maintainer: []
    };
  }

  /**
   *
   */
  init(callback) {
    Profile.db.get(this.handle, (error, profile) => {
      if (error) {
        // log
        callback(error);
        return;
      }

      if (!profile) {
        this.update((error) => {
          if (error) {
            // log
            callback(error);
            return;
          }

          callback(null);
        });
        return;
      }

      this._restore(profile);

      callback(null);
    });
  }

  /**
   *
   */
  update(callback) {
    const queue = {author: 'Author', maintainer: 'Maintainer'};

    asynckit.parallel(queue, (type, cb) => {
      Api['getMeta' + type](this.handle, (error, meta) => {
        if (error) {
          // log
          cb(error);
          return;
        }

        cb(null, meta);
      });
    }, (error, meta) => {
      let profile;

      if (error) {
        // log
        callback(error);
        return;
      }

      // don't need authors with no packages
      if (!meta.author.total && !meta.maintainer.total) {
        callback('profile [' + this.handle + '] has no packages on npm');
        return;
      }

      profile = {
        ...meta.maintainer,
        ...meta.author,
        author: meta.author.total,
        maintainer: meta.maintainer.total,
        date: moment().format()
      };

      this._restore(profile);

      this.updatePackages((error, packages) => {
        if (error) {
          // log
          callback(error);
          return;
        }

        this.save((error) => {
          if (error) {
            // log
            callback(error);
            return;
          }

          callback(null, {profile: this, packages});
        });

      });
    });
  }

  updatePackages(callback) {
    Api.getPackages(this.handle, (error, packages) => {
      if (error) {
        // log
        callback(error);
        return;
      }

      // store list of packages
      this.packages.author = Object.keys(packages.author);
      this.packages.maintainer = Object.keys(packages.maintainer);

      // refresh totals
      this.author = this.packages.author.length;
      this.maintainer = this.packages.maintainer.length;

      // expect to have all the author modules within maintainer
      // so save only maintainer packages
      Package.db.update(packages.maintainer, callback);
    });
  }

  save(callback) {
    Profile.db.set(this.handle, this, (error) => {
      if (error) {
        // log
        callback(error);
        return;
      }

      callback(null);
    });

  }

  _restore(profile) {
    this.email      = profile.email || this.email;
    this.name       = profile.name || this.name;
    this.author     = profile.author || this.author;
    this.maintainer = profile.maintainer || this.maintainer;
    this.packages   = profile.packages || this.packages;
    this.date       = profile.date || this.date;
  }
};
