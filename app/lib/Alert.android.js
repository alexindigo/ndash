import { Alert } from 'react-native';
import androidPrompt from 'react-native-prompt-android';

export default class Api {

  static alert(title, message, controls) {
    Alert.alert(title, message, controls);
  }

  static prompt(title, message, controls) {
    androidPrompt(title, message, controls);
  }
}
