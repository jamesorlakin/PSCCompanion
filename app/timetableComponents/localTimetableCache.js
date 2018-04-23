import { AsyncStorage } from 'react-native'
var SharedPreferences = require('react-native-shared-preferences')

module.exports = {
  saveCache: async function (timetableData) {
    timetableData.cacheTime = new Date()
    await SharedPreferences.setItem('cache_UserTimetable', JSON.stringify(timetableData))
    await AsyncStorage.setItem('cache_UserTimetable', JSON.stringify(timetableData))
    return true
  },
  getCache: async function () {
    var cached = await AsyncStorage.getItem('cache_UserTimetable')
    if (cached === null) return {timetable: []}
    cached = JSON.parse(cached)
    cached.isCached = true
    return cached
  }
}
