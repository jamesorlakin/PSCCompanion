// A headless JS task run by Android to update the timetable in the background.
import {
  AsyncStorage,
  ToastAndroid
} from 'react-native';

import moment from 'moment'
import api from './api.js'
import sharedApi from './sharedApi.js'
import localTimetableCache from './timetableComponents/localTimetableCache.js'

module.exports = async function (data) {
  try {
    var timetableData = await api('timetable', [
      {key: "includeBlanks", value: "false"},
      {key: "start", value: moment().startOf('day').startOf('isoweek').unix()},
      {key: "end", value: moment().endOf('day').endOf('isoweek').unix()}
    ])

    await sharedApi.updateCurrentShared(timetableData)
    await localTimetableCache.saveCache(timetableData)
    ToastAndroid.show('PSC Companion - Timetable refreshed', ToastAndroid.LONG)
  } catch (e) {
    ToastAndroid.show('Error PSC Companion - ' + e, ToastAndroid.LONG)
  }
  return true;
}
