<template>
    <div class="board-piece" :style="boardPieceStyle">
        <div class="board-piece-inside" :style="boardPieceInsideStyle">
<!--            <p v-if="playerIndex !== undefined" :style="playerStyle"> {{playerStatusText[playerStatus]}} </p>-->
<!--            <p v-if="enemyIndex !== undefined" :style="playerStyle"> {{playerStatusText[enemyStatus]}} </p>-->
        </div>
<!--        <div class="board-piece-eyes" :style="boardPieceEyesStyle">-->
<!--        </div>-->
    </div>
</template>

<script>


	export default {
		name: "BoardPiece",
        props:['state','pieceIndex','pieceWidth','pieceHeight', 'playerIndex', 'playerStatus',
            'enemyIndex', 'enemyStatus', 'playerUserName', 'enemyUserName', 'buttonPressed'],
		data(){
			return{
                boardPieceColors:{
					0: 'rgba(0,0,0,0)',
                    1: 'rgba(0,0,0,0)',
                    2: 'orange',
                    3: 'lightblue',
                    10: 'red',
                    11: 'red',
                    25: 'rgb(24,24,24)',
                    100: 'rgba(0,0,0,0)',
                },
                boardPieceWidthLookUpTable:{
                    0: this.pieceWidth * 0.95,
                    1: this.pieceWidth * 0.95,
                    2: this.pieceWidth * 0.95,
                    3: this.pieceWidth * 0.95,
                    10: this.pieceWidth * 0.99,
                    11: this.pieceWidth * 0.65,
                    25: this.pieceWidth * 0.95,
                    100: this.pieceWidth * 0.95,
                },
				boardPieceHeightLookUpTable:{
					0: this.pieceHeight * 0.95,
					1: this.pieceHeight * 0.95,
					2: this.pieceHeight * 0.95,
					3: this.pieceHeight * 0.95,
					10: this.pieceHeight * 0.65,
                    11: this.pieceHeight * 0.99,
                    100: this.pieceWidth * 0.95,
					25: this.pieceWidth * 0.95,
				},
                boardPieceBorderRadiusLookUpTable:{
                    0: 5,
                    1: 2.5,
                    2: 2.5,
                    3: 2.5,
                    10: 0,
                    11: 0,
                    25: 0,
                    100: 50
                },
				boardPieceBorderRadiusLookUpTableOuter:{
					0: 10,
					1: 10,
					2: 10,
					3: 10,
					10: 0,
					11: 0,
					25: 0,
					100: 10,
				},
                playerSprite:{
                    'D4Y': `url(${require('../assets/D4Y-idle-sprite.png')})`,
                    'KABBAGE': `url(${require('../assets/KABBAGE-idle-sprite.png')})`
                },
                backgroundSprite:{
                    0: `url(${require('../assets/background-tile.png')})`
                },
                playerEyesSprite:{
                    'D4Y': `url(${require('../assets/D4Y-eyes-sprite.png')})`
                },
                playerSpriteTransform:{
                    'right': 'translateX(-5px) rotateZ(270deg)',
                    'down': 'translateY(-2px) rotateZ(0deg)',
                    'left': 'translateX(3px) rotateZ(90deg)',
                    'up': 'translateY(5px) rotateZ(180deg)'
                },
                playerStatusText:{
                    'normal': 'N',
                    'charging': 'C',
                    'attacking': 'A',
                    'fire': 'F',
                    'dry': 'D',
                    'wet': 'W',
                },
                playerTextHeight: 50,
                playerTextWidth: 100,
                borderLookUpTable:{
                    'firing': '3px inset red',
                    'fire': '1px inset orange'
                },
			}
		},
		computed:{
			boardPieceStyle(){
				return {
					height: this.pieceHeight + 'px',
					width: this.pieceWidth + 'px',
					border: this.state === 0 ? '1px solid #44036b' : '',
                    backgroundColor: '#501177',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
					borderRadius: this.boardPieceBorderRadiusLookUpTableOuter[this.state] + '%',
				}
			},
            boardPieceInsideStyle(){
	            return {
		            height: this.boardPieceHeightLookUpTable[this.state] + 'px',
		            width: this.boardPieceWidthLookUpTable[this.state] + 'px',
		            backgroundColor: this.boardPieceColors[this.state],
		            display: 'flex',
		            justifyContent: 'center',
		            alignItems: 'center',
		            borderRadius: this.boardPieceBorderRadiusLookUpTable[this.state] + '%',
                    boxShadow: this.boxShadow,
                    backgroundImage: this.backgroundImage,
                    transform: this.transform,
                    transformOrigin: 'center',
	            }
            },
            boardPieceEyesStyle(){
                return {
                    height: this.boardPieceHeightLookUpTable[this.state] + 'px',
                    width: this.boardPieceWidthLookUpTable[this.state] + 'px',
                    position: 'absolute',
                    backgroundImage: this.playerEyesSprite[this.username],
                }
            },
            playerStyle(){
				return {
					color: 'white',
                    width: this.playerTextWidth + '%',
                    height: this.playerTextHeight + '%',
                }
            },
            username(){
			    if(this.playerUserName !== undefined) {
			        return this.playerUserName
                } else if (this.enemyUserName !== undefined) {
			        return this.enemyUserName
                }
            },
            boxShadow(){
			    if(this.state === 1 || this.state === 100) {
			        return ''
                } else {
			        return '0 0 1px 1px rgba(97, 3, 104, 0.75)'
                }
            },
            transform(){
			    if(this.state === 1 || this.playerUserName !== undefined) {
			        return this.playerSpriteTransform[this.buttonPressed]
                } else if ( this.state === 100 || this.enemyUserName !== undefined) {
                    return this.playerSpriteTransform[this.buttonPressed]
                } else {
			        return ''
                }
            },
            backgroundImage(){
			    if(this.state === 1 || this.state === 100) {
			    	return this.playerSprite[this.username]
                } else {
			    	return this.backgroundSprite[this.state]
                }
            },
		},
		// created(){
		// 	console.log(this.state, this.pieceIndex, this.pieceWidth, this.pieceHeight)
		// }
	}
</script>

<style scoped>
</style>