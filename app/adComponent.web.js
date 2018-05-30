import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage
} from 'react-native'

export default class BannerAd extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      adFree: false,
      error: null
    }
    this.bannerError = this.bannerError.bind(this)
  }

  componentDidMount () {
    var self = this
    AsyncStorage.getItem('adFree').then(function (data) {
      var adFree = false;
      (data === 'true' ? adFree = true : adFree = false)
      self.setState({
        loaded: true,
        adFree: adFree
      })
    })
  }

  bannerError (data) {
    this.setState({error: data})
  }

  render () {
    if (this.state.error) return (<View />)
    // if (this.state.error) return (<Text>{this.state.error}</Text>)

    if (!this.state.loaded) return (<View />)

    if (!this.state.adFree) {
      return (
        <Text>Ad free!</Text>
      )
    }

    return (<View />)
  }
}
