import { Dimensions, Platform } from 'react-native'

export const dayWidth = Dimensions.get('window').width * (Platform.OS === 'web' ? 0.2 : 0.56)
