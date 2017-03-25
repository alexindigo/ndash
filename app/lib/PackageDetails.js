import moment from 'moment';

import Storage from './Storage';
import Api from './Api';

export default class PackageDetails {

  static db = new Storage('package_details');

  constructor(id) {
    this.id = id;
    this.downloads = {};
  }

  /**
   *
   */
  init(callback) {
    PackageDetails.db.get(this.id, (error, details) => {
      if (error) {
        // log
        callback(error);
        return;
      }

      // found something locally
      if (details && details.date) {
        const lastDate = moment(details.date);
        const today    = moment();

        // restore data from db
        this._restore(details);

        // if fresh return right away
        if (today.diff(lastDate, 'hour', true) <= 1) {
          callback(null);
          return;
        }
      }

      // fetching stuff
      this.update((error) => {
        if (error) {
          // log
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
  update(callback) {
    Api.getPackageDetails(this.id, (error, registryData) => {
      if (error) {
        // log
        callback(error);
        return;
      }

      // remove extra load
      if (registryData.versions && registryData['dist-tags'] && registryData['dist-tags'].latest && registryData.versions[registryData['dist-tags'].latest]) {
        registryData.latestVersion = registryData.versions[registryData['dist-tags'].latest];
        registryData.releasesCount = Object.keys(registryData.versions).length;
        delete registryData.versions;
      }

      const details = {
        ...registryData,
        date: moment().format()
      };

      // normalize data
      details.license = details.license || (details.collected && details.collected.metadata && details.collected.metadata.license) || null;

      this._restore(details);

      this.updateDownloads((error) => {
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

          callback(null);
        });

      });
    });
  }

  /**
   *
   */
  updateDownloads(callback) {

    const downloadsTotal = 0;

    const today = moment();
    // weird case when package doesn't have associated publish/creations dates
    // Oct 22, 2012 when npm started to keep track of downloads
    let updateDate = moment(this.time ? this.time.created : '2012-10-22');

    if (this.downloads && this.downloads.updated) {
      updateDate = moment(this.downloads.updated);

      // short cut if today's downloads are found
      if (today.diff(updateDate, 'hour', true) < 1) {
        callback(null);
        return;
      }
    }

    // fetch new download counts
    Api.getDownloadsByDay(this.id, updateDate, (error, downloads) => {

      let lastYearCount = 0;
      const today = moment();

      if (error) {
        // log
        callback(error);
        return;
      }

      // make sure we have object
      this.downloads.counts = this.downloads.counts || {};

      // iterate over all dates and "fill in the blanks"
      (downloads || []).forEach((el) => {
        this.downloads.counts[el.day] = el.downloads;
      });

      // calculate total downloads
      this.downloads.total = Object.entries(this.downloads.counts).reduce((total, item) => {
        // also calculate last year downloads
        if (today.diff(moment(item[0]), 'year', true) <= 1) {
          lastYearCount += item[1];
        }

        return total + item[1];
      }, 0);

      // update last year count
      this.downloads['last-year'] = lastYearCount;
      // keep `updated` up to date
      this.downloads.updated = today.format();

      callback(null);
    });
  }

  /**
   *
   */
  save(callback) {
    PackageDetails.db.set(this.id, this, (error) => {
      if (error) {
        // log
        callback(error);
        return;
      }

      callback(null);
    });

  }

  /**
   *
   */
  _restore(pkg) {
    // registry
    this.description = pkg.description || this.description;
//    this.versions    = pkg.versions || this.versions;
    this.maintainers = pkg.maintainers || this.maintainers;
    this.time        = pkg.time || this.time;
    this.author      = pkg.author || this.author;
    this.repository  = pkg.repository || this.repository;
    this.users       = pkg.users || this.users;
    this.readme      = pkg.readme || this.readme;
    this.homepage    = pkg.homepage || this.homepage;
    this.bugs        = pkg.bugs || this.bugs;
    this.license     = pkg.license || this.license;

    // npms.io / package
    this.analyzedAt  = pkg.analyzedAt || this.analyzedAt;
    this.collected   = pkg.collected || this.collected;
    this.evaluation  = pkg.evaluation || this.evaluation;
    this.score       = pkg.score || this.score;

    // computed
    this.date        = pkg.date || this.date;
    this.downloads   = pkg.downloads || this.downloads;

    // "normalized"
    this.latestVersion = pkg.latestVersion || this.latestVersion;
    this.releasesCount = pkg.releasesCount || this.releasesCount;

  }
}
