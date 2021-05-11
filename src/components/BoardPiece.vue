<template>
    <div class="board-piece" :style="boardPieceStyle">
        <p v-if="playerIndex !== undefined" :style="playerStyle"> P </p>
    </div>
</template>

<script>
	export default {
		name: "BoardPiece",
        props:['state','pieceIndex','pieceWidth','pieceHeight', 'playerIndex', 'playerStatus'],
		data(){
			return{
                boardPieceColors:{
					0: 'white',
                    1: 'black',
                    2: 'orange',
                    3: 'lightblue'
                },
                playerTextHeight: 50,
                playerTextWidth: 100,
                borderLookUpTable:{

                }
			}
		},
		computed:{
			boardPieceStyle(){
				return {
					height: this.pieceHeight + 'px',
					width: this.pieceWidth + 'px',
					border: this.playerStatus === 'normal' ? '1px dotted #00A45D' : this.borderLookUpTable[this.playerStatus],
                    backgroundColor: this.boardPieceColors[this.state],
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
		created(){
			console.log(this.state, this.pieceIndex, this.pieceWidth, this.pieceHeight)
		}
	}
</script>

<style scoped>

</style>