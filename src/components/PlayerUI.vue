<template>
    <div :class="enemy ? 'main-ui-container-right' : 'main-ui-container-left'" :style="mainContainerStyle">
        <h1 v-if="multiplayer === true" :style="titleStyle">{{ playerUsername }}</h1>
        <h1 v-else :style="titleStyle">{{ enemy ? 'Player 2' : 'Player 1'}}</h1>
        <div :style="lifeContainerStyle">
            <div class="health-bar-container" :style="healthBarContainerStyle">
                <h2>{{livesAmount > 0 ? livesAmount.toFixed(2) : 0 }}</h2>
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
	            }
            },
            titleStyle(){
                return {
                    width: 100 + '%',
                    height: 5 + '%',
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
        },
        watch:{
          livesAmount(){
              return console.log(this.livesAmount)
          }
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
</style>