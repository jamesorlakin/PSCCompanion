import { NativeModules, AsyncStorage } from 'react-native'

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

module.exports = async function (data) {
  try {
    if (!await isEnabled()) {
      return false
    }

    var notices = await fetchNotices()
    var mostRecentTitle = await AsyncStorage.getItem('noticesLatest')
    if (typeof mostRecentTitle !== 'string') {
      // We don't have any notices, so we can assume this is the first time this service has executed.
      // We'll avoid bombarding them with every notification for now by marking the first notice as the latest.
      await AsyncStorage.setItem('noticesLatest', notices[0].title)
      return true
    }

    var newNotices = []
    for (var i = 0; i < notices.length; i++) {
      var notice = notices[i]
      if (notice.title === mostRecentTitle) break
      newNotices.push(notice)
    }
    if (newNotices.length === 0) return true

    mostRecentTitle = newNotices[0].title
    await AsyncStorage.setItem('noticesLatest', mostRecentTitle)

    if (newNotices.length > 6) return // If a notice was deleted, we incorrectly assume they're all new.

    for (var i = 0; i < newNotices.length; i++) {
      var notice = newNotices[i]
      showNotification(notice.title, notice.rawText)
    }
  } catch (e) {

  }
}
