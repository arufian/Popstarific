import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import  { LoginButton, AccessToken } from 'react-native-fbsdk'

export default class Login extends Component {

  loginHandler(error, result) {
    if (error) {
      alert("login has error: " + result.error);
    } else if (result.isCancelled) {
      alert("login is cancelled.");
    } else {
      this.props.loginSucceed()
      // alert('ok')
    }
  }

  render() {
    return (
      <View style={{ flex:1, justifyContent: 'center', alignItems:'center' }}>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={this.loginHandler.bind(this)}
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    )
  }

}