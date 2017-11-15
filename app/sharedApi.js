// A collection of functions for interfacing with the shared timetable service.
import { AsyncStorage } from 'react-native';
import moment from 'moment';

module.exports = {
  fetchCurrentShared: async function (pin) {
    try {
      console.log("SharedApi: Fetching current shared for " + pin);
      var path = "https://gateway.jameslakin.co.uk/psc/api/fetch?pin="
        + pin + "&startOfWeek=" + moment().startOf('day').startOf('isoweek').unix();
      console.log("SharedApi: Using path " + path);
      var request = await fetch(path);
      var sharedData = await request.json();

      AsyncStorage.setItem('cache_SharedPin_' + pin, JSON.stringify(sharedData[0]));
      return sharedData[0];
    } catch (e) {
      return this.fetchCachedShared(pin, true);
    }
  },
  updateCurrentShared: async function(timetableData) {
    var asyncData = await AsyncStorage.getItem('sharedPinAndKey')
    if (asyncData !== null) {
      console.log("Shared API: Sending update");
      var pinAndKey = JSON.parse(asyncData);
      var body = {
        publishKey: pinAndKey.publishKey,
        pin: pinAndKey.pin,
        startOfWeek: moment().startOf('day').startOf('isoweek').unix(),
        data: JSON.stringify(timetableData)
      }
      fetch("https://gateway.jameslakin.co.uk/psc/api/submit", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })

      // Horrbibly emulate the stupid amount of stringification due to the DB
      // and me screwing up how I insert JSON into it.
      body.data = JSON.stringify(body.data)
      AsyncStorage.setItem('cache_SharedPin_' + pinAndKey.pin, JSON.stringify(body));
    }
  },
  fetchCachedShared: async function (pin, avoidFallback) {
    console.log("SharedApi: Getting cache for " + pin);
    try {
      var cachedData = await AsyncStorage.getItem('cache_SharedPin_' + pin);
      if (cachedData !== null) {
        console.log("SharedApi: Attempting to return cache for " + pin);
        cachedData = JSON.parse(cachedData);
        cachedData.isCached = true;
        return cachedData;
      }
    } catch (e) {
      console.log("SharedApi: Error in fetching shared cache");
      console.log(e);
    }

    console.log("SharedApi: No cache for " + pin);
    if (avoidFallback) {
      throw "Unable to use cache"
    } else {
      return this.fetchCurrentShared(pin);
    }
  }
}
