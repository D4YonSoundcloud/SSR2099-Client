<template>
    <div class="time-trial-body" :style="timeTrialBodyStyle">
        <div :style="timeTrialSelectionContainerStyle" v-if="timeTrialSelected === undefined">
            <button class="time-trial-button" :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-I', 1)" >
                <h1>TIME-TRIAL I</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-II', 2)" >
                <h1>TIME-TRIAL II</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-III', 0)" >
                <h1>TIME-TRIAL III</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-IV', 0)" >
                <h1>TIME-TRIAL IV</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-V', 0)" >
                <h1>TIME-TRIAL V</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-VI', 70)" >
                <h1>TIME-TRIAL VI</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="goToTimeTrial('time-trial-X', 1)" >
                <h1>TIME-TRIAL X</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="playAllTimeTrials()" >
                <h1>TIME-TRIAL ALL</h1>
            </button>
        </div>

        <div class="board" :style="timeTrialBoardStyle" v-if="timeTrialSelected !== undefined">
            <BoardPiece :pieceIndex="index"  v-for="(piece, index) in boardState" :key="index" class="board-piece"
                        @click.native="calculateMouseMovement(index, playerIndex)"
                        :playerOneLives="50" :playerOneStatus="'normal'"
                        :playerTwoLives="50" :playerTwoStatus="'normal'"
                        :state="piece" :playerIndex="index === playerIndex ? playerIndex : undefined"
                        :playerUserName="'D4Y'"
                        :playerOneButtonPressed="index === playerIndex ? playerOneButtonPressed : undefined"
                        :pieceWidth="50" :playerStatus="index = playerIndex ? 'normal' : 'undefined'"
                        :pieceHeight="50">
            </BoardPiece>

            <div class="board-background"></div>

            <div class="" v-if="timeTrialStarted === true && timeTrialFinished === false" :style="timeTrialTimeStyle">
                <h1 :style="h1Style"> {{timeTrialTimerTime}} </h1>
            </div>
            <div class="" v-if="timeTrialFinished === true" :style="timeTrialTimeStyle">
                <h1 :style="h1Style"> {{ timeTrialTime }}s </h1>
            </div>
            <div class="" v-if="timeTrialFinished === true" :style="tilesPerSecondStyle">
                <h3 :style="h3Style"> {{ tilesPerSecond.toFixed(2) }} TILES/second </h3>
            </div>
            <div class="" v-if="timeTrialFinished === true && playAll === false" :style="stepsCountStyle">
                <h5 :style="h3Style"> {{ stepCount }} STEPS</h5>
            </div>
            <div class="" v-if="timeTrialFinished === true && playAll === false" :style="stepsCountStyle">
                <h5 :style="h3Style"> {{ wallHitCount }} WALL HITS</h5>
            </div>
            <div class="" v-if="timeTrialFinished === true && playAll === false" :style="stepsCountStyle">
                <h5 :style="h3Style"> {{ stepAccuracy.toFixed(2) }}% STEP ACCURACY</h5>
            </div>
        </div>

        <div :style="playAllSplitsContainerStyle" v-if="playAll === true">
            <div :style="playAllSplitStyle" v-if="playAllTimes[0]">
                <strong>I</strong> - {{playAllTimes[0].toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTimes[1]">
                <strong>II</strong> - {{playAllTimes[1].toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTimes[2]">
                <strong>III</strong> - {{playAllTimes[2].toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTimes[3]">
                <strong>IV</strong> - {{playAllTimes[3].toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTimes[4]">
                <strong>V</strong> - {{playAllTimes[4].toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTimes[5]">
                <strong>VI</strong> - {{playAllTimes[5].toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTimes[6]">
                <strong>X</strong> - {{playAllTimes[6].toFixed(2)}}s
            </div>

            <div :style="playAllSplitStyle" v-if="playAllTotalTime">
                <strong>Total Time</strong> - {{playAllTotalTime.toFixed(2)}}s
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTotalTime">
                <strong>Steps</strong> - {{stepCount}}
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTotalTime">
                <strong>Wall Hits</strong> - {{wallHitCount}}
            </div>
            <div :style="playAllSplitStyle" v-if="playAllTotalTime">
                <strong>Step Accuracy</strong> - {{stepAccuracy.toFixed(2)}}%
            </div>
        </div>
    </div>
</template>

<script>
    import BoardPiece from "./BoardPiece";
    import axios from 'axios'

    export default {
        name: "TimeTrials",
        components:{
            BoardPiece,
        },
        data() {
            return {
                timeTrialSelected: undefined,
                timeTrialSelection: {
                    'time-trial-I': [
                        27,1,27,0,0,0,0,0,0,0,
                        27,0,27,0,0,0,0,0,0,0,
                        25,0,25,0,0,0,0,0,0,0,
                        25,0,25,25,25,25,25,25,25,25,
                        25,0,0,0,0,0,0,0,0,25,
                        25,26,26,26,26,26,26,26,0,25,
                        0,0,0,0,0,0,0,25,0,25,
                        0,0,0,0,0,0,0,25,0,25,
                        0,0,0,0,0,0,0,25,0,25,
                        0,0,0,0,0,0,0,25,99,25,
                    ],
                    'time-trial-II': [
                        0,27,1,0,0,0,0,0,0,0,
                        25,25,26,26,26,26,26,26,26,0,
                        0,0,0,0,0,0,0,0,25,0,
                        0,0,0,0,0,0,0,0,25,0,
                        0,0,0,0,0,0,0,0,25,0,
                        0,0,0,0,0,0,0,0,25,0,
                        25,25,25,25,25,25,25,25,25,0,
                        0,0,0,0,0,0,0,0,0,0,
                        0,26,26,26,26,26,26,26,26,26,
                        0,0,0,0,0,0,0,99,25,25,
                    ],
                    'time-trial-III' : [
                        1 ,27,0 ,27,0 ,27,0 ,27,27,27,
                        26,25,0 ,0 ,0 ,27,0 ,27,27,27,
                        25,25,26,26,26,25,0 ,25,27,27,
                        25,25,25,25,25,25,0 ,25,25,25,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,25,0 ,0 ,
                        26,26,26,26,26,26,26,25,0 ,26,
                        25,25,25,25,25,25,25,25,0 ,25,
                        0 ,0 ,0 ,0 ,0 ,25,25,25,0 ,0 ,
                        26,26,26,26,0 ,25,25,25,26,26,
                        0 ,0 ,0 ,25,0 ,25,0 ,99,25,25,
                    ],
                    'time-trial-IV':[
                        1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 , // 9
                        26,26,26,26,26,26,26,26,26,0 ,
                        25,0 ,0 ,0 ,0 ,0 ,0 ,0 ,25,0 ,
                        25,0 ,26,26,26,26,26,0 ,25,0 ,
                        25,0 ,25,0 ,0 ,99,25,0 ,25,0 , // 48
                        25,0 ,25,0 ,26,26,26,0 ,25,0 ,
                        25,0 ,25,0 ,0 ,0 ,0 ,0 ,25,0 ,
                        25,0 ,26,26,26,26,26,26,25,0 ,
                        25,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 , // 8
                        26,26,26,26,26,26,26,26,26,26,
                    ],
                    'time-trial-V':[
                        1 ,27,0 ,0 ,0 ,0 ,0 ,0 ,26,99,
                        0 ,0 ,25,0 ,0 ,0 ,0 ,25,0 ,0 ,
                        26,0 ,0 ,25,0 ,0 ,25,25,0 ,26,
                        25,26,0 ,25,0 ,0 ,25,0 ,0 ,25,
                        0 ,25,0 ,0 ,26,26,0 ,0 ,26,0 ,
                        0 ,0 ,26,0 ,25,25,0 ,26,0 ,0 ,
                        0 ,0 ,25,0 ,0 ,0 ,0 ,25,0 ,0 ,
                        0 ,0 ,0 ,26,0 ,0 ,26,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,26,26,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                    ],
                    'time-trial-VI':[
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,27,0 ,
                        0 ,26,26,26,26,26,26,0 ,25,0 ,
                        0 ,25,0 ,0 ,0 ,0 ,25,0 ,25,0 ,
                        0 ,25,0 ,26,26,0 ,25,0 ,25,0 ,
                        0 ,25,0 ,25,25,0 ,25,0 ,25,0 ,
                        0 ,25,0 ,25,25,0 ,25,0 ,25,0 ,
                        0 ,25,0 ,25,99,0 ,25,0 ,25,0 ,
                        1 ,25,0 ,26,26,26,25,0 ,25,0 ,
                        26,25,0 ,0 ,0 ,0 ,0 ,0 ,25,0 ,
                        0 ,25,0 ,26,26,26,26,0 ,25,0 ,
                    ],
                    'time-trial-VII':[
                        1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                    ],
                    'time-trial-VIII':[
                        1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                    ],
                    'time-trial-IX':[
                        1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                        0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,
                    ],
                    'time-trial-X':[
                        27,1 ,27,0 ,0 ,0 ,0 ,27,0 ,27,
                        27,0 ,0 ,27,0 ,0 ,27,0 ,0 ,27,
                        0 ,26,0 ,0 ,25,25,0 ,0 ,26,0 ,
                        0 ,0 ,26,0 ,0 ,0 ,0 ,26,0 ,0 ,
                        0 ,0 ,0 ,26,26,26,26,0 ,0 ,0 ,
                        0 ,0 ,0 ,25,25,25,25,0 ,0 ,0 ,
                        0 ,0 ,25,0 ,0 ,0 ,0 ,25,0 ,0,
                        0 ,25,0 ,0 ,26,26,0 ,0 ,25,25,
                        27,0 ,0 ,26,0 ,0 ,26,0 ,0 ,27,
                        27,99,26,0 ,0 ,0 ,0 ,26,0 ,27,
                    ],
                },
                timeTrialStarterIndexes:{
                    'time-trial-I': 1,
                    'time-trial-II': 2,
                    'time-trial-III': 0,
                    'time-trial-IV': 0,
                    'time-trial-V': 0,
                    'time-trial-VI': 70,
                    'time-trial-X': 1,
                },
                timeTrialNumberOfTiles:{
                    'time-trial-I': 16,
                    'time-trial-II': 31,
                    'time-trial-III': 33,
                    'time-trial-IV': 48,
                    'time-trial-V': 21,
                    'time-trial-VI': 41,
                    'time-trial-X': 26,
                },
                playAll: false,
                playAllCounter: 0,
                playAllArray: ['time-trial-I', 'time-trial-II','time-trial-III','time-trial-IV','time-trial-V','time-trial-VI','time-trial-X'],
                playAllTimes: [],
                playAllTotalTime: 0,
                playerIndex: 1,
                boardState: [
                    1,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,99,
                ],
                keyCodes:{
                    37: 'left',
                    38: 'up',
                    39: 'right',
                    40: 'down',
                    65: 'left',
                    87: 'up',
                    68: 'right',
                    83: 'down'
                },
                timeTrialStartTime: undefined,
                timeTrialEndTime: undefined,
                timeTrialTime: undefined,
                timeTrialTimerTime: undefined,
                timeTrialStarted: false,
                timeTrialFinished: false,
                tilesPerSecond: undefined,
                boardHeight: 500,
                boardWidth: 500,
                playerOneButtonPressed: '',
                runStarted: false,
                swapLookUpTable:{
                    'left': 1,
                    'right': -1,
                    'up': 10,
                    'down': -10,
                    'rightWall': 9,
                    'leftWall': -9,
                },
                playerStatus: 'normal',
                wallHitCount: 0,
                stepCount: 0,
	            playerOneStepSoundEffect: new Audio(require('../assets/Step1.wav')),
                localhostURL: 'http://localhost:4000',
                developmentURL: 'https://stark-thicket-52069.herokuapp.com/',
            }
        },
        computed:{
            timeTrialSelectionContainerStyle(){
                return{
                    display: 'flex',
                    flexFlow: 'column',
                    height: 50 + '%',
                    width: 40 + '%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
            timeTrialButtonStyle(){
                return{
                    display: 'flex',
                    fontSize: 1 + 'em',
                    fontFamily: "'Viga', sans-serif",
                    outline: 'none',
                    border: 'none',
                    color: 'rgb(255,239,0)',
                    padding: 8 + 'px',
                    paddingLeft: 16 + 'px',
                    paddingRight: 16 + 'px',
                    margin: 16 + 'px',
                    backgroundColor: 'rgba(0,0,0,0)',
                    boxShadow: '0 0 1px 1px rgb(255,239,0)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 0.2 + 's ease',
                }
            },
            timeTrialBodyStyle(){
                return{
                    display: 'flex',
                    flexFlow: 'row',
                    height: 100 + 'vh',
                    width: 100 + 'vw',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
            timeTrialBoardStyle(){
                return{
                    height: this.boardHeight + 'px',
                    width: this.boardWidth + 'px',
                    display: 'flex',
                    flexFlow: 'row wrap',
                    backgroundColor: '#3e0761',
                    boxShadow: 'rgb(90 5 90) 0px 0px 100px 0',
                }
            },
            playAllSplitsContainerStyle(){
                return{
                    height: 500 + 'px',
                    marginLeft: 32 + 'px',
                    width: 200 + 'px',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'start',
                }
            },
            playAllSplitStyle(){
                return{
                    width: 100 + '%',
                    height: 10 + '%',
                    fontFamily: "'Viga', sans-serif",
                    textAlign: 'left',
                    padding: 8 + 'px',
                }
            },
            timeTrialTimeStyle(){
                return {
                	color: 'white',
                    height: 50 + 'px',
                    width: 100 + '%',
                    marginTop: 16 + 'px',
                }
            },
            stepsCountStyle(){
                return{
                    color: 'white',
                    height: 20 + 'px',
                    width: 100 + '%',
                    marginTop: 8 + 'px',
                }
            },
            tilesPerSecondStyle(){
                return {
                    color: 'white',
                    height: 30 + 'px',
                    width: 100 + '%',
                    marginTop: 8 + 'px',
                }
            },
            h1Style(){
	            return {
		            width: 100 + '%',
		            height: 100 + '%',
		            fontFamily: "'Viga', sans-serif",
	            }
            },
            h3Style(){
                return {
                    width: 100 + '%',
                    height: 100 + '%',
                    fontFamily: "'Viga', sans-serif",
                    color: '#adadad',
                }
            },
            stepAccuracy(){
                let steps = this.stepCount;
                let wallHits = this.wallHitCount;
                return ((steps - wallHits)/steps) * 100
            },
            signedInUser(){
                return this.$store.state.signedInUser;
            },
        },
        methods:{
            calculateMouseMovement(clickedIndex, playerIndex){
                console.log(clickedIndex, playerIndex)

                if(this.boardState[playerIndex] === 1 && this.playerStatus === 'charging'){

                    return this.seeIfPlayerInClickedColumn(clickedIndex, playerIndex)

                } else if (this.boardState[playerIndex] === 100 && this.enemyStatus === 'charging'){

                    return this.seeIfPlayerInClickedColumn(clickedIndex, playerIndex)

                }


                if(clickedIndex - 1 === playerIndex){
                    let eventObject = {key: 'd', keyCode: 68}
                    this.handleKeyDownEvent(eventObject)
                    console.log('the user wants to move right')
                }

                if(clickedIndex + 1 === playerIndex){
                    let eventObject = {key: 'a', keyCode: 65}
                    this.handleKeyDownEvent(eventObject)
                    console.log('the user wants to move left')
                }

                if(clickedIndex - 10 === playerIndex){
                    let eventObject = {key: 's', keyCode: 83}
                    this.handleKeyDownEvent(eventObject)
                    console.log('the player wants to move down')
                }

                if(clickedIndex + 10 === playerIndex) {
                    let eventObject = {key: 'w', keyCode: 87}
                    this.handleKeyDownEvent(eventObject)
                    console.log('the player wants to move up')
                }
            },
            handleKeyDownListener(e){
                if(e.key === 'R' || e.key === 'r'){
                    if(this.playAll === true){
                        return this.restartPlayAllTimeTrial('time-trial-I')
                    }
                    return this.restartTimeTrial(this.timeTrialSelected);
                }

            	if(this.timeTrialFinished === true) return

            	if(this.timeTrialStarted === false){
            		this.timeTrialStartTime = performance.now()
            		this.timeTrialStarted = true;
            		this.animateTimer()
                    console.log('time trial started', this.timeTrialStarted)
                }

            	console.log(this.timeTrialTimerTime)
                return this.handleKeyDownEvent(e);
            },
            handleKeyDownEvent(e) {
                this.stepCount = this.stepCount + 1;

                if(this.keyCodes[e.keyCode] === 'right') {
                    this.playerOneButtonPressed = 'right';
                    console.log('right')
                    return this.handleRightKey(this.playerIndex, 1, this.keyCodes[e.keyCode])
                } else if(this.keyCodes[e.keyCode] === 'left') {
                    this.playerOneButtonPressed = 'left';
                    console.log('left')
                    return this.handleLeftKey(this.playerIndex,1,  this.keyCodes[e.keyCode])
                } else if(this.keyCodes[e.keyCode] === 'up') {
                    this.playerOneButtonPressed = 'up';
                    console.log('up')
                    return this.handleUpKey(this.playerIndex, 1,  this.keyCodes[e.keyCode])
                } else if(this.keyCodes[e.keyCode] === 'down') {
                    this.playerOneButtonPressed = 'down';
                    console.log('down')
                    return this.handleDownKey(this.playerIndex,1,   this.keyCodes[e.keyCode])
                }
            },
            handleRightKey(currentIndex, playerState, eventKeyCode){
                if ((currentIndex + 1)%10 === 0) {
                    if(this.timeTrialSelected === 'time-trial-V') return this.playStepSound()

                    if(this.boardState[currentIndex - (10 - 1)] === 25 ) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex - (10 - 1)] === 26 ) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex - (10 - 1)] === 27 ) return this.playStepSound(playerState)

                    if(this.boardState[currentIndex - (10 - 1)] === 99) {
                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

                    	this.timeTrialEndTime = performance.now()
                        this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                    	this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

                    this.swap(currentIndex - (10 - 1), currentIndex - (10 - 1), 'rightWall', eventKeyCode)
                } else {
                    if(this.boardState[currentIndex + 1] === 25) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex + 1] === 26) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex + 1] === 27) return this.playStepSound(playerState)

                    if(this.boardState[currentIndex + 1] === 99) {
                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

	                this.swap(currentIndex + 1, currentIndex + 1, 'right', eventKeyCode)
                }
            },
            handleLeftKey(currentIndex, playerState, eventKeyCode){
                if ((currentIndex + 1)%10 === 1) {
                    if(this.timeTrialSelected === 'time-trial-IV') return this.playStepSound()

                    if(this.boardState[currentIndex + (10 - 1)] === 25) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex + (10 - 1)] === 26) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex + (10 - 1)] === 27) return this.playStepSound(playerState)

                    if(this.boardState[currentIndex + (10 - 1)] === 99)  {
                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

                    this.swap(currentIndex + (10 - 1), currentIndex + (10 - 1), 'leftWall', eventKeyCode)
                } else {
                    if(this.boardState[currentIndex - 1] === 25) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex - 1] === 26) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex - 1] === 27) return this.playStepSound(playerState)

                    if(this.boardState[currentIndex - 1] === 99) {
                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

	                this.swap(currentIndex - 1, currentIndex - 1, 'left', eventKeyCode)
                }
            },
            handleUpKey(currentIndex, indexString, eventKeyCode){
                let firstRowEnd = 10 - 1;
                let lastRowStart = this.boardState.length - 10;
                let playerIndex = this.playerIndex;
                let playerState = 1

                if(currentIndex <= firstRowEnd){
                    let oldPlayerIndex = currentIndex;
                    let temp = this.boardState[lastRowStart + currentIndex]

                    if(this.timeTrialSelected === 'time-trial-II') return this.playStepSound();
                    if(this.timeTrialSelected === 'time-trial-V') return this.playStepSound();

                    if(this.timeTrialSelected === 'time-trial-X' && this.playerIndex === 1) return this.playStepSound();

                    if(temp === 25) return this.playStepSound()
                    if(temp === 26) return this.playStepSound()
                    if(temp === 27) return this.playStepSound()

                    if(temp === 99) {
                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

                        this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

                    this.playerIndex = lastRowStart + currentIndex;
                    playerIndex = this.playerIndex;

                    console.log(playerIndex, playerState)
                    this.boardState[playerIndex] = playerState
                    this.boardState[oldPlayerIndex] = temp;
                    return console.log('there is no wall here')
                } else {
                    if(this.boardState[playerIndex - 10] === 25) return this.playStepSound()
                    if(this.boardState[playerIndex - 10] === 26) return this.playStepSound()
                    if(this.boardState[playerIndex - 10] === 27) return this.playStepSound()

                    if(this.boardState[playerIndex - 10] === 99) {

                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

                        this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

                    this.swap(currentIndex - 10, playerIndex - 10, 'up', eventKeyCode)
                }
            },
            handleDownKey(currentIndex, indexString, playerState){
                let playerIndex = this.playerIndex
                let lastRowStart = this.boardState.length - 10;

                if(currentIndex >= lastRowStart && currentIndex <= this.boardState.length - 1){

                    if(this.timeTrialSelected === 'time-trial-II') return this.playStepSound()

                    let difference = currentIndex - lastRowStart
                    let oldPlayerIndex = currentIndex;
                    let temp = this.boardState[difference]
                    playerIndex = difference;

                    if(temp === 25) return this.playStepSound()
                    if(temp === 26) return this.playStepSound()
                    if(temp === 27) return this.playStepSound()

                    if(temp === 99) {

                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

                        this.timeTrialEndTime = performance.now()
                        this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

                    this.playerIndex = playerIndex;


                    this.boardState[playerIndex] = 1
                    this.boardState[oldPlayerIndex] = temp;


                    return console.log('there is no wall here')
                } else {

                    if(this.boardState[playerIndex + 10] === 25) return this.playStepSound()
                    if(this.boardState[playerIndex + 10] === 26) return this.playStepSound()
                    if(this.boardState[playerIndex + 10] === 27) return this.playStepSound()

                    if(this.boardState[playerIndex + 10] === 99) {

                        if(this.playAll === false){
                            this.timeTrialFinished = true
                        }

                        this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                        this.tilesPerSecond = this.timeTrialNumberOfTiles[this.timeTrialSelected] / this.timeTrialTime;
                        if(this.playAll === true) {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.goToNextPlayAllStage()
                        } else {
                            this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                            return this.updateTime(this.timeTrialSelected, this.timeTrialTime);
                        }
                    }

                    console.log(this.boardState[playerIndex + 10])

                    this.swap(currentIndex + 10, playerIndex + 10, 'down')
                }
            },
            swap(nonPlayerIndex, newPlayerIndex, keyCode, indexString){
                indexString = 'playerIndex';
                //decide if this is player 1 or player 2
                let playerState = 1
                let playerStatus = 'playerStatus';


                //handle previous piece if it is a blank tile
                let temp = 0;
                //decide status if the tile we are moving to is not blank

                //code for deciding if it is the 1st or 2nd player
                this.playerIndex = newPlayerIndex;
                this[indexString] = this.playerIndex;
                this.boardState[this[indexString]] = playerState
                this.boardState[this[indexString] + this.swapLookUpTable[keyCode]] = temp;


            },
            goToTimeTrial(timeTrial, playerIndex){
                //map it so when you restart the character actually goes back to the start (not mutating the original)
                this.boardState = [...this.timeTrialSelection[timeTrial]];
                this.timeTrialSelected = timeTrial;
                this.playerIndex = playerIndex
            },
            restartTimeTrial(timeTrial){
                console.log(this.timeTrialStarterIndexes[timeTrial])

                this.boardState = [...this.timeTrialSelection[timeTrial]];
                this.timeTrialStartTime = undefined
                this.timeTrialEndTime = undefined
                this.timeTrialTime = undefined
                this.timeTrialTimerTime = undefined
                this.timeTrialStarted = false
                this.timeTrialFinished = false
                this.runStarted = false
                this.tilesPerSecond = undefined
                this.playerIndex = this.timeTrialStarterIndexes[timeTrial];

                if(this.playAll === false) {
                    this.stepCount = 0;
                    this.wallHitCount = 0;
                }

                console.log(this.timeTrialStarterIndexes[timeTrial])
                this.boardState[this.playerIndex] = 1


                console.log('restarted' + timeTrial);
            },
            restartPlayAllTimeTrial(timeTrial){

                this.boardState = [...this.timeTrialSelection[timeTrial]];
                this.timeTrialStartTime = undefined
                this.timeTrialEndTime = undefined
                this.timeTrialTime = undefined
                this.timeTrialTimerTime = undefined
                this.timeTrialStarted = false
                this.timeTrialFinished = false
                this.runStarted = false
                this.tilesPerSecond = undefined
                this.playerIndex = this.timeTrialStarterIndexes[timeTrial];

                this.playAllCounter = 0;
                this.playAllTimes = [];
                this.playAllTotalTime = 0

                this.stepCount = 0;
                this.wallHitCount = 0;

                console.log(this.timeTrialStarterIndexes[timeTrial])
                this.boardState[this.playerIndex] = 1

                console.log('restarted' + timeTrial);
            },
	        playStepSound(){
		        this.playerOneStepSoundEffect.time = 0;
		        this.playerOneStepSoundEffect.volume = Math.random() * 0.01;
                this.wallHitCount = this.wallHitCount + 1;
		        this.playerOneStepSoundEffect.play();
	        },
            animateTimer(){
	            if(this.timeTrialFinished === true){
		            cancelAnimationFrame(this.animateTimer)
                    return
	            }

            	this.timeTrialTimerTime = ((performance.now() - this.timeTrialStartTime) * 0.001);
            	this.timeTrialTimerTime = Math.round((this.timeTrialTimerTime + Number.EPSILON) * 1000) / 1000;

            	requestAnimationFrame(this.animateTimer)
            },
            playAllTimeTrials(){
                this.playAll = true;
                this.goToTimeTrial('time-trial-I', 1)
            },
            goToNextPlayAllStage(){

                if(this.playAllCounter === Object.keys(this.timeTrialStarterIndexes).length - 1){
                    this.playAllTimes.push(this.timeTrialTime);
                    for(let time of this.playAllTimes){
                        this.playAllTotalTime = this.playAllTotalTime + time;
                    }

                    console.log(this.playAllTotalTime)

                    return this.timeTrialFinished = true
                }

                this.playAllCounter = this.playAllCounter + 1;
                // this.boardState = [...this.timeTrialSelection[this.playAllArray[this.playAllCounter]]];
                this.playAllTimes.push(this.timeTrialTime);

                this.timeTrialSelected = this.playAllArray[this.playAllCounter]

                this.restartTimeTrial(this.timeTrialSelected)
            },
            updateTime(timeTrial, time){
                console.log(timeTrial, time)
                if(time < this.signedInUser[timeTrial].bestTime){
                    //update time script
                }

                let requestBody = {
                    userId: this.signedInUser.userId,
                    timeTrial: timeTrial,
                    timeTrialTime: time,
                    timeDate: new Date().getTime(),
                }

                console.log(requestBody)

                axios.put(`${this.localhostURL}/updateTime`, requestBody, response => {
                    console.log(response.data)
                    this.$store.dispatch('getUpdateUserTimes', response.date)
                })
            },
        },
        created(){
            window.addEventListener('keydown', this.handleKeyDownListener)
        },
        beforeDestroy(){
            window.removeEventListener('keydown', this.handleKeyDownEventListener);
        }
    }
</script>

<style scoped>
    .time-trial-body {
        background: linear-gradient(180deg, #080000, #060500, #040400, #000000);
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
        transition: 0.2s ease;
    }

    .board-background{
        position: absolute;
        width: 550px;
        height: 550px;
        transform: translate(-25px, -25px);
        transform-origin: center;
        background-image: url("../assets/board-background-main-2.png")
    }

    @keyframes gradient {
        0% {
            background-position: 0 50%;
        }
        25% {
            background-position: 100% 50%;
        }
        75% {
            background-position: 50% 100%;
        }
        100%
        {
            background-position: 0 50%;
        }
    }
    .time-trial-button:hover{
        transform: translateX(15px);
    }
</style>