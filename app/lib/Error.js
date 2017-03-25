import { Alert } from 'react-native';

export default class Error {

  static display(error) {
    // TODO: log this
    requestAnimationFrame(() => {
      Alert.alert(
        'error',
        error,
        [
          {text: 'ok'}
        ]
      );
    });
  }
}
