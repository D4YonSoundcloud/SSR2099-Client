<template>
    <div class="main-ui-container" :style="mainContainerStyle">
        <h1 v-if="multiplayer === true" :style="titleStyle">{{ playerUsername }}</h1>
        <h1 v-else :style="titleStyle">{{ enemy ? 'Player 2' : 'Player 1'}}</h1>
        <div :style="lifeContainerStyle">
            <svg v-if="livesAmount >= 1" style="width:24px;height:24px" viewBox="0 0 24 24">
                <path :fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
            </svg>
            <svg v-if="livesAmount >= 2"  style="width:24px;height:24px" viewBox="0 0 24 24">
                <path :fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
            </svg>
            <svg v-if="livesAmount === 3"  style="width:24px;height:24px" viewBox="0 0 24 24">
                <path :fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
            </svg>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PlayerUI",
        props: ['enemy', 'playerUsername', 'multiplayer', 'enemyLives', 'playerLives'],
        computed:{
            mainContainerStyle(){
                return {
                    width: 150 + 'px',
                    height: 600 + 'px',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: this.enemy ? 0 : 32 + 'px',
                    marginLeft: this.enemy ? 32 + 'px' : 0
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
                    flexFlow: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            },
            currentColor(){
                return 'red'
            },
            livesAmount(){
            	if(this.multiplayer === true){
            		return this.enemy ? this.enemyLives : this.playerLives
                } else {
                    return this.enemy ? this.$store.state.enemyLivesStore : this.$store.state.playerLivesStore
                }
            }
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

</style>