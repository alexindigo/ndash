import { ActionSheetIOS, Linking, Platform } from 'react-native';

export { openUrl, shareUrl };

function openUrl(url, onError) {

  const errorHandler = typeof onError == 'function' ? onError : console.error.bind(console);

  // do nothing if no url provided
  if (!url) {
    return;
  }

  Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      errorHandler('Url [' + url + '] is not supported');
    } else {
      return Linking.openURL(url);
    }
  }).catch((err) => {
    return errorHandler('An error occurred while opening url [' + url + ']:', err)
  });
}

function shareUrl(url, onError, onShare) {

  // doesn't work on Android
  // TODO: Come up with (global function) alternative
  // Or rewrite this one to be more Reacty
  if (Platform.OS != 'ios') {
    return;
  }

  const errorHandler = typeof onError == 'function' ? onError : console.error.bind(console);
  const shareHandler = typeof onShare == 'function' ? onShare : console.info.bind(console);

  ActionSheetIOS.showShareActionSheetWithOptions(
    {
      url: url
    },

    (error) => errorHandler(error),

    (completed, method) => shareHandler(completed, method)
  );
}
