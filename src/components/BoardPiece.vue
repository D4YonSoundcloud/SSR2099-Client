<template>
    <div class="board-piece" :style="boardPieceStyle">
        <div :id="pieceId" class="board-piece-inside" :style="boardPieceInsideStyle">
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
               'playerOneLives', 'playerTwoLives', 'playerOneStatus', 'playerTwoStatus',
               'enemyIndex', 'enemyStatus', 'playerUserName', 'enemyUserName', 'playerOneButtonPressed', 'playerTwoButtonPressed'],
		data(){
			return{
                boardPieceColors:{
					0: 'rgba(0,0,0,0)',
                    1: 'rgba(0,0,0,0)',
                    2: 'orange',
                    3: 'lightblue',
                    10: 'rgba(0,0,0,0)',
                    11: 'rgba(0,0,0,0)',
                    25: 'rgb(24,24,24)',
                    100: 'rgba(0,0,0,0)',
                },
                boardPieceWidthLookUpTable:{
                    0: this.pieceWidth * 0.95,
                    1: this.pieceWidth * 0.95,
                    2: this.pieceWidth * 0.95,
                    3: this.pieceWidth * 0.95,
                    10: this.pieceWidth * 1,
                    11: this.pieceWidth * 1,
                    25: this.pieceWidth * 0.95,
                    100: this.pieceWidth * 0.95,
                },
				boardPieceHeightLookUpTable:{
					0: this.pieceHeight * 0.95,
					1: this.pieceHeight * 0.95,
					2: this.pieceHeight * 0.95,
					3: this.pieceHeight * 0.95,
					10: this.pieceHeight * 1,
                    11: this.pieceHeight * 1,
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
                    'KABBAGE': `url(${require('../assets/KABBAGE-idle-sprite.png')})`,
                    'GOOB': `url(${require('../assets/GOOB-idle-sprite.png')})`,
                    'TATHARDES': `url(${require('../assets/GOOB-idle-sprite.png')})`,
                    'YUNG LAZLO': `url(${require('../assets/GOOB-idle-sprite.png')})`,
                    'NESS': `url(${require('../assets/GOOB-idle-sprite.png')})`,
                },
                backgroundSprite:{
                    0: `url(${require('../assets/background-tile.png')})`,
                    10: `url(${require('../assets/LASER-Tile-1-lighting.png')})`,
                    11: `url(${require('../assets/LASER-Vertical.png')})`,
                    12: `url(${require('../assets/LASER-melee-tile.png')}`
                },
                backgroundSpriteTransform:{
                    0: '',
                    10: Math.random() < 0.5 ? 'rotateY(180deg)' : '',
                    11: Math.random() < 0.5 ? 'rotateX(180deg)' : '',
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
			    if(this.state === 1 || this.state === 100 || this.state === 11 || this.state === 10) {
			        return ''
                } else {
			        return '0 0 1px 1px rgba(97, 3, 104, 0.75)'
                }
            },
            transform(){
			    if(this.state === 1 || this.playerOneButtonPressed !== undefined) {
			        return this.playerSpriteTransform[this.playerOneButtonPressed]
                } else if ( this.state === 100 || this.playerTwoButtonPressed !== undefined) {
                    return this.playerSpriteTransform[this.playerTwoButtonPressed]
                } else {
			        return this.backgroundSpriteTransform[this.state];
                }
            },
            backgroundImage(){
			    if(this.state === 1 || this.state === 100) {
			    	return this.playerSprite[this.username]
                } else {
			    	return this.backgroundSprite[this.state]
                }
            },
            filter(){
			    if(this.state === 10 || this.state === 11){
			    	return 'drop-shadow(0px 0px 2px #f53333)';
                } else {
			        return 'none';
                }
            },
			pieceId(){
				return this.makeId(5)
			}
		},
        watch:{
			playerOneLives(){
				if(this.playerIndex !== undefined){
					document.getElementById(this.pieceId).classList.add('player-hit')

					setTimeout(() => {
						if(document.getElementById(this.pieceId).classList.contains('player-hit')){
							document.getElementById(this.pieceId).classList.remove('player-hit')
							console.log('removing player hit')
						}
					}, 250)
                }
            },
            playerTwoLives(){
				if(this.enemyIndex !== undefined){
					document.getElementById(this.pieceId).classList.add('player-hit')

					setTimeout(() => {
						if(document.getElementById(this.pieceId).classList.contains('player-hit')){
							document.getElementById(this.pieceId).classList.remove('player-hit')
							console.log('removing player hit')
						}
					}, 250)
                }
            }
        },
		methods:{
			makeId(length){
				let result = [];
				let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				let charactersLength = characters.length;
				for ( let i = 0; i < length; i++ ) {
					result.push(characters.charAt(Math.floor(Math.random() *
						charactersLength)));
				}
				return result.join('');
			},
		},
		// created(){
		// 	console.log(this.state, this.pieceIndex, this.pieceWidth, this.pieceHeight)
		// }
	}
</script>

<style scoped>
    .player-hit {
        animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, -10px, 0);
        backface-visibility: hidden;
        perspective: 700px;
    }

    @keyframes shake {
        10%, 90% {
            transform: translate3d(-1px, -10px, 0);
        }

        20%, 80% {
            transform: translate3d(2px, -10px, 0);
        }

        30%, 50%, 70% {
            transform: translate3d(-4px, -10px, 0);
        }

        40%, 60% {
            transform: translate3d(4px, -10px, 0);
        }
    }
</style>