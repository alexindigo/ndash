import Storage from './Storage';
import Api from './Api';

export default class Package {

  static db = new Storage('packages');

  constructor(handle) {
    this.handle = handle;
  }
}
