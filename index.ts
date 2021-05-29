import SoundPlayer from 'react-native-sound';
import React from 'react';
import { shuffleArray } from './functions';

type AudioStatusType = 'loading' | 'success' | 'error' | 'play' | 'pause' | 'next' | 'previous' | 'stop';

interface IRequestAudioHelper {
    listSounds: SoundFileType[];
    timeRate?: number; // seconds
    isLogStatus?: boolean;
    isAutoplayOnLoad?: boolean;
}

export type SoundFileType = {
    type: 'app-bundle';
    name: string;
    path: string;
    basePath: string;
    author?: string;
    album?: string;
    genre?: string;
    cover?: string;
} | {
    type: 'network';
    name: string;
    path: string;
    author?: string;
    album?: string;
    genre?: string;
    cover?: string;
} | {
    type: 'directory';
    name: string;
    path: NodeRequire;
    author?: string;
    album?: string;
    genre?: string;
    cover?: string;
};

export interface IResponseAudioHelper {
    play: () => void;
    pause: () => void;
    stop: () => void;
    next: () => void;
    previous: () => void;
    increaseTime: () => void;
    decreaseTime: () => void;
    seekToTime: (seconds: number) => void;
    setSpeed: (speed: number) => void;
    shuffle: () => void;
    loop: () => void;
    mute: () => void;
    unmute: () => void;
    setVolume: (volume: number) => void;
    playAudio: (audioIndex: number) => void;
    setListSounds: (listSounds: SoundFileType[]) => void;
    status: AudioStatusType;
    duration: number; // seconds
    currentTime: number; // seconds
    durationString: string;
    currentTimeString: string;
    currentAudioName: string;
    isDisabledButtonPlay: boolean;
    isDisabledButtonPause: boolean;
    isDisabledButtonStop: boolean;
    isDisabledButtonNext: boolean;
    isDisabledButtonPrevious: boolean;
    timeRate: number; // seconds
    speed: number;
    isShuffle: boolean;
    errorMessage: string;
    isLoop: boolean;
    isMuted: boolean;
    volume: number; // percents from 0-100
    currentIndex: number;
}

