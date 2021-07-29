import React from 'react';
import { Slider, Box, Button, NativeBaseProvider, Text, Progress} from 'native-base';
import AppBar from './components/AppBar';
import { useKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av';
import { Image } from 'react-native';

const imgStandby = require('./assets/people_standby.jpg');
const imgHappy = require('./assets/people_happy.jpg');
const imgWork = require('./assets/people_work.jpg');

const ActionType = {
  ONWORK: "ONWORK",
  ONREST: "ONREST",
  ONSLEEP: "ONSLEEP"
}

const SongStatus = {
  STOP: "STOP",
  PLAY: "PLAY",
  PLAY_AGAIN: "PLAY_AGAIN"
}
const iteration = 30 // minutes

export default function App() {
  const [startWork, setStartWork] = React.useState<Date | null>(null)
  const [workDuration, setWorkDuration] = React.useState(20)
  const [actionType, setActionType] = React.useState(ActionType.ONSLEEP)
  const [confirmWork, setConfirmWork] = React.useState(false)
  const [clock, setClock] = React.useState(0)
  const [workSong, setWorkSong] = React.useState<Audio.Sound>();
  const [restSong, setRestSong] = React.useState<Audio.Sound>();

  useKeepAwake()

  function onClickStartWork(){
    setActionType(ActionType.ONWORK)
    setStartWork(new Date())
    setConfirmWork(true)
  }

  function onClickStopWork(){
    setActionType(ActionType.ONSLEEP)
    setStartWork(null)
    setConfirmWork(false)
    stopAllSong()
  }

  async function loadAudio(){
    const { sound } = await Audio.Sound.createAsync(
      require('./songs/hall_of_fame.mp3')
    );
    setWorkSong(sound);
    const restSound = await Audio.Sound.createAsync(
      require('./songs/rude_magic_remix.mp3')
    );
    setRestSong(restSound.sound);
  }

  React.useEffect(() => {
    loadAudio()
  },[])

  const duration = startWork ? Math.floor(Math.abs(startWork.getTime() - new Date().getTime())/1000) : 0

  const startAt = startWork ? startWork.getHours() + ":" + startWork.getMinutes() : 0

  const durationInIterate = Math.floor(duration) % iteration

  function playSong(song: Audio.Sound){
    song.playAsync()
  }

  function stopAllSong(){
    workSong?.stopAsync()
    restSong?.stopAsync()
  }

  // when duration reached, start song
  React.useEffect(() => {
    if(startWork) {
      if(actionType === ActionType.ONWORK && durationInIterate === workDuration && restSong){
        stopAllSong()
        setActionType(ActionType.ONREST)
        setConfirmWork(false)
        playSong(restSong)
      }
      else if(actionType === ActionType.ONREST && durationInIterate === 0 && workSong){
        stopAllSong()
        setActionType(ActionType.ONWORK)
        setConfirmWork(false)
        playSong(workSong)
      }
    }
  },[clock])

  // run clock
  React.useEffect(() => {
    setInterval(() => {
      setClock(new Date().getTime())
    })
  }, [])

  function onClickConfirmWork(){
    setConfirmWork(true)
    stopAllSong()
  }

  const confirmWorkButton = (actionType === ActionType.ONSLEEP) ?
    <Text textAlign="center" fontSize="xl">START YOUR WORK FIRST</Text> :
    (confirmWork ? 
      <><Text textAlign="center">Great!!!</Text>
      <Text textAlign="center" fontSize="xl" style={{paddingTop:10,paddingBottom:10}}>KEEP YOUR SPIRIT!!! :D</Text></> : 
      <><Text textAlign="center">Are you working/rest?</Text>
      <Button onPress={onClickConfirmWork}>YES</Button></>)

  return (
    <NativeBaseProvider>
      <AppBar />
      <Box flexDir="row" p={5} flex={1}>
        <Box p={2}>
          <Box flexDir="row">
            <Text>Work {workDuration} minutes</Text>
            <Box>
              <Slider
                defaultValue={workDuration}
                minValue={0}
                maxValue={iteration}
                step={1}
                onChange={setWorkDuration}
                isDisabled={startWork !== null}
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
            </Box>
            <Text>Rest {iteration - workDuration} minutes</Text>
          </Box>
        </Box>
        {
          startWork ?
          <Button onPress={onClickStopWork}>STOP WORK</Button>:
          <Button onPress={onClickStartWork}>START WORK</Button>
        }
        <Box p={5}>
        <Text fontSize="2xl" textAlign="center">{actionType}</Text>
        </Box>
        {confirmWorkButton}
        <Box flexDir="row" p={2}>
          <Text textAlign="center">Start at : {startAt}</Text>
          <Text textAlign="center">Duration : {duration} s / {durationInIterate} m</Text>
        </Box>
        <Box>
          {actionType === ActionType.ONWORK ?
            <Image style={{width:"100%", height:300, resizeMode:"contain"}} source={imgWork} /> :
            actionType === ActionType.ONREST ?
            <Image style={{width:"100%", height:300, resizeMode:"contain"}} source={imgHappy} /> :
            <Image style={{width:"100%", height:300, resizeMode:"contain"}} source={imgStandby} />
          }
        </Box>
        <Box flexDir="row" p={2}>
          <Progress size="lg" value={durationInIterate} max={iteration} colorScheme={durationInIterate <= workDuration ? "emerald" : "primary"} />
        </Box>
        <Box flexGrow={1} style={{justifyContent:"flex-end"}} p={5}>
          <Text style={{textAlign:"center"}}>Rutinitas App v0.1</Text>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}