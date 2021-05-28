<template>
    <div class="board-container" id="multiplayer-board" :style="boardContainerStyle">
        <PlayerUI :enemy="false" :playerUsername="playerNames[0]" :multiplayer="true"
                  :playerLives="playerLives" :playerStatus="playerStatus" :gameOver="gameOver"
                  :winner="playerLives < 1 ? playerNames[1] : playerNames[0]">
        </PlayerUI>
        <div class="board" :style="boardStyle">
            <BoardPiece :pieceIndex="index"  v-for="(piece, index) in boardState" :key="index" class="board-piece"
                        @click.native="calculateMouseMovement(index, characterId === users[0] ? playerIndex : enemyIndex)"
                        :playerOneLives="playerLives" :playerOneStatus="playerStatus"
                        :playerTwoLives="enemyLives" :playerTwoStatus="enemyStatus"
                        :state="piece" :playerIndex="index === playerIndex ? playerIndex : undefined"
                        :playerUserName="index === playerIndex ? playerNames[0] : undefined "
                        :playerOneButtonPressed="index === playerIndex ? playerOneButtonPressed : undefined"
                        :playerTwoButtonPressed="index === enemyIndex ? playerTwoButtonPressed : undefined"
                        :enemyUserName="index === enemyIndex ? playerNames[1] : undefined "
                        :pieceWidth="boardPieceHeightAndWidth" :playerStatus="index === playerIndex ? playerStatus : 'normal'"
                        :enemyIndex="index === enemyIndex ? enemyIndex : undefined" :enemyStatus="enemyStatus"
                        :pieceHeight="boardPieceHeightAndWidth">
            </BoardPiece>
            <h1 v-if="gameOver === true" style="margin-top: 16px; color: white; width: 100%; text-align:center">
                {{playerLives < 1 ? playerNames[1] : playerNames[0]}}
                SURVIVES
<!--                {{playerLives < 1 ? playerNames[0] : playerNames[1]}}-->
            </h1>
            <!-- TODO MAKE THIS A BUTTON BRO PLZ --->
            <div class="rematch-btn" v-if="gameOver === true" :style="buttonStyle" @click="rematch()">
                <h1 class="blinking-h1" :style="h1Style"> REMATCH? {{rematchCount}}/2</h1>
            </div>
        </div>
        <PlayerUI :enemy="true" :playerUsername="this.playerNames[1]" :multiplayer="true"
                  :winner="playerLives < 1 ? playerNames[1] : playerNames[0]" :gameOver="gameOver"
                  :enemyLives="enemyLives" :enemyStatus="enemyStatus">
        </PlayerUI>
    </div>
</template>

