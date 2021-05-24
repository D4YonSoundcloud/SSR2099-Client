<template>
    <div class="board-container" :style="boardContainerStyle">
        <PlayerUI :enemy="false" :multiplayer="false" :playerStatus="playerStatus"></PlayerUI>
        <div class="board" :style="boardStyle">
            <BoardPiece :pieceIndex="index"  v-for="(piece, index) in boardState" :key="index"
                        :state="piece" :playerIndex="index === playerIndex ? playerIndex : undefined"
                        :playerUserName="index === playerIndex ? 'D4Y' : undefined"
                        :buttonPressed="buttonPressed"
                        :pieceWidth="boardPieceHeightAndWidth" :playerStatus="index === playerIndex ? playerStatus : 'normal'"
                        :enemyUserName="index === enemyIndex ? 'KABBAGE' : undefined"
                        :enemyIndex="index === enemyIndex ? enemyIndex : undefined" :enemyStatus="enemyStatus"
                        :pieceHeight="boardPieceHeightAndWidth">
            </BoardPiece>
            <h1 v-if="gameOver === true" style="margin-top: 16px">
                Game Over!
                {{playerLivesStore < 1 ? 'Player 2' : 'Player 1'}}
                <mark style="padding: 4px">won</mark>,
                and {{playerLivesStore < 1 ? 'Player 1' : 'Player 2' }}
                <mark style="padding: 4px">lost</mark>
            </h1>
        </div>
        <PlayerUI :enemy="true" :multiplayer="false" :enemyStatus="enemyStatus"></PlayerUI>
    </div>
</template>

