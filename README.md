# React native audio helper
A library for audio application.
# Installation
## Install react-native-sound
Link: https://github.com/zmxv/react-native-sound
```
npm install react-native-sound --save
react-native link react-native-sound
```
## Install react-native-audio-helper
```
npm install react-native-audio-helper --save
```
# Usage
```js
import SoundPlayer from 'react-native-sound';
import { useAudioHelper } from './helpers/audio-helper';

function App() {
    const player = useAudioHelper({
        listSounds: [
            { path: 'blue_dream_cheel.mp3', name: 'Blue Dream - Cheel', basePath: SoundPlayer.MAIN_BUNDLE },
            { path: 'know_myself_patrick_patrikios.mp3', name: 'Know Myself - Patrick Patrikios', basePath: SoundPlayer.MAIN_BUNDLE },
            { path: require('./sounds/Play-Doh-meets-Dora_Carmen-Maria-and-Edu-Espinal.mp3'), name: 'Play Doh meets Dora - Carmen Maria and Edu Espinal', isRequired: true, },
            { path: 'https://raw.githubusercontent.com/uit2712/RNPlaySound/develop/sounds/Tropic%20-%20Anno%20Domini%20Beats.mp3', name: 'Tropic - Anno Domini Beats', },
        ],
        timeRate: 15,
        isLogStatus: true,
    });
    ...
}
```
|Param name|Type|Description|
|---|---|---|
|listSounds|ISoundFile|List sounds we will play|
|timeRate|number|This is used for methods __increaseTime__, __decreaseTime__ => increase or decrease current time by __timeRate__ (seconds)|
|isLogStatus|boolean|Log current status of player using __console.log__|
# Methods
## Play
Play current audio
```js
player.play();
```
## Pause
Pause current audio
```js
player.pause();
```
## Stop
Stop current audio
```js
player.stop();
```
## Next
Move to next audio
```js
player.next();
```
## Previous
Back to previous audio
```js
player.previous();
```
## Increase time
Increase current time to next __timeRate__ (seconds)
```js
player.increaseTime();
```
## Decrease time
Decrease current time to previous __timeRate__ (seconds)
```js
player.decreaseTime();
```
## Seek to time
Change current time
```js
player.seekToTime(15);
```
|Param name|Type|Description|
|---|---|---|
|seconds|number|Change current time to __seconds__|
