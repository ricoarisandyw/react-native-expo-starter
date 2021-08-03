import React from 'react';
import { Slider, Box, Button, NativeBaseProvider, Text, Progress, Flex, TextField, Input} from 'native-base';
import AppBar from './components/AppBar';
import { useKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av';
import { Image } from 'react-native';
import _ from 'lodash';
import { getNativeSourceAndFullInitialStatusForLoadAsync } from 'expo-av/build/AV';

const imgStandby = require('./assets/people_standby.jpg');
const imgHappy = require('./assets/people_happy.jpg');
const imgWork = require('./assets/people_work.jpg');

const ActionType = {
  ONWORK: "ONWORK",
  ONREST: "ONREST",
  ONSLEEP: "ONSLEEP"
}

// const iteration = 52 + 17 // minutes

export default function App() {
  const [startWork, setStartWork] = React.useState<Date | null>(null)
  const [workDuration, setWorkDuration] = React.useState(20)
  const [actionType, setActionType] = React.useState(ActionType.ONSLEEP)
  const [confirmWork, setConfirmWork] = React.useState(false)
  const [clock, setClock] = React.useState(0)
  const [workSong, setWorkSong] = React.useState<Audio.Sound>();
  const [restSong, setRestSong] = React.useState<Audio.Sound>();
  const [keepPlaying, setKeepPlaying] = React.useState(false)
  const [iterationTemp, setIterationTemp] = React.useState(60);
  const [iteration, setIteration] = React.useState(60)

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
      require('./songs/work.mp3')
    );
    sound.setIsLoopingAsync(true)
    setWorkSong(sound);
    const restSound = await Audio.Sound.createAsync(
      require('./songs/rest.mp3')
    );
    restSound.sound.setIsLoopingAsync(true)
    setRestSong(restSound.sound);
  }

  const duration = startWork ? Math.floor(Math.abs(startWork.getTime() - new Date().getTime())/1000) : 0

  const durationInIterate = Math.floor(duration) % (iteration * 60)
  // const durationInIterate = Math.floor(duration) % (iteration * 60)

  async function playSong(song: Audio.Sound){
    console.log("Play Audio")
    await song?.playAsync()
  }

  function stopAllSong(){
    workSong?.stopAsync()
    restSong?.stopAsync()
  }

  // when duration reached, start song
  React.useEffect(() => {
    if(startWork) {
      if(actionType === ActionType.ONWORK && (durationInIterate === workDuration * 60) && restSong){ // For minutes
      // if(actionType === ActionType.ONWORK && (durationInIterate === workDuration) && restSong){ // Testing, using second
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
    }, 1000)
    // console.log("Clock loaded")
    loadAudio()
    // console.log("Audio start to loaded")
  }, [])

  function onClickConfirmWork(){
    setConfirmWork(true)
    stopAllSong()
  }

  const confirmWorkButton = (actionType === ActionType.ONSLEEP) ?
    <Text marginTop={5} textAlign="center" fontSize="xl">START YOUR WORK FIRST</Text> :
    (confirmWork ? 
      <Box p={3}><Text textAlign="center">Great!!!</Text>
      <Text textAlign="center" fontSize="xl" style={{paddingTop:10,paddingBottom:10}}>KEEP YOUR SPIRIT!!! :D</Text></Box> : 
      <Box p={3}><Text textAlign="center">Are you working/rest?</Text>
      <Button onPress={onClickConfirmWork}>YES</Button></Box>)

  function handleIterationChange(event: any){
    setIterationTemp(parseInt(event.target.value,10))
  }

  function handlePressImplement(){
    setIteration(iterationTemp)
  }

  return (
    <NativeBaseProvider>
      <AppBar />
      {workSong && restSong ? <Box flexDir="row" p={5} flex={1}>
        <Box p={2}>
          <Box flexDir="row">
            {/* <Input onChange={handleIterationChange} type="number" keyboardType="numeric"  />
            <Button onPress={handlePressImplement}>Implement</Button> */}
            <Flex direction="row" justifyContent="space-between">
              <Text>Work {workDuration}m</Text>
              <Text>Rest {iteration - workDuration}m</Text>
            </Flex>
            <Box>
              <Slider
                defaultValue={workDuration}
                minValue={0}
                maxValue={iteration}
                step={1}
                onChange={setWorkDuration}
                isDisabled={startWork !== null}
                colorScheme={actionType === ActionType.ONWORK ? "gray" : "primary"}
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
            </Box>
          </Box>
        </Box>
        {
          startWork ?
          <Button onPress={onClickStopWork}>STOP WORK</Button>:
          <Button onPress={onClickStartWork}>START WORK</Button>
        }
        {confirmWorkButton}
        <Box>
          {actionType === ActionType.ONWORK ?
            <Image style={{width:"100%", height:200, resizeMode:"contain"}} source={imgWork} /> :
            actionType === ActionType.ONREST ?
            <Image style={{width:"100%", height:200, resizeMode:"contain"}} source={imgHappy} /> :
            <Image style={{width:"100%", height:200, resizeMode:"contain"}} source={imgStandby} />
          }
        </Box>
        <Box flexDir="row" p={2}>
          <Progress 
            size="lg" 
            value={durationInIterate} 
            max={(actionType === ActionType.ONWORK ? workDuration : iteration) * 60} 
            colorScheme={actionType === ActionType.ONWORK ?  "primary":"emerald"} />
        </Box>
        <Box flexGrow={1} style={{justifyContent:"flex-end"}} p={5}>
          <Text style={{textAlign:"center"}}>Rutinitas App v0.1</Text>
        </Box>
      </Box>
      : <Text style={{padding:30,textAlign:'center'}}>Loading Audio . . .</Text>}
    </NativeBaseProvider>
  );
}