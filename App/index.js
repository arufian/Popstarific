/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native'
import MusicFiles from 'react-native-get-music-files'
import Sound from 'react-native-sound'
import Song from './Song'
import Control from './Control'

export default class App extends Component {

  constructor() {
    super()
    this.state = {
      songList: null,
      isPlaying: false
    }
    this.song = null
    this.playedIndex = -1
  }

  componentDidMount() {
    Sound.setCategory('Playback', false)
    MusicFiles.get(
      (list) => {
        for (let i = list.length - 1; i >= 0; i--) {
          list[i].key =  i
          list[i].isPlaying =  false
        }
        console.log('list', list)
        this.setState({
          songList: list
        })
      },
      (error) => {
        console.log(error)
      }
    )
  }

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    )
  }

  togglePlay() {
    if(this.state.isPlaying) {
      this.song.pause()
      this.setState({
        isPlaying: false
      })
    } else {
      this.song.play()
      this.setState({
        isPlaying: true
      })
    }
  }

  playSound(song) {
    song.play((success) => {
      if (success) {
        console.log('successfully finished playing')
        song.release()
        this.setState({
          isPlaying: false
        })
      } else {
        console.log('playback failed due to audio decoding errors')
        // reset the player to its uninitialized state (android only)
        // this is the only option to recover after an error occured and use the player again
        song.reset()
        this.setState({
          isPlaying: false
        })
      }
    })
  }

  componentWillUnmount() {
    self.song.release()
  }

  playSong(path, index) {
    console.log(index, path)
    let self = this
    let songList = [...this.state.songList]
    if(this.song) {
      this.song.stop()
      songList[this.playedIndex].isPlaying = false
    }
    this.playedIndex = index
    songList[index].isPlaying = true
    this.setState({
      songList: songList
    })
    this.song = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error)
        this.setState({
          isPlaying: false
        })
        return
      }
      this.playSound(self.song)
      this.setState({
        isPlaying: true
      })
    })
  }

  playNext() {
    let songIndex = this.playedIndex + 1
    if( this.playedIndex === -1 
      || this.playedIndex + 1 === this.state.songList.length ) {
      songIndex = 0
    }
    this.playSong(this.state.songList[songIndex].path, songIndex)
  }

  playPrevious() {
    this.song.stop()
    let songIndex = this.playedIndex - 1
    if( this.playedIndex === -1 
      || this.playedIndex + 1 === this.state.songList.length ) {
      songIndex = 0
    }
    this.playSong(this.state.songList[songIndex].path, songIndex)
  }

  render() {

    return (
      <View style={{flex: 4}}>
        <FlatList
          style={{flex: 3}}
          data={this.state.songList}
          renderItem={({item}) => <Song item={item} playSong={(path) => {
            this.playSong(path, item.key)
          }} ></Song>}
          ItemSeparatorComponent={this.renderSeparator}
        />
        <Control togglePlay={this.togglePlay.bind(this)} 
          isPlaying={this.state.isPlaying} playNext={this.playNext.bind(this)} 
          playPrevious={this.playPrevious.bind(this)} />
      </View>
    )
  }
}
