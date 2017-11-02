// Called whenever the Wifi connection changes
import { ToastAndroid } from 'react-native'

var wifi = require('react-native-android-wifi')
var macList = require('./macs.json')

function setNotification(text) {
  ToastAndroid.show(text, ToastAndroid.SHORT)
}

function loadList() {
  var list = new Promise(function (resolve, reject) {
    wifi.reScanAndLoadWifiList(function (networks) {
      resolve(networks)
    }, function (err) {
      reject(err)
    })
  })
  return list
}

function getBSSID() {
  var bssid = new Promise(function (resolve, reject) {
    wifi.isEnabled(function (isEnabled) {
      if (isEnabled) wifi.getBSSID(function (result) {
        resolve(result)
      })
    })
  })
  return bssid
}

module.exports = async function (args) {
  /*var list = await loadList()
  setNotification(list)
  var networks = JSON.parse(list)
  networks.sort(function (a, b) {
    if (a.level < b.level) return 1
    if (a.level > b.level) return -1
    return 0
  })

  if (networks.length === 0) {
    //setNotification("None")
    return false
  }*/

  var networks = [{BSSID: await getBSSID()}];

  setNotification(JSON.stringify(networks))

  var found = false;

  Object.keys(macList).forEach(function (location) {
    if (macList[location].indexOf(networks[0].BSSID)>-1) {
      setNotification(location)
      found = true;
    }
  })

  if (!found) setNotification("No idea.")

  return true;
}
