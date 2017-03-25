import asynckit from 'asynckit';
import merge from 'deeply';

import moment from 'moment';

import Storage from './Storage';
import Api from './Api';
import Profile from './Profile';
import PackageDetails from './PackageDetails';

export default class Actions {

  static profilesDb = new Storage('profiles')
  static packagesDb = new Storage('packages')
  static appDb = new Storage('app')

  /**
   *
   */
  static batch(actions, callback) {
    // if actions is array, assume no arguments calls
    if (Array.isArray(actions)) {
      const source = actions;
      actions = {};
      source.forEach((action) => { actions[action] = []; });
    }

    asynckit.parallel(actions, (params, action, cb) => {
      params = Array.isArray(params) ? params : [params];
      this[action].apply(this, params.concat(cb));
    }, callback);
  }

  /**
   *
   */
  static requestDownloads(packageIds, callback) {

    // fetch different periods in parallel
    asynckit.parallel(['last-day', 'last-week', 'last-month'], (period, cb) => {

      Api.getDownloads(period, packageIds, (error, downloads) => {
        if (error) {
          cb(error);
          return;
        }

        const packagesToUpdate = {};

        Object.keys(downloads || {}).forEach((p) => {
          packagesToUpdate[p] = {downloads: {[period]: downloads[p]}};
        });

        cb(null, packagesToUpdate);
      });

    }, (error, results) => {
      if (error) {
        callback(error);
        return;
      }

      // merge in all the periods
      const packagesToUpdate = merge.apply(null, results);

      this.packagesDb.update(packagesToUpdate, (error, packages) => {
        if (error) {
          callback(error);
          return;
        }

        callback(null, packages);
      });
    });
  }

  /**
   *
   */
  static fetchPackageDetails(packageId, callback) {
    const packageDetails = new PackageDetails(packageId);

    packageDetails.init((error) => {
      if (error) {
        callback(error);
        return;
      }

      // fill in the blanks (0s for empty dates)
      if (packageDetails.downloads && packageDetails.downloads.counts) {
        // to keep dates in the proper order
        const counts = {};
        // start with created and iterate till today
        // weird case when package doesn't have associated publish/creations dates
        // Oct 22, 2012 when npm started to keep track of downloads
        const index = moment(packageDetails.time ? packageDetails.time.created : '2012-10-22');
        const today = moment();

        while (today.diff(index, 'day', true) > 0) {
          const indexDate = index.format('YYYY-MM-DD');

          // we might not have stats for today yet
          if (!packageDetails.downloads.counts[indexDate]) {
            counts[indexDate] = 0;
          } else {
            counts[indexDate] = packageDetails.downloads.counts[indexDate];
          }

          index.add(1, 'day');
        }

        packageDetails.downloads.counts = counts;
      }

      callback(null, {packageDetails});
    });
  }

  /**
   *
   */
  static fetchProfile(handle, callback) {
    const profile = new Profile(handle);

    profile.update((error, result) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, result);
    });
  }

  static removeProfile(profile, callback) {

    let packages = [];

    // get list of packages to remove
    if (profile.packages) {
      packages = [].concat(profile.packages.author || [], profile.packages.maintainer || []);
    }

    // remove profile and packages in parallel
    asynckit.parallel(['profiles', 'packages'], (entity, cb) => {
      const idsToRemove = (entity == 'profiles'
        ? profile.handle
        : packages
      );

      this[entity + 'Db'].delete(idsToRemove, (error, result) => {
        if (error) {
          cb(error);
          return;
        }
        cb(null, {[entity]: result});
      });
    }, (error, removed) => {
      if (error) {
        callback(error);
        return;
      }

      // merge it results
      removed = Object.assign.apply(Object, [{}].concat(removed));

      callback(null, {
        handle: removed.profiles,
        removedPackages: removed.packages || []
      });
    });
  }

  static saveCurrentProfile({handle}, callback) {
    this.appDb.update({currentProfile: handle}, (error, appData) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, appData);
    });
  }

  /**
   *
   */
  static loadApp(callback) {
    this.appDb.load(callback);
  }

  /**
   *
   */
  static loadProfiles(callback) {
    this.profilesDb.load(callback);
  }

  /**
   *
   */
  static loadPackages(callback) {
    this.packagesDb.load(callback);
  }

  /**
   *
   */
  static resetApp(callback) {
    this.packagesDb.reset((error) => {
      this.profilesDb.reset((error) => {
        this.appDb.reset((error) => {
          callback(error);
        });
      });
    });
  }

  /**
   *
   */
  static _storeProfile(profile, callback) {

  }

  /**
   *
   */
  static _storePackages(packages, callback) {

  }

  /**
   *
   */
  static _getEmail(handle, packages) {
    let email;

    // get the first matching one and be done
    Object.values(packages).find((p) => {
      return p.maintainers.find((m) => {
        if (m.username == handle) {
          email = m.email;
          return;
        }
      });
    });

    return email;
  }
}
