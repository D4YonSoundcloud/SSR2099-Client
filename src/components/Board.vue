<template>
    <div class="board-container" :style="boardContainerStyle">
        <div class="board" :style="boardStyle">
            <BoardPiece :pieceIndex="index"  v-for="(piece, index) in boardState" :key="index"
                        :state="piece" :playerIndex="index === playerIndex ? playerIndex : undefined"
                        :pieceWidth="boardPieceHeightAndWidth" :playerStatus="index === playerIndex ? playerStatus : 'normal'"
                        :enemyIndex="index === enemyIndex ? enemyIndex : undefined" :enemyStatus="enemyStatus"
                        :pieceHeight="boardPieceHeightAndWidth"></BoardPiece>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import BoardPiece from "./BoardPiece";
	export default {
		name: "Board",
        components:{BoardPiece},
        data(){
			return{
				boardState:[
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,2,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
					0,0,0,3,0,0,0,0,0,0,
					0,0,0,0,0,0,0,0,0,0,
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
                enemyIndex: 99,
                enemyState: 100,
				enemyStatus: 'normal',
				enemyAttackTiles:[],
				enemyAttackTempTilesState:[],
				boardWidth: 500,
                boardHeight: 250,
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
                }
            }
        },
        computed:{
			boardPieceHeightAndWidth(){
				return this.boardWidth / 10
            },
            boardContainerStyle(){
				return {
					paddingTop: 5 + '%',
					height: 100 + 'vh',
                    width: 100 + 'vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center'
                }
            },
            boardStyle(){
				return {
					height: this.boardHeight + 'px',
                    width: this.boardWidth + 'px',
                    display: 'flex',
                    flexFlow: 'row wrap'
                }
            }
        },
        methods:{
		    handleKeyDownEvent(e) {
		    	if(this.playerStatus === 'attacking' || this.playerStatus === 'charging') return console.log('you are on cooldown!')
		    	if(this.enemyStatus === 'attacking' || this.enemyStatus === 'charging') return console.log('you are on cooldown!')

		    	if(this.keyCodes[e.keyCode] === 'right') {
		    		console.log('right')
		    		return this.handleRightKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
                } else if(this.keyCodes[e.keyCode] === 'left') {
				    console.log('left')
				    return this.handleLeftKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
			    } else if(this.keyCodes[e.keyCode] === 'up') {
				    console.log('up')
				    return this.handleUpKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
			    } else if(this.keyCodes[e.keyCode] === 'down') {
				    console.log('down')
				    return this.handleDownKey(this.playerKeyCodes.includes(e.keyCode) ? this.playerIndex : this.enemyIndex, e.keyCode)
			    }
		    },
            handleAttack(e, enemy){
		    	console.log('this is an enemy attacking', enemy)
	            if(this.playerStatus === 'attacking' && enemy === false) return console.log('you are already attacking')
	            if(this.enemyStatus === 'attacking' && enemy === true) return console.log('you are already attacking')

		        if(this.keyCodes[e.keyCode] === 'right' || this.keyCodes[e.keyCode] === 'left') {
		        	return this.handleHorizontalAttack(enemy ? this.enemyIndex : this.playerIndex, enemy)
                } else if (this.keyCodes[e.keyCode] === 'up' || this.keyCodes[e.keyCode] === 'down') {
		        	return this.handleVerticalAttack(enemy ? this.enemyIndex : this.playerIndex, enemy);
                }
            },
            handleHorizontalAttack(currentPlayerIndex, enemy){
		    	let numToSubtract = currentPlayerIndex % 10
                let numToAdd = this.rowCount - numToSubtract

                enemy ? this.enemyStatus = 'attacking' : this.playerStatus = 'attacking';

		    	this.findAttackTiles(numToSubtract, numToAdd, currentPlayerIndex, enemy).then(() => {
				    console.log(performance.now());
		    		this.assignAttackTiles('horizontal',enemy).then(() => {
		    			console.log('attack is on cooldown', performance.now())
					    this.attackCoolDown(enemy);
                    });
				    console.log(this.playerAttackTiles, this.playerAttackTempTilesState)
		    	    console.log('this is a horizontal attack', numToSubtract, numToAdd, this.playerIndex)
                });
            },
            handleVerticalAttack(currentPlayerIndex, enemy){
	            let trackingNumDownward = currentPlayerIndex - 10;
	            let trackingNumUpward = currentPlayerIndex + 10;

	            enemy ? this.enemyStatus = 'attacking' : this.playerStatus = 'attacking';

	            this.findAttackTilesVertical(trackingNumDownward, trackingNumUpward, enemy).then(() => {
                    this.assignAttackTiles('vertical', enemy).then(() => {
	                    this.attackCoolDown(enemy)
                    })
		            console.log('this is a vertical attack')
                })
            },
            handleRightKey(currentIndex, keyCode){
		    	let playerIndex = this.playerKeyCodes.includes(keyCode) ? this.playerIndex : this.enemyIndex

                if ((currentIndex + 1)%this.columnCount === 0) {
	                this.swap(currentIndex - (this.columnCount - 1), playerIndex - (this.columnCount - 1),'rightWall', keyCode)
                } else {
	                this.swap(currentIndex + 1, playerIndex + 1,'right', keyCode)
                }
            },
            handleLeftKey(currentIndex, keyCode){
	            let playerIndex = this.playerKeyCodes.includes(keyCode) ? this.playerIndex : this.enemyIndex

	            if ((currentIndex + 1)%this.columnCount === 1) {
		            this.swap(currentIndex + (this.columnCount - 1), playerIndex + (this.columnCount - 1),'leftWall', keyCode)
	            } else {
		            this.swap(currentIndex - 1, playerIndex - 1, 'left', keyCode)
	            }
            },
            handleUpKey(currentIndex,eventKeyCode){
		    	let firstRowEnd = this.columnCount - 1;
		    	let lastRowStart = this.boardState.length - this.columnCount;
	            let playerIndex = this.playerKeyCodes.includes(eventKeyCode) ? this.playerIndex : this.enemyIndex
	            let playerState = this.playerKeyCodes.includes(eventKeyCode) ? this.playerState : this.enemyState

		    	if(currentIndex <= firstRowEnd){
		    		let oldPlayerIndex = currentIndex;
		    		let temp = this.boardState[lastRowStart + currentIndex]

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

			        if(this.playerKeyCodes.includes(eventKeyCode)){
				        this.playerIndex = playerIndex;
			        } else {
				        this.enemyIndex = playerIndex;
			        }

			        this.boardState[playerIndex] = playerState
			        this.boardState[oldPlayerIndex] = temp;
		        } else {
			        this.swap(currentIndex + this.columnCount, playerIndex + this.columnCount, 'down', eventKeyCode)
		        }
	        },
            swap(nonPlayerIndex, newPlayerIndex, keyCode, eventKeyCode){
		    	//decide if this is player 1 or player 2
	            let playerIndex = this.playerKeyCodes.includes(eventKeyCode) ? this.playerIndex : this.enemyIndex
                let playerState = this.playerKeyCodes.includes(eventKeyCode) ? this.playerState : this.enemyState

                console.log( playerIndex, playerState,)
		    	//if there is a piece you are moving off of is not blank, then this will make sure it stays
	            if(this.previousPieceState !== 0) {
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
		    		this.decideStatus(this.playerStatus, this.boardState[nonPlayerIndex]);
                    this.previousPieceState = this.boardState[nonPlayerIndex]
                }

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
            decideStatus(playerStatus, pieceState){
		    	console.log(playerStatus)
                switch (pieceState) {
                	case 2: return this.playerStatus = this.playerStatusFireLookUpTable[playerStatus]
                    case 3: return this.playerStatus = this.playerStatusWaterLookUpTable[playerStatus]
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
            async findAttackTiles(numToSubtract, numToAdd, currentPlayerIndex, enemy){
		    	let subtractTileIndex = currentPlayerIndex
                let addTileIndex = currentPlayerIndex - 1;
		    	let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
		    	let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'

		    	for(let i = 0; i < numToSubtract; i++) {
		    		subtractTileIndex--;
		    		if(subtractTileIndex !== currentPlayerIndex) {
		    			if(this.boardState[subtractTileIndex === 100]){
		    				console.log('it worked!')
						    this[tempTiles].push(0)
                        } else {
						    this[tempTiles].push(this.boardState[subtractTileIndex])
                        }
		    		    this[attackTiles].push(subtractTileIndex)
                    }
                }
		    	for(let i = 0; i < numToAdd; i++){
		    		addTileIndex++;
		    		if(addTileIndex !== currentPlayerIndex){
					    if(this.boardState[subtractTileIndex] === 100){
						    this[tempTiles].push(0)
					    } else {
						    this[tempTiles].push(this.boardState[subtractTileIndex])
					    }
					    this[attackTiles].push(addTileIndex)
                    }
                }
            },
            async findAttackTilesVertical(numDownward, numUpward, enemy){
	            let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
	            let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'

		    	if(numDownward > 0) {
		    		this[attackTiles].push(numDownward);

				    if(this.boardState[numDownward] === 100){
					    this[tempTiles].push(0)
				    } else {
					    this[tempTiles].push(this.boardState[numDownward])
				    }
			    }
		    	if(numUpward < 100) {
		    		this[attackTiles].push(numUpward)

				    if(this.boardState[numUpward] === 100){
					    this[tempTiles].push(0)
				    } else {
					    this[tempTiles].push(this.boardState[numUpward])
				    }
			    }

                while(numDownward - 10 > 0){
                	numDownward = numDownward - 10;
                	this[attackTiles].push(numDownward);

	                if(this.boardState[numDownward] === 100){
		                this[tempTiles].push(0)
	                } else {
		                this[tempTiles].push(this.boardState[numDownward])
	                }
                }
                while(numUpward + 10 < 100){
                	numUpward = numUpward + 10;
                	this[attackTiles].push(numUpward);

	                if(this.boardState[numUpward] === 100){
		                this[tempTiles].push(0)
	                } else {
		                this[tempTiles].push(this.boardState[numUpward])
	                }
                }
            },
            async assignAttackTiles(direction,enemy){
	            let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'

		        for(let attackTile of this[attackTiles]){
		        	console.log(attackTile,this.boardState[attackTile])
                    Vue.set(this.boardState, attackTile, direction === 'horizontal' ? 10 : 11)
                }
            },
            async resetAttackTiles(enemy){
	            let tempTiles = enemy ? 'enemyAttackTempTilesState' : 'playerAttackTempTilesState'
	            let attackTiles = enemy ? 'enemyAttackTiles' : 'playerAttackTiles'

	            this[attackTiles].forEach((value, index) => {
	            	console.log(value, index, this[tempTiles][index])
                    Vue.set(this.boardState, value, this[tempTiles][index])
	            })
            }
        },
        created(){
			console.log(this['playerIndex']);
			//TODO, handle diagonal movement
			this.boardState[this.playerIndex] = this.playerState
			this.boardState[this.enemyIndex] = this.enemyState

            window.addEventListener('keydown', (e) => {
            	if(e.key === 'f' || e.key === 'v') return this.playerStatus = 'charging'
                if(e.key === '0') return this.enemyStatus = 'charging'
            	return this.handleKeyDownEvent(e);
            })
            window.addEventListener('keyup', (e) => {
            	if(this.playerStatus === 'charging') {
            		return this.handleAttack(e, false);
                } else if (this.enemyStatus === 'charging'){
            		return this.handleAttack(e, true)
                }
            })
        }
	}
</script>

<style scoped>
</style>