import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'

export default class Haeder extends Component {

  constructor() {
    super()
  }

  render() {

    return(
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3A5B93',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: 'white'
  },
})
