<template>
    <div class="board-piece" :style="boardPieceStyle">
        <div class="board-piece-portal" v-if="checkIfObject(state)" :style="boardPieceInsidePortalStyle">
            <div class="board-piece-object-sprite rotate" :style="boardPiecePortalSpriteStyle"></div>
        </div>

        <div :id="pieceId" :class="'board-piece-inside ' + animationLookUpTable[state]" v-else :style="boardPieceInsideStyle">
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
                    12: 'rgba(0,0,0,0)',
                    25: 'rgba(0,0,0,0)',
                    26: 'rgba(0,0,0,0)',
                    27: 'rgba(0,0,0,0)',
                    50: 'rgba(0,0,0,0)',
                    99: 'rgba(0,0,0,0)',
                    100: 'rgba(0,0,0,0)',
                },
                boardPieceWidthLookUpTable:{
                    0: this.pieceWidth * 1,
                    1: this.pieceWidth * 1,
                    2: this.pieceWidth * 0.95,
                    3: this.pieceWidth * 0.95,
                    10: this.pieceWidth * 1,
                    11: this.pieceWidth * 1,
                    12: this.pieceWidth * 1,
                    25: this.pieceWidth * 1,
                    26: this.pieceWidth * 1,
                    27: this.pieceWidth * 1,
                    99: this.pieceWidth * 1,
                    100: this.pieceWidth * 1,
                },
				boardPieceHeightLookUpTable:{
					0: this.pieceHeight * 1,
					1: this.pieceHeight * 1,
					2: this.pieceHeight * 0.95,
					3: this.pieceHeight * 0.95,
					10: this.pieceHeight * 1,
                    11: this.pieceHeight * 1,
                    12: this.pieceHeight * 1,
					25: this.pieceWidth * 1,
                    26: this.pieceWidth * 1,
                    27: this.pieceWidth * 1,
					99: this.pieceWidth * 1,
                    100: this.pieceWidth * 1,
				},
                boardPieceBorderRadiusLookUpTable:{
                    0: 5,
                    1: 0,
                    2: 2.5,
                    3: 2.5,
                    10: 0,
                    11: 0,
                    12: 0,
                    25: 0,
                    26: 0,
                    27: 0,
                    99: 0,
                    100: 0,
                },
				boardPieceBorderRadiusLookUpTableOuter:{
					0: 0,
					1: 0,
					2: 10,
					3: 10,
					10: 0,
					11: 0,
					12: 0,
					25: 0,
                    26: 0,
                    27: 0,
					99: 0,
					100: 0,
				},
                transformOriginLookUpTable:{
                    0: 'center',
                    1: 'center',
                    2: 'center',
                    3: 'center',
                    10: 'center',
                    11: 'center',
                    12: 'center',
                    25: 'bottom',
                    26: 'bottom',
                    27: 'bottom',
                    99: 'center',
                    100: 'center',
                },
                playerSprite:{
                    'D4Y': `url(${require('../assets/D4Y-idle-sprite-export.png')})`,
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
                    12: `url(${require('../assets/LASER-melee-tile.png')}`,
                    25: `url(${require('../assets/WALL-TILE.png')})`,
                    26: `url(${require('../assets/WALL-TILE-small-half.png')})`,
                    27: `url(${require('../assets/WALL-TILE-top.png')})`,
                    99: `url(${require('../assets/flag-main-sheet.png')})`
                },
				animationLookUpTable:{
					0: '',
					10: '',
					11: '',
					12: '',
					25: '',
					26: '',
					27: '',
					99: 'flag'
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
                    'right': 'rotateZ(270deg)',
                    'down': 'rotateZ(0deg)',
                    'left': 'rotateZ(90deg)',
                    'up': 'rotateZ(180deg)'
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
                hueDegrees:{
	                'purple': 260,
	                'green': 50,
	                'lightpurple': 190,
	                'blue': 130,
	                'yellow': 0,
	                'aqua': 80,
	                'orange': 300,
	                'red': 295,
                }
			}
		},
		computed:{
			boardPieceStyle(){
				return {
					height: this.pieceHeight + 'px',
					width: this.pieceWidth + 'px',
					// border: this.state === 0 ? '1px solid #44036b' : '',
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
                    // boxShadow: this.boxShadow,
                    backgroundImage: this.backgroundImage,
                    transform: this.transform,
                    transformOrigin: this.transformOriginLookUpTable[this.state],
                    backgroundSize: (this.state === 25 || this.state === 27) ? '100% 100%' : '',
                    zIndex: 100,
	            }
            },
            boardPieceInsidePortalStyle(){
                return {
                    height: 50 + 'px',
                    width: 50 + 'px',
                    backgroundColor: this.boardPieceColors[50],
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: this.boardPieceBorderRadiusLookUpTable[50] + '%',
                    backgroundImage: this.backgroundSprite[0],
                    transformOrigin: 'center',
                    zIndex: 100,
                }
            },
            boardPiecePortalSpriteStyle(){
			    return{
                    height: 50 + 'px',
                    width: 50 + 'px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: this.boardPieceBorderRadiusLookUpTable[50] + '%',
                    backgroundImage: `url(${require('../assets/portal-tile-1.png')})`,
                    filter: 'sepia() saturate(1000%) hue-rotate(' + this.hueDegrees[this.state.color] + 'deg)',
                    transformOrigin: 'center',
                    zIndex: 10,
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
			    if(this.state === 1 || this.state === 100 || this.state === 11 || this.state === 10
                    || this.state === 25 || this.state === 26 || this.state === 0  || this.state === 27) {
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
                } else if ( this.state === 25 || this.state === 27) {
                    return 'scaleY(2)'
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
            checkIfObject(state){
                console.log(state.color, this.hueDegrees[state.color])
			    return typeof state === 'object' && state !== null
            }
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

    .rotate {
        animation: rotation 5s infinite linear;
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }

    .flag{
        animation: moveSpriteSheet 0.9s steps(3) infinite;
    }

    @keyframes moveSpriteSheet {
        from {
            background-position-x: 150px
        }
        to {
            background-position-x: 0;
        }
    }
</style>