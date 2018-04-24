import { NativeModules, AsyncStorage, ToastAndroid } from 'react-native'

import fetchNotices from './studentNoticesApi.js'

var notificationModule = NativeModules.JSNotification
function showNotification (title, message) {
  notificationModule.addNotification(title, message)
}

async function isEnabled () {
  var config = await AsyncStorage.getItem('noticesEnabled')
  if (config !== 'no') return true
  return false
}

export default async function () {
  try {
    showNotification('Service ' + new Date(), '')
    if (!await isEnabled()) {
      return false
    }

    var notices = await fetchNotices()
    var mostRecentTitle = await AsyncStorage.getItem('noticesLatest')
    ToastAndroid.show(mostRecentTitle, ToastAndroid.LONG)
    if (typeof mostRecentTitle !== 'string') {
      // We don't have any notices, so we can assume this is the first time this service has executed.
      // We'll avoid bombarding them with every notification for now by marking the first notice as the latest.
      await AsyncStorage.setItem('noticesLatest', notices[0].title)
      ToastAndroid.show(notices[0].title, ToastAndroid.LONG)
      return true
    }

    var newNotices = []
    for (var i = 0; i < notices.length; i++) {
      var notice = notices[i]
      if (notice.title === mostRecentTitle) break
      newNotices.push(notice)
    }
    if (newNotices.length === 0) return true

    mostRecentTitle = newNotices[newNotices.length - 1].title
    await AsyncStorage.setItem('noticesLatest', mostRecentTitle)

    for (var i = 0; i < newNotices.length; i++) {
      var notice = notices[i]
      showNotification(notice.title, notice.rawText)
    }
  } catch (e) {

  }
}
