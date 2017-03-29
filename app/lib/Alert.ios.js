import { Alert, AlertIOS } from 'react-native';

export default class Api {

  static alert(title, message, controls) {
    Alert.alert(title, message, controls);
  }

  static prompt(title, message, controls) {
    AlertIOS.prompt(title, message, controls);
  }
}
