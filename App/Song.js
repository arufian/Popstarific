import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'

export default class Song extends Component {

	onPlay() {
		this.props.playSong(this.props.item.path)
	}

	render () {

		let containerStyle = (this.props.item.isPlaying) ? styles.playing : styles.notPlaying

		return (
			<TouchableOpacity onPress={this.onPlay.bind(this)} activeOpacity={ 0.5 } style={styles.container}>
				<View style={containerStyle}>
					<View>
						<Text style={styles.title}>
							{this.props.item.author}
						</Text>
					</View>

					<View>
						<Text style={styles.author}>
							{this.props.item.title}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notPlaying: {
		backgroundColor: '#FFFFFF'
	},
	playing: {
		backgroundColor: '#EEEFF1'
	},
  title: {
    textAlign: 'left',
    margin: 10,
	},
  author: {
		fontSize: 16,
    textAlign: 'left',
    color: '#333333',
    marginLeft: 10,
    marginBottom: 10,
	},
})