<script>
	import io from 'socket.io-client'

	import Vue from 'vue'
	import BoardPiece from "./BoardPiece";
	import PlayerUI from "./PlayerUI";
    import * as d3 from "d3-scale";
	export default {
		name: "BoardMultiplayer",
		components:{BoardPiece, PlayerUI},
        props:['selectedCharacter', 'characterId', 'roomId', 'selectedMap'],
		data(){
			return{
				gameOver: false,
				boardState:[
					1,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,100,
				],
				previousPieceState: 0,
				columnCount: 10,
				rowCount: 10,
				playerIndex: 0,
				playerState: 1,
				playerStatus: 'normal',
				playerAttackTiles:[],
				playerAttackTempTilesState:[],
                playerChargeTimeStart: 0,
                playerChargeTimeEnd: 0,
                playerAttackDamage: 0,
				enemyIndex: 99,
				enemyState: 100,
				enemyStatus: 'normal',
				enemyAttackTiles:[],
				enemyAttackTempTilesState:[],
                enemyChargeTimeStart: 0,
                enemyChargeTimeEnd: 0,
                enemyAttackDamage: 0,
				boardWidth: 500,
				boardHeight: 500,
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
				playerKeyCodes:[65,87,68,83],
				swapLookUpTable:{
					'left': 1,
					'right': -1,
					'up': 10,
					'down': -10,
					'rightWall': 9,
					'leftWall': -9,
				},
				playerStatusFireLookUpTable: {
					'normal': 'fire',
					'wet': 'dry',
					'fire': 'dead',
					'dry': 'fire',
				},
				playerStatusWaterLookUpTable: {
					'normal': 'wet',
					'wet': 'dead',
					'fire': 'dry',
					'dry': 'wet',
				},
				socket: io('https://stark-thicket-52069.herokuapp.com/', {
					query: {
						roomId: this.roomId,
                        mapId: this.selectedMap,
                    }
                }),
                // socket: io('http://localhost:4000/', {
                //     query: {
                //         roomId: this.roomId,
                //         mapId: this.selectedMap,
                //     }
                // }),
				playerUserName: '',
				users:[],
                playerNames: [],
                attackPressed: false,
                playerLives: 50,
                enemyLives: 50,
                buttonPressed: '',
                chargeScale: d3.scaleLinear().domain([50,1000]).range([5,20]).clamp(true),
                moveDelay: false,
                rematchCount: 0,
                hasGivenRematchCount: false,
                playerOneButtonPressed: 'down',
                playerTwoButtonPressed: 'up',
				fightCountDownSoundEffect: new Audio(require('../assets/321Fighting.mp3')),
                fightCountDownPlayed: false,
				playerOneStepSoundEffect: new Audio(require('../assets/Step1.wav')),
				playerTwoStepSoundEffect: new Audio(require('../assets/Step2.wav')),
                playerHitSoundEffect: new Audio(require('../assets/oof1.wav'))
			}
		},
		computed:{
			boardPieceHeightAndWidth(){
				return this.boardWidth / 10
			},
            buttonStyle(){
                return {
                    width: 300 + 'px',
                    height: 50 + 'px',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    marginTop: 5 + '%',
                    marginLeft: 20 + '%',
                    borderRadius: '1.25%',
                    boxShadow: '0 0 10px 0 #bf05bf',
                }
            },
			boardContainerStyle(){
				return {
                    paddingBottom: 2.5 + '%',
					height: 100 + '%',
					width: 100 + 'vw',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}
			},
			boardStyle(){
				return {
					height: this.boardHeight + 'px',
					width: this.boardWidth + 'px',
					display: 'flex',
					flexFlow: 'row wrap',
					backgroundColor: '#3e0761',
					boxShadow: 'rgb(90 5 90) 0px 0px 100px 0',
				}
			},
            h1Style(){
                return {
                    width: 100 + '%',
                    height: 100 + '%',
                    fontFamily: "'Viga', sans-serif",
                    cursor: 'pointer',
                }
            },
			playerLivesStore(){
				return this.$store.state.playerLivesStore
			},
			enemyLivesStore(){
				return this.$store.state.enemyLivesStore
			}
		},
		watch:{
			playerLives(){
				this.playerHitSoundEffect.volume = Math.random() / 2;
                this.playerHitSoundEffect.play();

				if(this.playerLives <= 0){
					return this.gameOver = true;
				}
			},
			enemyLives(){
				this.playerHitSoundEffect.volume = Math.random() / 2;
				this.playerHitSoundEffect.play();

				if(this.enemyLives <= 0){
					return this.gameOver = true;
				}
			},
			users(){
				if(this.users.length === 2 && this.fightCountDownPlayed === false){
                    this.fightCountDownSoundEffect.play();
                    this.fightCountDownPlayed = true;
                }
            }
		},
		methods:{
		    rematch(){
                console.log('we are starting a rematch')
                if(this.hasGivenRematchCount === true){
                    return console.log('you have already done this')
                }
                this.hasGivenRematchCount = true;
                this.socket.emit('sendAddToRematch')
            },
			joinServer(){
				console.log('we are trying to join the server');
				//does not get called when the other user joins because it is socket.emit in Server.js, not io.emit
				this.socket.on('userJoined', data => {
					console.log('calling UserJoined');
					this.users = data.userIDs;
					this.playerNames = data.users;
					this.socket.emit('newUser', {id: this.characterId, username: this.playerUserName});
					console.log('called emit new user', this.users, this.playerNames)
				});
				this.listen();
			},
            listen(){
	            //call the userOnline function in our socketIO server and push the user received into
	            //users array
	            this.socket.on('userOnline', data => {
		            this.users = data.userIDs;
		            this.playerNames = data.users;
		            console.log(this.users, this.playerNames, data.boardState)
	            })

                this.socket.on('giveServerUpdate', data => {
                	this.assignPlayerInfo(data)
                })

                this.socket.on('givePlayerHealth', data => {
                    this.playerLives = data.playerOne.lives
                    this.enemyLives = data.playerTwo.lives
                })
                this.socket.on('givePlayerRematchCount', data => {
                    this.rematchCount = data.rematchCount;
                })
                this.socket.on('giveRestartGame', () => {
                    this.rematchCount = 0;
                    this.hasGivenRematchCount = false;
                    this.gameOver = false
                })
            },
			assignPlayerInfo(data){
				this.users = data.matchIDs;
				this.playerNames = data.matchUserName;

                this.playerIndex = data.matchPlayerOne.index;
                this.playerStatus = data.matchPlayerOne.status;
                this.playerState = data.matchPlayerOne.state;
                this.playerAttackTiles = data.matchPlayerOne.attackTiles;
                this.playerAttackTempTilesState = data.matchPlayerOne.tempTiles;
                this.playerOneButtonPressed = data.matchPlayerOne.buttonPressed;

				this.enemyIndex = data.matchPlayerTwo.index;
				this.enemyStatus = data.matchPlayerTwo.status;
				this.enemyState = data.matchPlayerTwo.state;
				this.enemyAttackTiles = data.matchPlayerTwo.attackTiles;
				this.enemyAttackTempTilesState = data.matchPlayerTwo.tempTiles;
				this.playerTwoButtonPressed = data.matchPlayerTwo.buttonPressed;

				// this.boardState[this.playerIndex] = this.playerState
				// this.boardState[this.enemyIndex] = this.enemyState
                if(this.boardState==''+data.matchBoard){
                	return console.log('the boards already match')
                } else {
                    this.boardState = data.matchBoard;
                }
            },
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
            seeIfPlayerInClickedColumn(clickedIndex, playerIndex){
                //check vertical
                //find number of tiles up and down
                let trackingNumUpwards = clickedIndex - 10;
                let trackingNumDownwards = clickedIndex + 10;

                this.clickedVerticalAttackCheck(clickedIndex, playerIndex, trackingNumUpwards, trackingNumDownwards)

		        //check horizontal
                //find number of tiles left and right
                let numToSubtract = clickedIndex % 10;
                let numToAdd = this.rowCount - numToSubtract;

                let clickedRowEnd = clickedIndex + numToAdd;
                let clickedRowStart = clickedIndex - numToSubtract;

                this.clickedHorizontalAttackCheck(clickedIndex, playerIndex, clickedRowStart, clickedRowEnd)

	            console.log(numToAdd, numToSubtract, clickedRowEnd, clickedRowStart)
            },
            clickedHorizontalAttackCheck(clickedIndex, playerIndex, clickedRowStart, clickedRowEnd){
	            for(let i = clickedRowStart; i < clickedIndex; i++){
		            console.log(i)
		            if(i === playerIndex){
			            console.log('we are attacking')
			            let eventObject = {key: 'd', keyCode: 68, timeStamp: performance.now()}
			            this.handleKeyDownEvent(eventObject)
			            break;
		            }
	            }

	            for(let i = clickedRowEnd; i > clickedIndex; i--){
		            console.log(i)
		            if(i === playerIndex){
			            console.log('we are attacking')
			            let eventObject = {key: 'd', keyCode: 68, timeStamp: performance.now()}
			            this.handleKeyDownEvent(eventObject)
			            break;
		            }
	            }
            },
            clickedVerticalAttackCheck(clickedIndex, playerIndex, trackingNumUpwards, trackingNumDownwards){
		        if(trackingNumUpwards === playerIndex){
			        let eventObject = {key: 'w', keyCode: 87, timeStamp: performance.now()}
			        return this.handleKeyDownEvent(eventObject)
                } else if (trackingNumDownwards === playerIndex) {
			        let eventObject = {key: 'w', keyCode: 87, timeStamp: performance.now()}
			        return this.handleKeyDownEvent(eventObject)
                }

		        while(trackingNumUpwards > 0){
			        console.log(trackingNumUpwards)
		        	trackingNumUpwards = trackingNumUpwards - 10;
                    if(trackingNumUpwards === playerIndex){
	                    let eventObject = {key: 'w', keyCode: 87, timeStamp: performance.now()}
                    	return this.handleKeyDownEvent(eventObject)
                    }
                }

		        while(trackingNumDownwards < 100){
		        	console.log(trackingNumDownwards)
		        	trackingNumDownwards = trackingNumDownwards + 10;
		        	if(trackingNumDownwards === playerIndex){
				        let eventObject = {key: 'w', keyCode: 87, timeStamp: performance.now()}
				        return this.handleKeyDownEvent(eventObject)
                    }
                }

            },
			handleKeyDownEvent(e) {
		    	console.log(e.timeStamp)

				if(this.characterId === this.users[0]){
					if(this.playerStatus === 'melee' || this.playerStatus === 'melee cooldown') {
                        return console.log('you are in the middle of a melee attack')
					}
				} else if (this.characterId === this.users[1]){
					if(this.enemyStatus === 'melee' || this.enemyStatus === 'melee cooldown') {
						return console.log('you are in the middle of a melee attack')
					}
				}

				if(this.characterId === this.users[0]){
					if(this.playerStatus === 'charging' || this.playerStatus === 'attacking') {
                        this.playerChargeTimeEnd = e.timeStamp;
                        let difference = this.playerChargeTimeEnd - this.playerChargeTimeStart
                        this.playerAttackDamage = this.chargeScale(difference);
                        console.log(this.playerChargeTimeStart, this.playerChargeTimeEnd, difference, this.chargeScale(difference))

						if(this.playerStatus === 'melee' || this.playerStatus === 'melee cooldown'){
							return console.log('you are already doing a melee attack')
						}

					    return this.handleAttack(e, false, this.playerAttackDamage)
                    }
                } else if (this.characterId === this.users[1]){
					if(this.enemyStatus === 'charging' || this.enemyStatus === 'attacking') {
                        this.enemyChargeTimeEnd = e.timeStamp;
                        let difference = this.enemyChargeTimeEnd - this.enemyChargeTimeStart
                        this.enemyAttackDamage = this.chargeScale(difference);
                        console.log(this.enemyChargeTimeStart, this.enemyChargeTimeEnd, difference, this.chargeScale(difference))

						if(this.playerStatus === 'melee' || this.playerStatus === 'melee cooldown'){
							return console.log('you are already doing a melee attack')
						}

					    return this.handleAttack(e, true, this.enemyAttackDamage)
                    }
                }

				let indexString = this.characterId === this.users[0] ? 'playerIndex' : 'enemyIndex'
                let playerState = this.characterId === this.users[0] ? 1 : 100
                console.log(indexString, this.characterId, this.users[0])

                this.playStepSound(playerState)

				if(this.keyCodes[e.keyCode] === 'right') {
					console.log('right')
                    this.buttonPressed = 'right';
					return this.socket.emit('sendPlayerInput', {player: playerState ,input: 'right'})
				} else if(this.keyCodes[e.keyCode] === 'left') {
					console.log('left')
                    this.buttonPressed = 'left';
					return this.socket.emit('sendPlayerInput', {player: playerState ,input: 'left'})
				} else if(this.keyCodes[e.keyCode] === 'up') {
					console.log('up')
                    this.buttonPressed = 'up';
					return this.socket.emit('sendPlayerInput', {player: playerState ,input: 'up'})
				} else if(this.keyCodes[e.keyCode] === 'down') {
					console.log('down')
                    this.buttonPressed = 'down';
					return this.socket.emit('sendPlayerInput', {player: playerState ,input: 'down'})
				}
			},
			handleAttack(e, enemy, damageAmount){
				if(this.playerStatus === 'attacking' && enemy === false) return console.log('you are already attacking')
				if(this.enemyStatus === 'attacking' && enemy === true) return console.log('you are already attacking')

				if(this.keyCodes[e.keyCode] === 'right' || this.keyCodes[e.keyCode] === 'left') {
                    this.socket.emit('sendPlayerStatusChange', {player: enemy ? 100 : 1, status: 'attacking'})
                    this.socket.emit('sendPlayerAttack', {player: enemy ? 100 : 1, input: this.keyCodes[e.keyCode]})

					return this.handleHorizontalAttack(enemy ? this.enemyIndex : this.playerIndex, enemy, damageAmount)
				} else if (this.keyCodes[e.keyCode] === 'up' || this.keyCodes[e.keyCode] === 'down') {
                    this.socket.emit('sendPlayerStatusChange', {player: enemy ? 100 : 1, status: 'attacking'})
                    this.socket.emit('sendPlayerAttack', {player: enemy ? 100 : 1, input: this.keyCodes[e.keyCode]})

					return this.handleVerticalAttack(enemy ? this.enemyIndex : this.playerIndex, enemy, damageAmount);
				}
			},
			handleHorizontalAttack(currentPlayerIndex, enemy, damageAmount){
				let numToSubtract = currentPlayerIndex % 10
				let numToAdd = this.rowCount - numToSubtract

				this.findAttackTiles(numToSubtract, numToAdd, currentPlayerIndex, enemy, damageAmount).then(() => {
					this.assignAttackTiles('horizontal',enemy)
					console.log('this is a horizontal attack')
				});
			},
			handleVerticalAttack(currentPlayerIndex, enemy, damageAmount){
				let trackingNumDownward = currentPlayerIndex - 10;
				let trackingNumUpward = currentPlayerIndex + 10;

				this.findAttackTilesVertical(trackingNumDownward, trackingNumUpward, enemy, damageAmount).then(() => {
					this.assignAttackTiles('vertical', enemy)
					console.log('this is a vertical attack')
				})
			},
			handleRightKey(currentIndex, indexString){
                console.log(currentIndex, indexString, this[indexString])
				if ((currentIndex + 1)%this.columnCount === 0) {
					if(this.boardState[currentIndex - (this.columnCount - 1)] === 25 ) return console.log('this is a wall')
                    if(this.boardState[currentIndex - (this.columnCount - 1)] === 1 || this.boardState[currentIndex - (this.columnCount - 1)] === 100) return
					this.swap(currentIndex - (this.columnCount - 1), this[indexString] - (this.columnCount - 1),'rightWall', indexString)
				} else {
					if(this.boardState[currentIndex + 1] === 25) return console.log('this is a wall')
					if(this.boardState[currentIndex + 1] === 1 || this.boardState[currentIndex + 1] === 100) return console.log('this is a wall')

					this.swap(currentIndex + 1, this[indexString] + 1,'right', indexString)
				}
			},
			handleLeftKey(currentIndex, indexString){
				if ((currentIndex + 1)%this.columnCount === 1) {
					if(this.boardState[currentIndex - 1] === 25) return console.log('this is a wall')
                    if(this.boardState[currentIndex + (this.columnCount - 1)] === 1 || this.boardState[currentIndex + (this.columnCount - 1)] === 100) return
					this.swap(currentIndex + (this.columnCount - 1), this[indexString] + (this.columnCount - 1),'leftWall', indexString)
				} else {
					if(this.boardState[currentIndex - 1] === 25) return console.log('this is a wall')
					if(this.boardState[currentIndex - 1] === 1 || this.boardState[currentIndex - 1] === 100) return console.log('this is a wall')

					this.swap(currentIndex - 1, this[indexString] - 1, 'left', indexString)
				}
			},
			handleUpKey(currentIndex, indexString){
				let firstRowEnd = this.columnCount - 1;
				let lastRowStart = this.boardState.length - this.columnCount;
				let playerIndex = this.characterId === this.users[0] ? this.playerIndex : this.enemyIndex
				let playerState = this.characterId === this.users[0] ? this.playerState : this.enemyState

				if(currentIndex <= firstRowEnd){
					let oldPlayerIndex = currentIndex;
					let temp = this.boardState[lastRowStart + currentIndex]

					if(temp === 25) return console.log('there is a wall here')
                    if(temp === 100 || temp === 1) return console.log('there is a player here')

					if(this.characterId === this.users[0]){
						this.playerIndex = lastRowStart + currentIndex;
						playerIndex = this.playerIndex;
					} else {
						this.enemyIndex = lastRowStart + currentIndex;
						playerIndex = this.enemyIndex
					}

					console.log(playerIndex, playerState)
					this.boardState[this[indexString]] = playerState
					this.boardState[oldPlayerIndex] = temp;

					this.socket.emit('sendUpdatePlayerIndex', {
						player: this.characterId === this.users[0] ? 1 : 100,
						index: this[indexString],
						oldIndex: oldPlayerIndex,
						oldValue: temp,
					})
				} else {
					if(this.boardState[playerIndex - this.columnCount] === 25) return console.log('you are hitting a wall dude')
                    if(this.boardState[playerIndex - this.columnCount] === 1 || this.boardState[playerIndex - this.columnCount] === 100) return console.log('you are hitting a wall dude')

					this.swap(currentIndex - this.columnCount, this[indexString] - this.columnCount, 'up', indexString)
				}
			},
			handleDownKey(currentIndex, indexString){
				let playerIndex = this.characterId === this.users[0] ? this.playerIndex : this.enemyIndex
				let playerState = this.characterId === this.users[0] ? this.playerState : this.enemyState
				let lastRowStart = this.boardState.length - this.columnCount;

				if(currentIndex >= lastRowStart && currentIndex <= this.boardState.length - 1){
					let difference = currentIndex - lastRowStart
					let oldPlayerIndex = currentIndex;
					let temp = this.boardState[difference]
					playerIndex = difference;

					if(temp === 25) return console.log('there is a wall here')
                    if(temp === 100 || temp === 1) return console.log('there is a player here')

					if(this.characterId === this.users[0]){
						this.playerIndex = playerIndex;
					} else {
						this.enemyIndex = playerIndex;
					}

					this.boardState[playerIndex] = playerState
					this.boardState[oldPlayerIndex] = temp;

					this.socket.emit('sendUpdatePlayerIndex', {
						player: this.characterId === this.users[0] ? 1 : 100,
						index: this[indexString],
						oldIndex: oldPlayerIndex,
						oldValue: temp,
					})
				} else {
					if(this.boardState[playerIndex + this.columnCount] === 25) return console.log('you are hitting a wall bro')
					if(this.boardState[playerIndex + this.columnCount] === 1 || this.boardState[playerIndex + this.columnCount] === 100) return console.log('you are hitting a wall bro')

					this.swap(currentIndex + this.columnCount, playerIndex + this.columnCount, 'down', indexString)
				}
			},
			swap(nonPlayerIndex, newPlayerIndex, keyCode, indexString){
				//decide if this is player 1 or player 2
				let playerState = this.characterId === this.users[0] ? 'playerState' : 'enemyState'
				let playerStatus = this.characterId === this.users[0] ? 'playerStatus' : 'enemyStatus'

				//if there is a piece you are moving off of is not blank, then this will make sure it stays
				if(this.previousPieceState !== 0) {
					//code for deciding if it is the 1st or 2nd player
					if(this.characterId === this.users[0]){
						this.playerIndex = newPlayerIndex;
						this[indexString] = this.playerIndex;
					} else {
						this.enemyIndex = newPlayerIndex;
						this[indexString] = this.enemyIndex
					}
					this.boardState[this[indexString]] = this[playerState];
					this.boardState[this[indexString] + this.swapLookUpTable[keyCode]] = this.previousPieceState;
					return this.previousPieceState = 0;
				}

				//handle previous piece if it is a blank tile
				let temp = 0;
				//decide status if the tile we are moving to is not blank
				if(this.boardState[nonPlayerIndex] !== 0) {
					this.decideStatus(playerStatus, this.boardState[nonPlayerIndex]);
					this.previousPieceState = this.boardState[nonPlayerIndex]
				}

				//code for deciding if it is the 1st or 2nd player
				if(this.characterId === this.users[0]){
					this.playerIndex = newPlayerIndex;
					this[indexString] = this.playerIndex;
				} else {
					this.enemyIndex = newPlayerIndex;
					this[indexString] = this.enemyIndex
				}
				this.boardState[this[indexString]] = this[playerState];
				this.boardState[this[indexString] + this.swapLookUpTable[keyCode]] = temp;

				// this.socket.emit('sendUpdatePlayerIndex', {
				// 	player: this.characterId === this.users[0] ? 1 : 100,
                //     index: this[indexString],
                //     oldIndex: this[indexString] + this.swapLookUpTable[keyCode],
                //     oldValue: temp,
                // })
			},
			decideStatus(playerStatus, pieceState, eventKeyCode){
				let statusString = this.playerKeyCodes.includes(eventKeyCode) ? 'playerStatus' : 'enemyStatus';
				switch (pieceState) {
					case 2: return this[statusString] = this.playerStatusFireLookUpTable[playerStatus]
					case 3: return this[statusString] = this.playerStatusWaterLookUpTable[playerStatus]
				}
			},
			async findAttackTiles(numToSubtract, numToAdd, currentPlayerIndex, enemy, damageAmount){
				let subtractTileIndex = currentPlayerIndex
				let addTileIndex = currentPlayerIndex - 1;
				let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
				let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'
				let livesAmountString = enemy ? 'playerLives' : 'enemyLives'

				for(let i = 0; i < numToSubtract; i++) {
					subtractTileIndex--;
					if(subtractTileIndex !== currentPlayerIndex) {
						if(this.boardState[subtractTileIndex] === 25) break;

						if(this.boardState[subtractTileIndex === 10] || this.boardState[subtractTileIndex] === 11){
							this[tempTiles].push(0)
						} else if ((this.boardState[subtractTileIndex] === 1 && enemy === true) || (this.boardState[subtractTileIndex] === 100 && enemy === false)) {
							this.handleLivesAmount(enemy, livesAmountString, damageAmount)
							continue;
						} else {
							this[tempTiles].push(this.boardState[subtractTileIndex])
						}
						this[attackTiles].push(subtractTileIndex)
					}
				}
				for(let i = 0; i < numToAdd; i++){
					addTileIndex++;
					if(addTileIndex !== currentPlayerIndex){
						if(this.boardState[addTileIndex] === 25) break;

						if(this.boardState[addTileIndex] === 10 || this.boardState[addTileIndex] === 11){
							this[tempTiles].push(0)
						} else if ((this.boardState[addTileIndex] === 1 && enemy === true) || (this.boardState[addTileIndex] === 100 && enemy === false)) {
							this.handleLivesAmount(enemy, livesAmountString, damageAmount)
							continue;
						} else {
							this[tempTiles].push(this.boardState[addTileIndex])
						}
						this[attackTiles].push(addTileIndex)
					}
				}
			},
			async findAttackTilesVertical(numDownward, numUpward, enemy, damageAmount){
				let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
				let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'
				let livesAmountString = enemy ? 'playerLives' : 'enemyLives'

				if(numDownward >= 0) {
					if(this.boardState[numDownward] === 25) {
						console.log('you are hitting a wall downward')
					} else if(this.boardState[numDownward] === 10 || this.boardState[numDownward] === 11){
						this[tempTiles].push(0)
						this[attackTiles].push(numDownward);
					} else if ((this.boardState[numDownward] === 1 && enemy === true) || (this.boardState[numDownward] === 100 && enemy === false)) {
                        this.handleLivesAmount(enemy, livesAmountString, damageAmount)
					} else {
						this[tempTiles].push(this.boardState[numDownward])
						this[attackTiles].push(numDownward);
					}
				}
				if(numUpward < 100) {
					if(this.boardState[numUpward] === 25){
						console.log('you are hitting a wall upward')
					} else if(this.boardState[numUpward] === 10 || this.boardState[numUpward] === 11){
						this[attackTiles].push(numUpward)
						this[tempTiles].push(0)
					} else if ((this.boardState[numUpward] === 1 && enemy === true) || (this.boardState[numUpward] === 100 && enemy === false)) {
                        this.handleLivesAmount(enemy, livesAmountString, damageAmount)
					} else {
						this[tempTiles].push(this.boardState[numUpward])
						this[attackTiles].push(numUpward)
					}
				}

				while(numDownward - 10 >= 0){
					numDownward = numDownward - 10;

					if(this.boardState[numDownward + 10] === 25) break;
					if(this.boardState[numDownward] === 25) break;

					if(this.boardState[numDownward] === 10 || this.boardState[numDownward] === 11){
						this[tempTiles].push(0)
					} else if ((this.boardState[numDownward] === 1 && enemy === true) || (this.boardState[numDownward] === 100 && enemy === false)) {
                        this.handleLivesAmount(enemy, livesAmountString, damageAmount)
						continue;
					} else {
						this[tempTiles].push(this.boardState[numDownward])
					}

					this[attackTiles].push(numDownward);
				}
				while(numUpward + 10 < 100){
					numUpward = numUpward + 10;

					if(this.boardState[numUpward - 10] === 25) break;
					if(this.boardState[numUpward] === 25) break;

					if(this.boardState[numUpward] === 10 || this.boardState[numUpward] === 11){
						this[tempTiles].push(0)
					} else if ((this.boardState[numUpward] === 1 && enemy === true) || (this.boardState[numUpward] === 100 && enemy === false)) {
                        this.handleLivesAmount(enemy, livesAmountString, damageAmount)
						continue;
					} else {
						this[tempTiles].push(this.boardState[numUpward])
					}

					this[attackTiles].push(numUpward);
				}
			},
			async assignAttackTiles(direction,enemy){
				let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'

				this[attackTiles].forEach((attackTile,index) =>{
					Vue.set(this.boardState, attackTile, direction === 'horizontal' ? 10 : 11)
				})
			},
			async resetAttackTiles(enemy){
				let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
				let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'

				this[attackTiles].forEach((value, index) => {
					console.log(value, index, this[tempTiles][index])
					Vue.set(this.boardState, value, this[tempTiles][index])
				})
			},
			handleLivesAmount(enemy, livesAmountString, damageAmount){
				console.log({player: enemy ? 1 : 100, lives: this[livesAmountString] - 1}, 'sending player lives')
				this.socket.emit('sendPlayerLives', {player: enemy ? 1 : 100, lives: this[livesAmountString] - damageAmount})
			},
            handleKeyDownListener(e){
	            if(this.gameOver === true) return

	            if(e.key === 'f' || e.key === '0') {
		            if(this.characterId === this.users[0]){
			            this.playerStatus = 'charging'
                        this.playerChargeTimeStart = e.timeStamp;
			            this.socket.emit('sendPlayerStatusChange', {player: 1, status: 'charging'})
		            } else if (this.characterId === this.users[1]){
			            this.enemyStatus = 'charging'
                        this.enemyChargeTimeStart = e.timeStamp;
			            this.socket.emit('sendPlayerStatusChange', {player: 100, status: 'charging'})
		            }
	            }

	            if(e.shiftKey === true || e.key === 'q' || e.key === 'Q') {
	            	console.log('we are doing a melee attack')
		            if(this.characterId === this.users[0]){
                        if(this.playerStatus === 'charging' || this.playerStatus === 'attacking' ||
                            this.playerStatus === 'melee' || this.playerStatus === 'melee cooldown') return
			            this.playerStatus = 'melee'
			            this.socket.emit('sendPlayerStatusChange', {player: 1, status: 'melee'})
			            this.socket.emit('sendMeleeAttack', {player: 1, type: 'cross'})
		            } else if (this.characterId === this.users[1]){
                        if(this.enemyStatus === 'charging' || this.enemyStatus === 'attacking'||
                            this.enemyStatus === 'melee' || this.enemyStatus === 'melee cooldown') return
			            this.enemyStatus = 'melee'
			            this.socket.emit('sendPlayerStatusChange', {player: 100, status: 'melee'})
                        this.socket.emit('sendMeleeAttack', {player: 100, type: 'cross'})
		            }
                }

                if(e.key === 'v' || e.key === 'V' || e.key === 'e' || e.key === 'E') {
                    console.log('we are doing a melee X attack')
                    if(this.characterId === this.users[0]){
                        if(this.playerStatus === 'charging' || this.playerStatus === 'attacking' ||
                            this.playerStatus === 'melee' || this.playerStatus === 'melee cooldown') return
                        this.playerStatus = 'melee'
                        this.socket.emit('sendPlayerStatusChange', {player: 1, status: 'melee'})
                        this.socket.emit('sendMeleeAttack', {player: 1, type: 'x'})
                    } else if (this.characterId === this.users[1]){
                        if(this.enemyStatus === 'charging' || this.enemyStatus === 'attacking'||
                            this.enemyStatus === 'melee' || this.enemyStatus === 'melee cooldown') return
                        this.enemyStatus = 'melee'
                        this.socket.emit('sendPlayerStatusChange', {player: 100, status: 'melee'})
                        this.socket.emit('sendMeleeAttack', {player: 100, type: 'x'})
                    }
                }

	            if(this.moveDelay === true) {
	                return console.log('you are on a delay my guy')
                } else {
	                this.moveDelay = true;
	                setTimeout(() => {
	                    this.moveDelay = false;
                    }, 50)
                }

	            return this.handleKeyDownEvent(e);
            },
            handleKeyUpListener(e){
	            if(this.gameOver === true) return
                if(this.attackPressed === true) return console.log('attack pressed is true')


	            if(this.playerStatus === 'charging' && this.characterId === this.users[0]) {
		            this.handleAttack(e, false)
                    this.attackPressed = true;
		            return setTimeout(() => { this.attackPressed = false }, 250) ;
	            } else if (this.enemyStatus === 'charging' && this.characterId === this.users[1]){
		            this.handleAttack(e, true)
	            	this.attackPressed = true;
		            return setTimeout(() => { this.attackPressed = false }, 250)
	            }
            },
            exitWindow(){
	            this.socket.emit('disconnectFromRoom', this.characterId === this.users[0] ? 1 : 100 )
	            window.removeEventListener('keydown', this.handleKeyDownEventListener);
	            window.removeEventListener('keyup', this.handleKeyUpEventListener);
            },
            playStepSound(player){
		    	if(player === 1){
		    		this.playerOneStepSoundEffect.time = 0;
				    this.playerOneStepSoundEffect.volume = Math.random() / 3;
		    		this.playerOneStepSoundEffect.play();
                } else {
				    this.playerTwoStepSoundEffect.time = 0;
				    this.playerOneStepSoundEffect.volume = Math.random() / 3;
				    this.playerTwoStepSoundEffect.play();
                }
            }
		},
		created(){
			this.playerUserName = this.selectedCharacter;
            this.joinServer();
            console.log('we are joining the server', this.characterId, this.roomId, this.selectedMap);

            this.fightCountDownSoundEffect.loop = false;
            this.fightCountDownSoundEffect.addEventListener('ended', () => {
            	this.fightCountDownSoundEffect.time = 0;
            	this.fightCountDownSoundEffect.pause();
            }, false)
            this.playerOneStepSoundEffect.loop = false;
            this.playerTwoStepSoundEffect.loop = false;
            this.playerHitSoundEffect.loop = false;

			window.addEventListener('beforeunload', this.exitWindow)
			window.addEventListener('keydown', this.handleKeyDownListener)
			// window.addEventListener('keyup', this.handleKeyUpListener)
		},
        mounted(){
		    document.getElementById('multiplayer-board').addEventListener('auxclick', (e) => {
		    	if(`${e.which}${e.button}` === '32') {
		    		let eventObject = {key: 'f', timeStamp: e.timeStamp}
		    		return this.handleKeyDownListener(eventObject);
			    }

            })
        },
		beforeDestroy(){
			console.log('I am being disconnected dude', this.characterId === this.users[0] ? 1 : 100)
			this.socket.emit('disconnectFromRoom', this.characterId === this.users[0] ? 1 : 100 )
            this.socket.disconnect()
            console.log('just sent the emit')
			window.removeEventListener('keydown', this.handleKeyDownEventListener);
			window.removeEventListener('keyup', this.handleKeyUpEventListener);
			console.log('we have removed the event listener')
		}
	}
</script>

<style scoped>
    mark{
        background-color: orange;
    }
    .rematch-btn{
        background: linear-gradient(320deg, #8a18d0, #bd3ce7, #550a6d, #9248a5);
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
        transition: 0.2s ease;
    }

    .board-piece:hover{
        opacity: 0.8;
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

    .rematch-btn:hover{
        transform: translateX(15px);
    }
</style>