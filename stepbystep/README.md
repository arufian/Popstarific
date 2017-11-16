## Learning Facebook Masterclass Step by Step

### Join our Slack

http://bit.ly/fbmasterclasskolla
channel: #rn2ndclass

### Initialization

```ssh
react-native init <project_name>
react-native run-android
```

### Directory & App Structure, Plus Preparation

- create `App` directory under root directory
- Install Reactotron

https://github.com/infinitered/reactotron/blob/master/docs/installing.md

- install reactotron-react-native on project

`npm i --save-dev reactotron-react-native`

- connecting Reactotron to device

`adb reverse tcp:9090 tcp:9090`

- create ReactotronConfig.js under root dir with this codes inside :

```javascript
import Reactotron from 'reactotron-react-native'

Reactotron
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

  // swizzle the old one
const yeOldeConsoleLog = console.log

// make a new one
console.log  = (...args) => {
  // always call the old one, because React Native does magic swizzling too
  yeOldeConsoleLog(...args)

  // send this off to Reactotron.
  Reactotron.display({ 
    name: 'CONSOLE.LOG',
    value: args,
    preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null
  })
}
```

- create index.js under `App` directory with the codes from index.android.js or index.js

- change index.js or index.android.js file under root with these codes

```javascript
import { AppRegistry } from 'react-native'
import App from './App'
import './ReactotronConfig'

AppRegistry.registerComponent('YOUR_PROJECT_NAME', () => App)

```


### Get Music File List

- install `react-native-get-music-files`

`npm install --save react-native-get-music-files`

- linking

`react-native link react-native-get-music-files`

- check the code

- run your Reactotron app

- change codes in App/index.js

```javascript
import React, { Component } from 'react'
import {
  Text,
  View,
} from 'react-native'
import MusicFiles from 'react-native-get-music-files'

export default class App extends Component {

  componentDidMount() {
    MusicFiles.get(
      (list) => {
        console.log('list', list)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  render() {

    return (
      <View>
      </View>
    )
  }
}
```

- recompile App

```ssh
cd android && ./gradlew clean
cd ../ && react-native run-android
```

- check console log results on Reactotron

### Show list of song in View

- change codes in App/index.js


```javascript
import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
} from 'react-native'
import MusicFiles from 'react-native-get-music-files'
import Song from './Song'


export default class App extends Component {

  constructor() {
    super()
    this.state = {
      songList: null,
    }
  }

  componentDidMount() {
    MusicFiles.get(
      (list) => {
        for (let i = list.length - 1; i >= 0; i--) {
          list[i].key =  i
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

  render() {

    return (
      <View style={{flex: 4}}>
        <FlatList
          style={{flex: 3}}
          data={this.state.songList}
          renderItem={({item}) => <Song item={item} ></Song>}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    )
  }
}
```

- create App/Song.js

```javascript
import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'

export default class Song extends Component {

  render () {

    return (
      <TouchableOpacity activeOpacity={ 0.5 } style={styles.container}>
        <View style={styles.playing}>
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
```

- reload the app

### Play The Song

- install `react-native-sound`

`npm install --save react-native-sound`

- linking

`react-native link react-native-sound`

- check the linked codes

- change App/index.js

```javascript
import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
} from 'react-native'
import MusicFiles from 'react-native-get-music-files'
import Sound from 'react-native-sound'
import Song from './Song'

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
      </View>
    )
  }
}
```


- change App/Song.js

```javascript
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
```

- recompile App

```ssh
cd android && ./gradlew clean
cd ../ && react-native run-android
```

### Put the Control

- install `react-native-vector-icons`

`npm install --save react-native-vector-icons` 

- linking

`react-native link react-native-vector-icons`

- check linked codes

- change App/index.js

```javascript
import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
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

  render() {

    return (
      <View style={{flex: 4}}>
        <FlatList
          style={{flex: 3}}
          data={this.state.songList}
          renderItem={({item}) => <Song item={item} ></Song>}
          ItemSeparatorComponent={this.renderSeparator}
        />
        <Control togglePlay={this.togglePlay.bind(this)} 
          isPlaying={this.state.isPlaying} playNext={this.playNext.bind(this)} 
          playPrevious={this.playPrevious.bind(this)} />
      </View>
    )
  }
}
```

- add App/Control.js

```javascript
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
```

- recompile App

```ssh
cd android && ./gradlew clean
cd ../ && react-native run-android
```

### How to release into Google PlayStore

Follow this official link for more info

https://facebook.github.io/react-native/docs/signed-apk-android.html

- Generating a signing key

```ssh
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

- Place the my-release-key.keystore file under the android/app directory in your project folder

- Edit the file ~/.gradle/gradle.properties and add the following 

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=****
```

replace ***** with your password

- Adding signing config to your app's gradle config under `android/app/build.gradle`

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        signingConfig signingConfigs.release
    }
}
```

- Generating the release APK

```ssh
cd android && ./gradlew assembleRelease
```

- Testing the release build of your app 

```ssh
react-native run-android --variant=release
```