export function useAudioHelper(request: IRequestAudioHelper = {
    listSounds: [],
    isLogStatus: false,
    timeRate: 15,
    isAutoplayOnLoad: false,
}): IResponseAudioHelper {
    const [timeRate, setTimeRate] = React.useState(request.timeRate ?? 15); // seconds
    const [status, setStatus] = React.useState<AudioStatusType>('loading');
    const [errorMessage, setErrorMessage] = React.useState('');

    const [listSounds, setListSounds] = React.useState(request.listSounds);
    
    const [currentTime, setCurrentTime] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (player && status === 'play') {
                player.getCurrentTime((seconds: number) => {
                    setCurrentTime(seconds);
                })
            }
        }, 100);

        return () => clearInterval(interval);
    });

    const [speed, setSpeed] = React.useState(1);
    function changeSpeed(value: number) {
        if (player && value > 0 && value <= 2) {
            player.setSpeed(value);
            setSpeed(value);
        }
    }

    const [duration, setDuration] = React.useState(0);
    const [player, setPlayer] = React.useState<SoundPlayer>();

    function configNewPlayer({
        newPlayer,
        audioIndex,
    }: {
        newPlayer?: SoundPlayer,
        audioIndex: number,
    }) {
        if (newPlayer) {
            setIndex(audioIndex);
            newPlayer.setSpeed(speed);
            newPlayer.setCurrentTime(0);
            setDuration(newPlayer.getDuration());
            changeVolume(newPlayer, volume);
            setPlayer(newPlayer);
        }
    }

    function initPlayer(audioIndex: number) {
        return new Promise((resolve: (value?: SoundPlayer) => void) => {
            if (audioIndex >= 0 && audioIndex < listSounds.length) {
                if (player) {
                    player.release();
                }
    
                const callback = (error: Error, player?: SoundPlayer) => {
                    if (!player) {
                        resolve(undefined);
                        return;
                    }
        
                    if (error) {
                        setStatus('error');
                        setErrorMessage(error.message);
                    } else {
                        setStatus('success');
                        setErrorMessage('');
                    }
                    player.setSpeed(speed);
                    player.setCurrentTime(0);
                    setDuration(player.getDuration());
                    changeVolume(player, volume);
                    resolve(player);
                    return;
                }
                
                const currentAudio = listSounds[audioIndex];
                // If the audio is a 'require' then the second parameter must be the callback.
                let newPlayer: SoundPlayer | undefined;
                switch(currentAudio.type) {
                    default: break;
                    case 'app-bundle':
                        newPlayer = new SoundPlayer(currentAudio.path, currentAudio.basePath, (error: Error) => callback(error, newPlayer));
                        break;
                    case 'network':
                        newPlayer = new SoundPlayer(currentAudio.path, undefined, (error) => callback(error, newPlayer));
                        break;
                    case 'directory':
                        newPlayer = new SoundPlayer(currentAudio.path, (error) => callback(error, newPlayer));
                        break;
                }
                if (newPlayer) {
                    setIndex(audioIndex);
                    seekToTime(0);
                    setPlayer(newPlayer);
                }
            } else {
                resolve(undefined);
            }
        });
    }

    const [index, setIndex] = React.useState(-1);
    const [isShuffle, setIsShuffle] = React.useState(false);
    function shuffle() {
        setIsShuffle(!isShuffle);
    }

    React.useEffect(() => {
        if (request.isLogStatus === true) {
            switch(status) {
                default: break;
                case 'loading':
                    console.log('loading...');
                    break;
                case 'next':
                    console.log('next...');
                    break;
                case 'pause':
                    console.log('pause...');
                    break;
                case 'play':
                    console.log('play...');
                    break;
                case 'previous':
                    console.log('previous...');
                    break;
                case 'stop':
                    console.log('stop...');
                    break;
                case 'error':
                    console.log('error...');
                    break;
                case 'success':
                    console.log('success...');
                    break;
            }
        }
    }, [request.isLogStatus, status])

    function playComplete(isEnd: boolean) {
        if (isEnd === true) {
            if (isLoop === false) {
                next();
            } else {
                repeat();
            }
        }
    }

    function repeat() {
        setCurrentTime(0);
        play();
    }

    function playCurrentIndex(player?: SoundPlayer) {
        if (player) {
            if (isMuted === true) {
                changeVolume(player, 0);
            }
            player.play(playComplete);
            setStatus('play');
        }
    }

    function play() {
        if (!player) {
            initPlayer(index).then((result?: SoundPlayer) => {
                playCurrentIndex(result);
            }).catch(() => {});
        } else {
            playCurrentIndex(player);
        }
    }

    function pause() {
        if (player) {
            player.pause();
            setStatus('pause');
        }
    }

    function stop() {
        if (player) {
            player.stop();
            setStatus('stop');
        }
    }

    const [remainingIndices, setRemainingIndices] = React.useState([...Array(listSounds.length).keys()].filter(value => value !== index));
    React.useEffect(() => {
        setRemainingIndices(remainingIndices.filter(value => value !== index));
    }, [index]);
    
    function next() {
        if (listSounds.length > 0) {
            setStatus('next');
            
            let newIndex = -1;
            if (isShuffle === true) {
                let newRemainingIndices = shuffleArray(remainingIndices.length === 0 ? [...Array(listSounds.length).keys()].filter(value => value !== index) : remainingIndices);
                setRemainingIndices(newRemainingIndices);
                newIndex = newRemainingIndices[0] as number;
            } else {
                newIndex = (index + 1) % listSounds.length;
            }
            playAudio(newIndex);
        }
    }

    function previous() {
        if (listSounds.length > 0 && index >= 0) {
            setStatus('previous');

            let newIndex = -1;
            if (isShuffle === true) {
                let newRemainingIndices = shuffleArray(remainingIndices.length === 0 ? [...Array(listSounds.length).keys()].filter(value => value !== index) : remainingIndices);
                setRemainingIndices(newRemainingIndices);
                newIndex = newRemainingIndices[0] as number;
            } else {
                newIndex = index - 1 >= 0 ? index - 1 : listSounds.length - 1;
            }
            playAudio(newIndex);
        }
    }

    function increaseTime() {
        if (player) {
            player.getCurrentTime((seconds) => {
                if (seconds + timeRate < duration) {
                    seekToTime(seconds + timeRate)
                } else {
                    seekToTime(duration);
                }
            });
        }
    }

    function decreaseTime() {
        if (player) {
            player.getCurrentTime((seconds) => {
                if (seconds - timeRate > 0) {
                    seekToTime(seconds - timeRate);
                } else {
                    seekToTime(0);
                }
            });
        }
    }

    function seekToTime(seconds: number) {
        if (player) {
            player.setCurrentTime(seconds);
            setCurrentTime(seconds);
        }
    }

    const [isLoop, setIsLoop] = React.useState(false);
    function loop() {
        setIsLoop(!isLoop);
    }

    const [volume, setVolume] = React.useState(100); // percent
    const [previousVolume, setPreviousVolume] = React.useState(volume);
    function changeVolume(player: SoundPlayer | undefined, volume: number) {
        if (player && volume >= 0 && volume <= 100) {
            player.setVolume(volume / 100.0);
            setVolume(volume);
        }
    }


    const [isMuted, setIsMuted] = React.useState(false);
    React.useEffect(() => {
        if (volume > 0 && isMuted === true) {
            setIsMuted(false);
        }
    }, [volume]);

    function mute() {
        if (isMuted === false) {
            setIsMuted(true);
            setPreviousVolume(volume);
            changeVolume(player, 0);
        }
    }

    function unmute() {
        if (isMuted === true) {
            setIsMuted(false);
            changeVolume(player, previousVolume);
        }
    }

    function playAudio(audioIndex: number) {
        if (audioIndex !== index) {
            initPlayer(audioIndex).then((player?: SoundPlayer) => {
                if (player) {
                    playCurrentIndex(player);
                }
            }).catch(() => {});
        }
    }

    function formatTimeString(value: number) {
        return new Date(value * 1000).toISOString().substr(11, 8)
    }

    function getDurationString() {
        return formatTimeString(duration);
    }

    function getCurrentTimeString() {
        return formatTimeString(currentTime);
    }

    function getCurrentAudioName() {
        return listSounds.length > 0 && index >= 0 && index < listSounds.length ? listSounds[index].name : '';
    }

    function isDisabledButtonPlay() {
        return status === 'loading' || status === 'play';
    }

    function isDisabledButtonPause() {
        return status === 'loading' || status === 'pause' || status === 'stop';
    }

    function isDisabledButtonStop() {
        return status === 'loading' || status === 'stop';
    }

    function isDisabledButtonNext() {
        return status === 'loading' || index === listSounds.length - 1;
    }

    function isDisabledButtonPrevious() {
        return status === 'loading' || index === 0;
    }

    return {
        play: () => play(),
        pause,
        stop,
        next,
        previous,
        increaseTime,
        decreaseTime,
        seekToTime,
        setSpeed: (speed: number) => changeSpeed(speed),
        shuffle,
        loop,
        mute,
        unmute,
        setVolume: (volume: number) => changeVolume(player, volume),
        playAudio,
        status,
        duration,
        currentTime,
        durationString: getDurationString(),
        currentTimeString: getCurrentTimeString(),
        currentAudioName: getCurrentAudioName(),
        isDisabledButtonPlay: isDisabledButtonPlay(),
        isDisabledButtonPause: isDisabledButtonPause(),
        isDisabledButtonStop: isDisabledButtonStop(),
        isDisabledButtonNext: isDisabledButtonNext(),
        isDisabledButtonPrevious: isDisabledButtonPrevious(),
        timeRate,
        speed,
        isShuffle,
        errorMessage,
        isLoop,
        isMuted,
        volume,
        currentIndex: index,
        setListSounds,
    }
}