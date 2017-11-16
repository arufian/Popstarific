import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Song extends Component {

	onPlay() {
		this.props.playSong(this.props.item.path)
	}

	onShare() {
		this.props.share(this.props.item)
	}

	render () {

		let containerStyle = (this.props.item.isPlaying) ? styles.playing : styles.notPlaying

		return (
			<TouchableOpacity onPress={this.onPlay.bind(this)} activeOpacity={ 0.5 } style={styles.container}>
				<View style={containerStyle}>
					<View>
						<Text style={styles.author}>
							{this.props.item.author}
						</Text>
					</View>

					<View style={{flex: 1, flexDirection: 'row'}}>
						<Text style={styles.title}>
							{this.props.item.title}
						</Text>
						<TouchableOpacity activeOpacity={ 0.5 } style={styles.share} onPress={this.onShare.bind(this)}>
							<Icon name="share-alt" size={30} color="#3A5B93" />
						</TouchableOpacity>
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
  author: {
    textAlign: 'left',
    margin: 10,
	},
  title: {
		fontSize: 16,
    textAlign: 'left',
    color: '#333333',
    marginLeft: 10,
    marginBottom: 10,
    width: '80%'
	},
	share: {
		width: '20%',
		marginTop: -10
	}
})