<template>
    <div :id="playerUiId" :class="enemy ? 'main-ui-container-right' : 'main-ui-container-left'" :style="mainContainerStyle">
        <h1 v-if="multiplayer === true" :style="titleStyle">{{ playerUsername }}</h1>
        <h1 v-else :style="titleStyle">{{ enemy ? 'PLAYER 2' : 'PLAYER 1'}}</h1>
        <div :style="lifeContainerStyle">
            <div class="health-bar-container" :style="healthBarContainerStyle">
                <h2>{{livesAmount > 0 ? livesAmount.toFixed(0) + ' ' : 0 + ' ' }} HP </h2>
                <div class="health-bar" :style="healthBarStyle"></div>
            </div>
            <h3>{{ enemy ? enemyStatus : playerStatus }}</h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PlayerUI",
        props: ['enemy', 'playerUsername', 'multiplayer', 'enemyLives', 'playerLives', 'playerStatus', 'enemyStatus'],
        computed:{
            mainContainerStyle() {
	            return {
		            width: 300 + 'px',
		            height: 525 + 'px',
		            display: 'flex',
		            flexFlow: 'column',
		            justifyContent: 'center',
		            alignItems: 'center',
		            marginRight: this.enemy ? 0 : 32 + 'px',
		            marginLeft: this.enemy ? 32 + 'px' : 0,
		            color: 'white',
		            transform: 'translateY(-10px)',
                    borderRadius: '1.25%',
                    boxShadow: '0 0 20px 0 #bf05bf',
	            }
            },
            titleStyle(){
                return {
                    width: 100 + '%',
                    height: 5 + '%',
                    fontFamily: "'Viga', sans-serif",
                }
            },
            lifeContainerStyle(){
                return {
                    width: 100 + '%',
                    height: 25 + '%',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            },
            healthBarContainerStyle(){
	            return {
		            width: 85 + '%',
		            height: 50 + '%',
		            display: 'flex',
		            flexFlow: 'row',
		            justifyContent: 'center',
		            alignItems: 'center'
	            }
            },
            healthBarStyle(){
                return {
                	marginLeft: 16 + 'px',
                	height: 25 + 'px',
                    backgroundColor: this.healthBarColor,
                    width: this.livesAmount >= 0 ? ((this.livesAmount/50)*100) + '%' : 0 + '%',
	                borderBottom: '2px solid #000000',
	                borderRadius: '5px 2px 5px 2px',
                    boxShadow: '0 0 30px 1px #3c033c',
                    transition: 0.2 + 's ease',
                }
            },
            currentColor(){
                return 'white'
            },
            livesAmount(){
            	if(this.multiplayer === true){
            		return this.enemy ? this.enemyLives : this.playerLives
                } else {
                    return this.enemy ? this.$store.state.enemyLivesStore : this.$store.state.playerLivesStore
                }
            },
            healthBarColor(){
                if(this.livesAmount <= 50 && this.livesAmount >= 35) {
                	return '#129e12'
                } else if (this.livesAmount <= 34.99 && this.livesAmount >= 20) {
                	return 'yellow'
                } else {
                	return 'red'
                }
            },
            playerUiId(){
                return this.makeId(5)
            }
        },
        watch:{
          livesAmount(){
              document.getElementById(this.playerUiId).classList.add('player-hit')

              setTimeout(() => {
                  if(document.getElementById(this.playerUiId).classList.contains('player-hit')){
                    document.getElementById(this.playerUiId).classList.remove('player-hit')
                      console.log('removing player hit')
                  }
              }, 250)

              return console.log(this.livesAmount)
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
        created(){
            console.log(this.livesAmount)
        }
    }
</script>

<style scoped>
    .main-ui-container-left {
        background: linear-gradient(320deg, #8a18d0, #bd3ce7, #550a6d, #9248a5);
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
    }
    .main-ui-container-right{
        background: linear-gradient(135deg, #8a18d0, #bd3ce7, #550a6d, #9248a5);
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