<script>

    import Vue from 'vue'
    import BoardPiece from "./BoardPiece";
    import PlayerUI from "./PlayerUI";
    import * as d3 from 'd3-scale'
	export default {
		name: "Board",
        components:{BoardPiece, PlayerUI},
        data(){
			return{
			    gameOver: false,
				boardState:[
					0,0,0,0,0,0,0,0,0,0,
					0,0,25,0,0,0,0,25,0,0,
					0,25,0,0,0,0,0,0,25,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,25,0,0,0,0,0,0,25,0,
					0,0,25,0,0,0,0,25,0,0,
					0,0,0,0,0,0,0,0,0,0,
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
                playerAttackChargeNumber: 0,
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
                buttonPressed: '',
                chargeScale: d3.scaleLinear().domain([50,1000]).range([5,20]).clamp(true),
            }
        },
        computed:{
			boardPieceHeightAndWidth(){
				return this.boardWidth / 10
            },
            boardContainerStyle(){
				return {
					paddingBottom: 2.5 + '%',
					height: 100 + 'vh',
                    width: 100 + 'vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 1175 + 'px',
                    color: 'white',
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
            playerLivesStore(){
			    return this.$store.state.playerLivesStore
            },
            enemyLivesStore(){
			    return this.$store.state.enemyLivesStore
            }
        },
        watch:{
            playerLivesStore(){
                if(this.playerLivesStore < 1){
                    return this.gameOver = true;
                }
            },
            enemyLivesStore(){
                if(this.enemyLivesStore < 1){
                    return this.gameOver = true;
                }
            }
        },
        methods:{
		    handleKeyDownEvent(e) {
		    	if(this.playerStatus === 'attacking' || this.playerStatus === 'charging') {

				    this.playerChargeTimeEnd = e.timeStamp;
				    let difference = this.playerChargeTimeEnd - this.playerChargeTimeStart
                    this.playerAttackDamage = this.chargeScale(difference);
				    console.log(this.playerChargeTimeStart, this.playerChargeTimeEnd, difference, this.chargeScale(difference), this.playerAttackChargeNumber)

				    return this.handleAttack(e, false, this.playerAttackDamage);

                }
		    	if(this.enemyStatus === 'attacking' || this.enemyStatus === 'charging') {

				    this.enemyChargeTimeEnd = e.timeStamp;
				    let difference = this.enemyChargeTimeEnd - this.enemyChargeTimeStart
                    this.enemyAttackDamage = this.chargeScale(difference);
				    console.log(this.enemyChargeTimeStart, this.enemyChargeTimeEnd, difference, this.chargeScale(difference))

				    return this.handleAttack(e, true, this.enemyAttackDamage);
			    }

		    	if(this.keyCodes[e.keyCode] === 'right') {
                    this.buttonPressed = 'right';
		    		console.log('right')
		    		return this.handleRightKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
                } else if(this.keyCodes[e.keyCode] === 'left') {
                    this.buttonPressed = 'left';
				    console.log('left')
				    return this.handleLeftKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
			    } else if(this.keyCodes[e.keyCode] === 'up') {
                    this.buttonPressed = 'up';
				    console.log('up')
				    return this.handleUpKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
			    } else if(this.keyCodes[e.keyCode] === 'down') {
                    this.buttonPressed = 'down';
				    console.log('down')
				    return this.handleDownKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
			    }
		    },
            handleAttack(e, enemy, damageAmount){
		    	console.log('this is an enemy attacking', enemy)
	            if(this.playerStatus === 'attacking' && enemy === false) return console.log('you are already attacking')
	            if(this.enemyStatus === 'attacking' && enemy === true) return console.log('you are already attacking')

		        if(this.keyCodes[e.keyCode] === 'right' || this.keyCodes[e.keyCode] === 'left') {
		        	return this.handleHorizontalAttack(enemy ? this.enemyIndex : this.playerIndex, enemy, damageAmount)
                } else if (this.keyCodes[e.keyCode] === 'up' || this.keyCodes[e.keyCode] === 'down') {
		        	return this.handleVerticalAttack(enemy ? this.enemyIndex : this.playerIndex, enemy, damageAmount);
                }
            },
            handleHorizontalAttack(currentPlayerIndex, enemy, damageAmount){
		    	let numToSubtract = currentPlayerIndex % 10
                let numToAdd = this.rowCount - numToSubtract

                enemy ? this.enemyStatus = 'attacking' : this.playerStatus = 'attacking';

		    	this.findAttackTiles(numToSubtract, numToAdd, currentPlayerIndex, enemy, damageAmount).then(() => {
		    		this.assignAttackTiles('horizontal',enemy).then(() => {
		    			console.log('attack is on cooldown', performance.now())
					    this.attackCoolDown(enemy);
                    });
				    console.log(this.playerAttackTiles, this.playerAttackTempTilesState)
		    	    console.log('this is a horizontal attack', numToSubtract, numToAdd, this.playerIndex)
                });
            },
            handleVerticalAttack(currentPlayerIndex, enemy, damageAmount){
	            let trackingNumDownward = currentPlayerIndex - 10;
	            let trackingNumUpward = currentPlayerIndex + 10;

	            enemy ? this.enemyStatus = 'attacking' : this.playerStatus = 'attacking';

	            this.findAttackTilesVertical(trackingNumDownward, trackingNumUpward, enemy, damageAmount).then(() => {
                    this.assignAttackTiles('vertical', enemy).then(() => {
	                    this.attackCoolDown(enemy)
                    })
		            console.log('this is a vertical attack')
                })
            },
            handleRightKey(currentIndex, keyCode){
		    	let playerIndex = this.playerKeyCodes.includes(keyCode) ? this.playerIndex : this.enemyIndex

                console.log(this.boardState[currentIndex + 1])

                if ((currentIndex + 1)%this.columnCount === 0) {
                	if(this.boardState[currentIndex + 1] === 25) return console.log('this is a wall')
                    if(this.boardState[currentIndex - (this.columnCount - 1)] === 1 || this.boardState[currentIndex - (this.columnCount - 1)] === 100) return

	                this.swap(currentIndex - (this.columnCount - 1), playerIndex - (this.columnCount - 1),'rightWall', keyCode)
                } else {
                	if(this.boardState[currentIndex + 1] === 25) return console.log('this is a wall')
                    if(this.boardState[currentIndex + 1] === 1 || this.boardState[currentIndex + 1] === 100) return console.log('this is a wall')

	                this.swap(currentIndex + 1, playerIndex + 1,'right', keyCode)
                }
            },
            handleLeftKey(currentIndex, keyCode){
	            let playerIndex = this.playerKeyCodes.includes(keyCode) ? this.playerIndex : this.enemyIndex

	            if ((currentIndex + 1)%this.columnCount === 1) {
	            	if(this.boardState[currentIndex - 1] === 25) return console.log('this is a wall')
                    if(this.boardState[currentIndex + (this.columnCount - 1)] === 1 || this.boardState[currentIndex + (this.columnCount - 1)] === 100) return

		            this.swap(currentIndex + (this.columnCount - 1), playerIndex + (this.columnCount - 1),'leftWall', keyCode)
	            } else {
		            if(this.boardState[currentIndex - 1] === 25) return console.log('this is a wall')

                    if(this.boardState[currentIndex - 1] === 1 || this.boardState[currentIndex - 1] === 100) return console.log('this is a wall')
		            this.swap(currentIndex - 1, playerIndex - 1, 'left', keyCode)
	            }
            },
            handleUpKey(currentIndex,eventKeyCode){
		    	let firstRowEnd = this.columnCount - 1;
		    	let lastRowStart = this.boardState.length - this.columnCount;
	            let playerIndex = this.playerKeyCodes.includes(eventKeyCode) ? this.playerIndex : this.enemyIndex
	            let playerState = this.playerKeyCodes.includes(eventKeyCode) ? this.playerState : this.enemyState

                console.log(this.boardState[playerIndex - this.columnCount])

		    	if(currentIndex <= firstRowEnd){
		    		let oldPlayerIndex = currentIndex;
		    		let temp = this.boardState[lastRowStart + currentIndex]

                    if(temp === 25) return console.log('there is a wall here')
                    if(temp === 100 || temp === 1) return console.log('there is a player here')

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
		    		if(this.boardState[playerIndex - this.columnCount] === 25) return console.log('you are hitting a wall dude')
                    if(this.boardState[playerIndex - this.columnCount] === 1 || this.boardState[playerIndex - this.columnCount] === 100) return console.log('you are hitting a wall dude')

				    this.swap(currentIndex - this.columnCount, playerIndex - this.columnCount, 'up', eventKeyCode)
                }
            },
	        handleDownKey(currentIndex,eventKeyCode){
		        let playerIndex = this.playerKeyCodes.includes(eventKeyCode) ? this.playerIndex : this.enemyIndex
		        let playerState = this.playerKeyCodes.includes(eventKeyCode) ? this.playerState : this.enemyState
		        let lastRowStart = this.boardState.length - this.columnCount;

		        if(currentIndex >= lastRowStart && currentIndex <= this.boardState.length - 1){
		        	let difference = currentIndex - lastRowStart
			        let oldPlayerIndex = currentIndex;
			        let temp = this.boardState[difference]
			        playerIndex = difference;

			        if(temp === 25) return console.log('there is a wall here')
                    if(temp === 100 || temp === 1) return console.log('there is a player here')

			        if(this.playerKeyCodes.includes(eventKeyCode)){
				        this.playerIndex = playerIndex;
			        } else {
				        this.enemyIndex = playerIndex;
			        }

			        this.boardState[playerIndex] = playerState
			        this.boardState[oldPlayerIndex] = temp;
		        } else {
		        	if(this.boardState[playerIndex + this.columnCount] === 25) return console.log('you are hitting a wall bro')
                    if(this.boardState[playerIndex + this.columnCount] === 1 || this.boardState[playerIndex + this.columnCount] === 100) return console.log('you are hitting a wall bro')

			        this.swap(currentIndex + this.columnCount, playerIndex + this.columnCount, 'down', eventKeyCode)
		        }
	        },
            swap(nonPlayerIndex, newPlayerIndex, keyCode, eventKeyCode){
		    	//decide if this is player 1 or player 2
	            let playerIndex = this.playerKeyCodes.includes(eventKeyCode) ? this.playerIndex : this.enemyIndex
                let playerState = this.playerKeyCodes.includes(eventKeyCode) ? this.playerState : this.enemyState
                let playerStatus = this.playerKeyCodes.includes(eventKeyCode) ? this.playerStatus : this.enemyStatus;

		    	//if there is a piece you are moving off of is not blank, then this will make sure it stays
	            if(this.previousPieceState !== 0) {
	                //code for deciding if it is the 1st or 2nd player
	            	if(this.playerKeyCodes.includes(eventKeyCode)){
	            		this.playerIndex = newPlayerIndex;
	            		playerIndex = this.playerIndex;
                    } else {
	            		this.enemyIndex = newPlayerIndex;
	            		playerIndex = this.enemyIndex
                    }
		            this.boardState[playerIndex] = playerState;
		            this.boardState[playerIndex + this.swapLookUpTable[keyCode]] = this.previousPieceState;
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
	            if(this.playerKeyCodes.includes(eventKeyCode)){
		            this.playerIndex = newPlayerIndex;
		            playerIndex = this.playerIndex;
	            } else {
		            this.enemyIndex = newPlayerIndex;
		            playerIndex = this.enemyIndex
	            }
	            this.boardState[playerIndex] = playerState;
	            this.boardState[playerIndex + this.swapLookUpTable[keyCode]] = temp;
            },
            decideStatus(playerStatus, pieceState, eventKeyCode){
                let statusString = this.playerKeyCodes.includes(eventKeyCode) ? 'playerStatus' : 'enemyStatus';
                switch (pieceState) {
                	case 2: return this[statusString] = this.playerStatusFireLookUpTable[playerStatus]
                    case 3: return this[statusString] = this.playerStatusWaterLookUpTable[playerStatus]
                }
            },
            attackCoolDown(enemy){
		    	setTimeout(() => {
				    console.log(this.boardState, enemy, 'we are cooling down')
		    		this.resetAttackTiles(enemy).then(() => {
					    let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
					    let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'
                        let status = enemy ? 'enemyStatus' : 'playerStatus'

					    this[status] = 'normal'
					    this[attackTiles] = [];
					    this[tempTiles] = [];
                    })
                }, 250)
            },
            async findAttackTiles(numToSubtract, numToAdd, currentPlayerIndex, enemy, damageAmount){
		    	let subtractTileIndex = currentPlayerIndex
                let addTileIndex = currentPlayerIndex - 1;
		    	let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
		    	let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'
                let livesAmountDispatchString = enemy ? 'getChangePlayerLives' : 'getChangeEnemyLives'
                let livesAmountString = enemy ? 'playerLivesStore' : 'enemyLivesStore'

		    	for(let i = 0; i < numToSubtract; i++) {
		    		subtractTileIndex--;
		    		if(subtractTileIndex !== currentPlayerIndex) {
		    			if(this.boardState[subtractTileIndex] === 25) break;

		    			if(this.boardState[subtractTileIndex === 10] || this.boardState[subtractTileIndex] === 11){
						    this[tempTiles].push(0)
                        } else if (this.boardState[subtractTileIndex] === 1 || this.boardState[subtractTileIndex] === 100) {
                            this.handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount)
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
					    } else if (this.boardState[addTileIndex] === 1 || this.boardState[addTileIndex] === 100) {
                            this.handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount)
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
                let livesAmountDispatchString = enemy ? 'getChangePlayerLives' : 'getChangeEnemyLives'
                let livesAmountString = enemy ? 'playerLivesStore' : 'enemyLivesStore'

		    	if(numDownward >= 0) {
		    		if(this.boardState[numDownward] === 25) {
		    			console.log('you are hitting a wall downward')
                    } else if(this.boardState[numDownward] === 10 || this.boardState[numDownward] === 11){
					    this[tempTiles].push(0)
                        this[attackTiles].push(numDownward);
				    } else if (this.boardState[numDownward] === 1 || this.boardState[numDownward] === 100) {
                        this.handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount)
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
				    } else if (this.boardState[numUpward] === 1 || this.boardState[numUpward] === 100) {
                        this.handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount)
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
	                } else if (this.boardState[numDownward] === 1 || this.boardState[numDownward] === 100) {
                        this.handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount)
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
	                } else if (this.boardState[numUpward] === 1 || this.boardState[numUpward] === 100) {
                        this.handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount)
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
                let damageAmount = enemy ? 'enemyAttackDamage' : 'playerAttackDamage'

	            this[attackTiles].forEach((value, index) => {
	            	console.log(value, index, this[tempTiles][index])
                    Vue.set(this.boardState, value, this[tempTiles][index])
	            })

                this[damageAmount] = 0;

	            console.log(this[damageAmount])
            },
            handleLivesAmount(livesAmountDispatchString, livesAmountString, damageAmount){
		    	console.log(damageAmount);
		        this.$store.dispatch(livesAmountDispatchString, this[livesAmountString] - damageAmount)
            },
            handleKeyDownEventListener(e){
	            if(this.gameOver === true) return
	            if(e.key === 'f' || e.key === 'v') {
	            	this.playerChargeTimeStart = e.timeStamp;
	            	return this.playerStatus = 'charging'
	            }
	            if(e.key === '0') {
		            this.enemyChargeTimeStart = e.timeStamp;
	            	return this.enemyStatus = 'charging'
	            }
	            return this.handleKeyDownEvent(e);
            },
            handleKeyUpEventListener(e){
	            if(this.gameOver === true) return
	            if(this.playerStatus === 'charging' && e.key !== 'f' && e.key !== 'v') {
		            return this.handleAttack(e, false);
	            } else if (this.enemyStatus === 'charging'){
		            return this.handleAttack(e, true)
	            }
            }
        },
        created(){
			this.boardState[this.playerIndex] = this.playerState
			this.boardState[this.enemyIndex] = this.enemyState

            window.addEventListener('keydown', this.handleKeyDownEventListener)
            // window.addEventListener('keyup', this.handleKeyUpEventListener)
        },
        beforeDestroy(){
			console.log('removing the event listeners')
			window.removeEventListener('keydown', this.handleKeyDownEventListener);
			window.removeEventListener('keyup', this.handleKeyUpEventListener)
        }
	}
</script>

<style scoped>
    .board-container{
        background: linear-gradient(181deg, #2d0446, #3e124c, #32153c, #000000);
        background-size: 400% 400%;
        animation: gradient 30s ease infinite;
    }

    .board{
        background: linear-gradient(181deg, #2d0446, #3e124c, #32153c, #000000);
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
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
</style>