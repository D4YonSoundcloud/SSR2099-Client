<template>
    <div class="board-container" :style="boardContainerStyle">
        <div class="board" :style="boardStyle">
            <BoardPiece :pieceIndex="index"  v-for="(piece, index) in boardState" :key="index"
                        :state="piece" :playerIndex="index === playerIndex ? playerIndex : undefined"
                        :pieceWidth="boardPieceHeightAndWidth" :playerStatus="playerStatus"
                        :pieceHeight="boardPieceHeightAndWidth"></BoardPiece>
        </div>
    </div>
</template>

<script>
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
                playerIndex: 2,
                playerState: 1,
                playerStatus: 'normal',
				boardWidth: 500,
                boardHeight: 250,
                keyCodes:{
					37: 'left',
                    38: 'up',
                    39: 'right',
                    40: 'down'
                },
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
		    	if(this.keyCodes[e.keyCode] === 'right') {
		    		console.log('right')
		    		return this.handleRightKey(this.playerIndex)
                } else if(this.keyCodes[e.keyCode] === 'left') {
				    console.log('left')
				    return this.handleLeftKey(this.playerIndex)
			    } else if(this.keyCodes[e.keyCode] === 'up') {
				    console.log('up')
				    return this.handleUpKey(this.playerIndex)
			    } else if(this.keyCodes[e.keyCode] === 'down') {
				    console.log('down')
				    return this.handleDownKey(this.playerIndex)
			    }
		    },
            handleRightKey(currentIndex){
                if ((currentIndex + 1)%this.columnCount === 0) {
	                this.swap(currentIndex - (this.columnCount - 1), this.playerIndex - (this.columnCount - 1),'rightWall')
                } else {
	                this.swap(currentIndex + 1, this.playerIndex + 1,'right')
                }
            },
            handleLeftKey(currentIndex){
	            if ((currentIndex + 1)%this.columnCount === 1) {
		            this.swap(currentIndex + (this.columnCount - 1), this.playerIndex + (this.columnCount - 1),'leftWall')
	            } else {
		            this.swap(currentIndex - 1, this.playerIndex - 1, 'left')
	            }
            },
            handleUpKey(currentIndex){
		    	let firstRowEnd = this.columnCount - 1;
		    	let lastRowStart = this.boardState.length - this.columnCount;
		    	if(currentIndex <= firstRowEnd){
		    		let oldPlayerIndex = currentIndex;
		    		let temp = this.boardState[lastRowStart + currentIndex]
                    this.playerIndex = lastRowStart + currentIndex;
		    		console.log(this.playerIndex)
		    		this.boardState[this.playerIndex] = this.playerState
		    		this.boardState[oldPlayerIndex] = temp;
                } else {
				    this.swap(currentIndex - this.columnCount, this.playerIndex - this.columnCount, 'up')
                }
            },
	        handleDownKey(currentIndex){
		        let lastRowStart = this.boardState.length - this.columnCount;
		        if(currentIndex >= lastRowStart && currentIndex <= this.boardState.length - 1){
		        	let difference = currentIndex - lastRowStart
			        let oldPlayerIndex = currentIndex;
			        let temp = this.boardState[difference]
			        this.playerIndex = difference;
			        this.boardState[this.playerIndex] = this.playerState
			        this.boardState[oldPlayerIndex] = temp;
		        } else {
			        this.swap(currentIndex + this.columnCount, this.playerIndex + this.columnCount, 'down')
		        }
	        },
            swap(nonPlayerIndex, newPlayerIndex, keyCode){
	            if(this.previousPieceState !== 0) {
		            this.playerIndex = newPlayerIndex;
		            this.boardState[this.playerIndex] = this.playerState;
		            console.log('previous piece state')
		            this.boardState[this.playerIndex + this.swapLookUpTable[keyCode]] = this.previousPieceState;
		            return this.previousPieceState = 0;
	            }

		    	let temp = 0;
		    	if(this.boardState[nonPlayerIndex] !== 0) {
		    		this.decideStatus(this.playerStatus, this.boardState[nonPlayerIndex]);
		    		console.log(this.decideStatus(this.playerStatus, this.boardState[nonPlayerIndex]))
		    		console.log('previous piece set')
                    this.previousPieceState = this.boardState[nonPlayerIndex]
                }

		    	this.playerIndex = newPlayerIndex;
	            this.boardState[this.playerIndex] = this.playerState;
	            console.log('this is happening at the same time')
	            this.boardState[this.playerIndex + this.swapLookUpTable[keyCode]] = temp;
            },
            decideStatus(playerStatus, pieceState){
		    	console.log(playerStatus)
                switch (pieceState) {
                	case 2: return this.playerStatus = this.playerStatusFireLookUpTable[playerStatus]
                    case 3: return this.playerStatus = this.playerStatusWaterLookUpTable[playerStatus]
                }
            }
        },
        created(){
			//TODO, handle diagonal movement
			this.boardState[this.playerIndex] = this.playerState
            window.addEventListener('keydown', (e) => {
            	return this.handleKeyDownEvent(e);
            })
        }
	}
</script>

<style scoped>
</style>