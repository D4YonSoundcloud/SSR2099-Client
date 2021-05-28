<template>
  <div id="app">
      <div id="nav">
          <router-link to="/" style="margin-left: 8px">home</router-link>
          <router-link to="/local" style="margin-left: 8px">local</router-link>
          <router-link to="/multiplayer" style="margin-left: 8px">online</router-link>
      </div>
      <router-view/>
      <div class="bottom-info" :style="bottomInfoContainer">
          <p :style="pStyle">PRESS 'P' TO PAUSE/PLAY MUSIC</p>
      </div>
  </div>
</template>
<script>
  export default {
    name: "App",
    data(){
        return{
            introSong: new Audio(require('./assets/Soundclout-INTRO-SONG.mp3')),
            introSongPlaying: false,
            introSongLooping: false,
        }
    },
    computed:{
    	bottomInfoContainer(){
    		return{
    			position: 'absolute',
                top: 0,
                right: 0,
                color: '#4f2f5a',
                padding: '8px',
			    fontFamily: "'Viga', sans-serif",
            }
        },
        pStyle(){
    		return{
    			textShadow: '0px 0px 6px black'
            }
        }
    },
    methods:{
      goToMultiplayer(){
        console.log('going to multiplayer')
        this.$router.push('/multiplayer')
      },
    },
    mounted(){
	    document.addEventListener('contextmenu', event => event.preventDefault());
        document.addEventListener('keydown', (e) => {

        	this.introSong.volume = 0.25;

            if(e.key === 'p' || e.key === 'P'){
                if(this.introSongPlaying === true) {
                    this.introSong.pause()
                    this.introSongPlaying = false;
                } else {
                    this.introSong.play()
                    this.introSongPlaying = true;
                    if(this.introSongLooping === false) {
                        this.introSong.loop = true;
                        this.introSongLooping = true;
                    }
                }
            }
        })
    }
  }
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  position: absolute;
  bottom: 0;
  padding: 15px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
