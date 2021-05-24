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
|Param name|Type|Description|Default value|
|---|---|---|---|
|listSounds|ISoundFile|List sounds we will play|[]|
|timeRate|number|This is used for methods __increaseTime__, __decreaseTime__ => increase or decrease current time by __timeRate__ (seconds)|15 (seconds)|
|isLogStatus|boolean|Log current status of player using __console.log__|false|
# Methods
## Play
Play current audio
```js
player.play(); // player.status='play'
```
## Pause
Pause current audio
```js
player.pause(); // player.status='pause'
```
## Stop
Stop current audio
```js
player.stop(); // player.status='stop'
```
## Next
Move to next audio
```js
player.next(); // player.status='next'
```
## Previous
Back to previous audio
```js
player.previous(); // player.status='previous'
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
## Set speed
Change player's speed
```js
player.setSpeed(1.25)
```
|Param name|Type|Description|Default value|
|---|---|---|---|
|speed|number|Change current speed to __speed__ (speed > 0.0 and speed <= 2.0)|1|
## Shuffle
Random next or previous audio index
```js
player.shuffle(); // call odd time (2n+1 time, n>0) => isShuffle=true, call even time (2n time, n>0) => isShuffle=false 
```
|Relative variable|Type|Description|Default value|
|---|---|---|---|
|isShuffle|boolean|Is shuffle or not|false|
## Loop
Loop current audio
```js
player.loop(); // call odd time (2n+1 time, n>0) => isLoop=true, call even time (2n time, n>0) => isLoop=false
```
|Relative variable|Type|Description|Default value|
|---|---|---|---|
|isLoop|boolean|Is loop current audio or not|false|
## Mute
Mute player
```js
player.mute(); // isMuted=true
```
## Unmute
```js
player.unmute() // isMuted=false
```
## Set volume
```js
player.setVolume(50); // volume=50%
```
|Param name|Type|Description|Default value|
|---|---|---|---|
|volume|number|Change current volume to __volume__ (volume >= 0% and volume <= 100%)|100%|
# Variables
|Variable name|Type|Description|Default value|
|---|---|---|---|
|status|AudioStatusType|Current player's status|'loading'|
|duration|number|Duration of current audio (seconds)||
|currentTime|number|Current time of current audio (seconds)|0|
|durationString|string|Duration string with format 'hh:mm:ss'||
|currentTimeString|string|Current time string with format 'hh:mm:ss'||
|currentAudioName|string|Current audio name|''|
|isDisabledButtonPlay|boolean|Disabled button play or not||
|isDisabledButtonPause|boolean|Disabled button pause or not||
|isDisabledButtonStop|boolean|Disabled button stop or not||
|timeRate|number|This is used for methods __increaseTime__, __decreaseTime__ => increase or decrease current time by __timeRate__ (seconds)|15 (seconds)|
|speed|number|Change current speed to __speed__ (speed > 0.0 and speed <= 2.0)|1|
|isShuffle|boolean|Is shuffle or not|false|
|isLoop|boolean|Is loop current audio or not|false|
|isMuted|boolean|Is mute player or not|false|
|volume|number|Change current volume to __volume__ (volume >= 0% and volume <= 100%)|100%|
