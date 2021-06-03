<template>
    <div class="time-trial-body" :style="timeTrialBodyStyle">
        <div :style="timeTrialSelectionContainerStyle" v-if="timeTrialSelected === undefined">
            <button class="time-trial-button" :style="timeTrialButtonStyle" @click="boardState = timeTrialSelection['time-trial I']" >
                <h1 @click="timeTrialSelected = 'time-trial I'">TIME-TRIAL I</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="boardState = timeTrialSelection['time-trial II']" >
                <h1 @click="timeTrialSelected = 'time-trial II'" >TIME-TRIAL II</h1>
            </button>
            <button class="time-trial-button"  :style="timeTrialButtonStyle" @click="boardState = timeTrialSelection['time-trial III']" >
                <h1 @click="timeTrialSelected = 'time-trial III'">TIME-TRIAL III</h1>
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
                <h1 :style="h1Style"> {{ timeTrialTime }} </h1>
            </div>
        </div>

    </div>
</template>

<script>
    import BoardPiece from "./BoardPiece";
    export default {
        name: "TimeTrials",
        components:{
            BoardPiece,
        },
        data() {
            return {
                timeTrialSelected: undefined,
                timeTrialSelection: {
                    'time-trial I': [
                        25,1,25,0,0,0,0,0,0,0,
                        25,0,25,0,0,0,0,0,0,0,
                        25,0,25,0,0,0,0,0,0,0,
                        25,0,25,25,25,25,25,25,25,25,
                        25,0,0,0,0,0,0,0,0,25,
                        25,25,25,25,25,25,25,25,0,25,
                        0,0,0,0,0,0,0,25,0,25,
                        0,0,0,0,0,0,0,25,0,25,
                        0,0,0,0,0,0,0,25,0,25,
                        0,0,0,0,0,0,0,25,99,25,
                    ],
                    'time-trial II': [
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
                    'time-trial III' : [
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
                },
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
	            playerOneStepSoundEffect: new Audio(require('../assets/Step1.wav')),
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
                    flexFlow: 'column',
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
            timeTrialTimeStyle(){
                return {
                	color: 'white',
                    height: 50 + 'px',
                    width: 100 + '%',
                    marginTop: 32 + 'px',
                }
            },
            h1Style(){
	            return {
		            width: 100 + '%',
		            height: 100 + '%',
		            fontFamily: "'Viga', sans-serif",
	            }
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
                if(this.keyCodes[e.keyCode] === 'right') {
                    this.buttonPressed = 'right';
                    console.log('right')
                    return this.handleRightKey(this.playerIndex, 1, this.keyCodes[e.keyCode])
                } else if(this.keyCodes[e.keyCode] === 'left') {
                    this.buttonPressed = 'left';
                    console.log('left')
                    return this.handleLeftKey(this.playerIndex,1,  this.keyCodes[e.keyCode])
                } else if(this.keyCodes[e.keyCode] === 'up') {
                    this.buttonPressed = 'up';
                    console.log('up')
                    return this.handleUpKey(this.playerIndex, 1,  this.keyCodes[e.keyCode])
                } else if(this.keyCodes[e.keyCode] === 'down') {
                    this.buttonPressed = 'down';
                    console.log('down')
                    return this.handleDownKey(this.playerIndex,1,   this.keyCodes[e.keyCode])
                }
            },
            handleRightKey(currentIndex, playerState, eventKeyCode){
                if ((currentIndex + 1)%10 === 0) {
                    if(this.boardState[currentIndex - (10 - 1)] === 25 ) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex - (10 - 1)] === 99) {
                    	this.timeTrialFinished = true
                    	this.timeTrialEndTime = performance.now()
                        this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
                    	return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }
                } else {
                    if(this.boardState[currentIndex + 1] === 25) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex + 1] === 99) {
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }
	                this.swap(currentIndex + 1, currentIndex + 1, 'right', eventKeyCode)
                }
            },
            handleLeftKey(currentIndex, playerState, eventKeyCode){
                if ((currentIndex + 1)%10 === 1) {
                    if(this.boardState[currentIndex + (10 - 1)] === 25) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex + (10 - 1)] === 99)  {
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }
                } else {
                    if(this.boardState[currentIndex - 1] === 25) return this.playStepSound(playerState)
                    if(this.boardState[currentIndex - 1] === 99) {
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
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

                    if(temp === 25) return console.log('there is a wall here')
                    if(temp === 99) {
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }

                    if(this.playerKeyCodes.includes(eventKeyCode)){
                        this.playerIndex = lastRowStart + currentIndex;
                        playerIndex = this.playerIndex;
                    } else {
                        this.enemyIndex = lastRowStart + currentIndex;
                        playerIndex = this.enemyIndex
                    }

                    console.log(playerIndex, playerState)
                    this.boardState[playerIndex] = playerState
                    this.boardState[oldPlayerIndex] = temp;
                } else {
                    if(this.boardState[playerIndex - 10] === 25) return this.playStepSound()
                    if(this.boardState[playerIndex - 10] === 99) {
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }

                    this.swap(currentIndex - 10, playerIndex - 10, 'up', eventKeyCode)
                }
            },
            handleDownKey(currentIndex, indexString, playerState){
                let playerIndex = this.playerIndex
                let lastRowStart = this.boardState.length - this.columnCount;

                if(currentIndex >= lastRowStart && currentIndex <= this.boardState.length - 1){
                    let difference = currentIndex - lastRowStart
                    let temp = this.boardState[difference]
                    playerIndex = difference;
                    if(temp === 25) return this.playStepSound()
                    if(temp === 99 ) {
                    	console.log('finished')
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }
                } else {
                    if(this.boardState[playerIndex + 10] === 25) return this.playStepSound()
                    if(this.boardState[playerIndex + 10] === 99) {
	                    console.log('finished')
	                    this.timeTrialFinished = true
	                    this.timeTrialEndTime = performance.now()
	                    this.timeTrialTime = ((this.timeTrialEndTime - this.timeTrialStartTime) * 0.001);
	                    return this.timeTrialTime = Math.round((this.timeTrialTime + Number.EPSILON) * 1000) / 1000;
                    }

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

                console.log(this.boardState);
            },
	        playStepSound(){
		        this.playerOneStepSoundEffect.time = 0;
		        this.playerOneStepSoundEffect.volume = Math.random() * 0.3;
		        this.playerOneStepSoundEffect.play();
	        },
            animateTimer(){
	            if(this.timeTrialFinished === true){
		            console.log('we are cancelling the animation')
		            cancelAnimationFrame(this.animateTimer)
                    return
	            }

            	this.timeTrialTimerTime = ((performance.now() - this.timeTrialStartTime) * 0.001);
            	this.timeTrialTimerTime = Math.round((this.timeTrialTimerTime + Number.EPSILON) * 1000) / 1000;

            	requestAnimationFrame(this.animateTimer)
            }
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