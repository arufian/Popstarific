import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import  { LoginButton, AccessToken } from 'react-native-fbsdk'

export default class Login extends Component {

  loginSucceed() {
    this.props.loginSucceed()
  }

	render() {
		return (
      <View style={{ flex:1, justifyContent: 'center', alignItems:'center' }}>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    )
	}

}