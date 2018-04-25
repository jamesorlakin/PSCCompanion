import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView
} from 'react-native'

import { commonStyles } from '../commonComponents.js'
import Barcode from 'react-native-barcode-builder'

var offers = [
  {barcode: '23645745', offer: 'Quarter Pounder + Fries'},
  {barcode: '23645714', offer: 'Big Mac or Chicken + Fries'},
  {barcode: '23645776', offer: 'Double Cheeseburger + Fries'},
  {barcode: '23645752', offer: 'Fillet-O-Fish or 6 Nuggets + Fries'},
  {barcode: '23645738', offer: 'Big Mac / McChicken + Drink'}
]

export default class McDonaldsScreen extends Component {
  render () {
    return (
      <ScrollView>
        <View style={commonStyles.screenContainer}>
          <Text style={{fontSize: 30, textDecorationLine: 'underline'}}>McDonald's</Text>

          <Breaker />

          {offers.map(function (offer) {
            return <Offer offer={offer} key={offer.barcode} />
          })}

        </View>
      </ScrollView>
    )
  }
}

function Offer (props) {
  return (
    <View style={{marginTop: 20, marginBottom: 20}}>
      <Text style={{fontSize: 18}}>{props.offer.offer}</Text>
      <Barcode value={props.offer.barcode} format='EAN8' flat />
      <Breaker />
    </View>
  )
}

function Breaker () {
  return <View style={{height: 2, backgroundColor: 'gray', marginBottom: 10, marginTop: 10}} />
}
