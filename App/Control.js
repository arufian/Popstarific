import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Control extends Component {

	constructor() {
		super()
		this.state = {
			playIcon: 'play'
		}
	}

	togglePlay() {
		console.log(this.state.playIcon)
		let icon = (this.state.playIcon === 'play') ? 'pause' : 'play'
		this.setState({
			playIcon: icon
		})
		this.props.togglePlay()
	}

	previousSong() {
		this.props.playPrevious()
	}

	nextSong() {
		this.props.playNext()
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.isPlaying) {
			this.setState({
				playIcon: 'pause'
			})
		}
	}

	render() {

		return(
			<View style={styles.container}>
				<TouchableOpacity onPress={this.previousSong.bind(this)} style={styles.backward} >
					<Icon name="step-backward" size={30} color="#FFFFFF" />
				</TouchableOpacity>
				<TouchableOpacity onPress={this.togglePlay.bind(this)} >
					<Icon name={this.state.playIcon} size={30} color="#FFFFFF"/>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.nextSong.bind(this)} style={styles.forward} >
					<Icon name="step-forward" size={30} color="#FFFFFF"/>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
		backgroundColor: '#3A5B93',
		width: '100%',
		flex: 0.055,
		flexWrap: 'wrap', 
		paddingVertical: 20,
    justifyContent: 'center',
    flexDirection:'row',
	},
	backward: {
		position: 'absolute',
		left: 50,
		bottom: 20
	},
  title: {
    textAlign: 'left',
    margin: 10,
	},
  forward: {
		position: 'absolute',
		right: 50,
		bottom: 20
	},
})