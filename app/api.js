// A helper utility for fetching from the PSC API.
import { AsyncStorage } from 'react-native'
import randomColor from 'randomcolor'

export default async function api (path, params) {
  var tokens = await AsyncStorage.getItem('tokens')
  tokens = JSON.parse(tokens)

  if (new Date(tokens.expireTime).getTime() < Date.now()) {
    console.log('PscApi: Token expired.')
    tokens = await refreshToken()
  } else {
    console.log("PscApi: The token shouldn't need refreshing")
  }

  // Do we have params?
  if (typeof params === 'object') {
    for (var i = 0; i < params.length; i++) {
      console.log(params[i])
      path = path + (i === 0 ? '?' : '&') + params[i].key + '=' + params[i].value
    }
  }

  console.log('PscApi: Using path - ' + path)

  var data = await fetch('https://data.psc.ac.uk/api/' + path, {
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + tokens.access_token
    }
  })

  var result = await data.json()

  if (path.indexOf('timetable') > -1) {
    for (var i = 0; i < result.timetable.length; i++) {
      if (result.timetable[i].Title === 'BTEC Diploma in  IT') { result.timetable[i].Title = 'Computing & IT Diploma' }

      result.timetable[i].Color = randomColor({
        seed: result.timetable[i].Title + 'hedgehog',
        luminosity: 'bright'
      })
    }
  }

  console.log('PscApi result: ')
  console.log(result)
  return result
}

async function refreshToken () {
  var tokens = await AsyncStorage.getItem('tokens')
  tokens = JSON.parse(tokens)

  var newTokens = await fetch('https://data.psc.ac.uk/oauth/v2/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'client_id=59_5np1cw1pak8w4gss080sgkgg8sc8s4kgkgg04go0k448scckog&' +
        'client_secret=17xzzmhevw1wkcgk8000sc0kgkwossw8k8g0soo08wgg40004s&' +
        'grant_type=refresh_token&' +
        'refresh_token=' + tokens.refresh_token
  })
  newTokens = await newTokens.json()
  console.log(newTokens)
  newTokens.expireTime = new Date()
  newTokens.expireTime.setSeconds(newTokens.expireTime.getSeconds() + newTokens.expires_in)
  await AsyncStorage.setItem('tokens', JSON.stringify(newTokens))
  return newTokens
}
