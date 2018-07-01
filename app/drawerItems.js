import { StackNavigator } from 'react-navigation'

import WelcomeScreen from './screens/welcome.js'
import FreeRoomScreen from './screens/freeroom.js'
import UserTimetableScreen from './screens/userTimetable.js'
import RoomTimetableScreen from './screens/roomTimetable.js'
import SharedTimetableScreen from './screens/sharedTimetable.js'
import StudentNoticesScreen from './screens/notices.js'
//import MapScreen from './screens/map.js'
import IntranetScreen from './screens/intranet.js'
import SettingsScreen from './screens/settings.js'
import AboutScreen from './screens/about.js'

import McDonaldsScreen from './screens/mcDonalds.js'
import GrimeScreen from './screens/grime.js'

import AsyncMan from './asyncman/index'

// There's a couple of easter eggs within the welcome screen.
const WelcomeNavigator = StackNavigator({
  welcome: {screen: WelcomeScreen, path: 'welcome'},
  grime: {screen: GrimeScreen, path: 'grime'},
  mcDonalds: {screen: McDonaldsScreen}
}, {
  headerMode: 'none',
  cardStyle: {
    flex: 1
  }
})

const screens = {
  welcome: {screen: WelcomeNavigator},
  freeroom: {screen: FreeRoomScreen},
  userTimetable: {screen: UserTimetableScreen},
  roomTimetable: {screen: RoomTimetableScreen},
  sharedTimetable: {screen: SharedTimetableScreen},
  notices: {screen: StudentNoticesScreen},
//  map: {screen: MapScreen},
  intranet: {screen: IntranetScreen},
  settings: {screen: SettingsScreen},
  about: {screen: AboutScreen}
}

if (__DEV__) screens.asyncMan = {screen: AsyncMan}

export default screens
