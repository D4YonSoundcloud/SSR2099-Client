<template>
    <div class="board-piece" :style="boardPieceStyle">
        <div class="board-piece-inside" :style="boardPieceInsideStyle">
            <p v-if="playerIndex !== undefined" :style="playerStyle"> {{playerStatusText[playerStatus]}} </p>
            <p v-if="enemyIndex !== undefined" :style="playerStyle"> {{playerStatusText[enemyStatus]}} </p>
        </div>
    </div>
</template>

<script>
	export default {
		name: "BoardPiece",
        props:['state','pieceIndex','pieceWidth','pieceHeight', 'playerIndex', 'playerStatus', 'enemyIndex', 'enemyStatus'],
		data(){
			return{
                boardPieceColors:{
					0: 'white',
                    1: 'black',
                    2: 'orange',
                    3: 'lightblue',
                    10: 'red',
                    11: 'red',
                    100: 'green',
                },
                boardPieceWidthLookUpTable:{
                    0: this.pieceWidth * 0.95,
                    1: this.pieceWidth * 0.75,
                    2: this.pieceWidth * 0.95,
                    3: this.pieceWidth * 0.95,
                    10: this.pieceWidth * 0.99,
                    11: this.pieceWidth * 0.65,
                    100: this.pieceWidth * 0.75,
                },
				boardPieceHeightLookUpTable:{
					0: this.pieceHeight * 0.95,
					1: this.pieceHeight * 0.75,
					2: this.pieceHeight * 0.95,
					3: this.pieceHeight * 0.95,
					10: this.pieceHeight * 0.65,
                    11: this.pieceHeight * 0.99,
                    100: this.pieceWidth * 0.75
				},
                boardPieceBorderRadiusLookUpTable:{
                    0: 0,
                    1: 50,
                    2: 2.5,
                    3: 2.5,
                    10: 0,
                    11: 0,
                    100: 50
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
					border: '1px dotted #00A45D',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
		            borderRadius: this.boardPieceBorderRadiusLookUpTable[this.state] + '%'
	            }
            },
            playerStyle(){
				return {
					color: 'white',
                    width: this.playerTextWidth + '%',
                    height: this.playerTextHeight + '%',
                }
            }
		},
        watch:{
		    state(){
		    	console.log(this.state, this.pieceIndex)
            }
        },
		created(){
			console.log(this.state, this.pieceIndex, this.pieceWidth, this.pieceHeight)
		}
	}
</script>

<style scoped>

</style>