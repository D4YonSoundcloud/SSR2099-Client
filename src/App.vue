<template>
  <div id="app">
      <div id="nav">
          <router-link class="nav-link" to="/" :style="linkStyle">HOME</router-link>
          <router-link class="nav-link" to="/time-trials" :style="linkStyle">TIME-TRIALS</router-link>
          <router-link class="nav-link" to="/multiplayer" :style="linkStyle">ONLINE PVP</router-link>
          <router-link v-if="Object.keys(this.signedInUser).length !== 0" class="nav-link" to="/userProfile" :style="linkStyle">PROFILE</router-link>
      </div>
      <router-view/>
      <div class="bottom-info" v-if="hideMenu === false" :style="bottomInfoContainer">
          <p :style="pStyle">PRESS <strong :style="strongStyle">'P'</strong> TO PAUSE/PLAY MUSIC</p>
          <p :style="pStyle">PRESS <strong :style="strongStyle">'R'</strong> TO RESTART TIME TRIAL</p>
          <p :style="pStyle">PRESS <strong :style="strongStyle">'H'</strong> TO TOGGLE INSTRUCTIONS</p>
          <p :style="pStyle"><strong :style="strongStyle">WASD</strong> + <strong :style="strongStyle">ARROW-KEYS</strong>
              CAN BOTH BE</p>
          <p :style="pStyle">USED SIMULTANEOUSLY</p>
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
            hideMenu: false,
        }
    },
    computed:{
    	bottomInfoContainer(){
    		return{
    			position: 'absolute',
                top: 0,
                left: 0,
                color: '#4f2f5a',
                padding: '8px',
			    fontFamily: "'Viga', sans-serif",
                width: 300 + 'px'
            }
        },
        pStyle(){
    		return{
    			textShadow: '0px 0px 6px black',
                width: 100 + '%',
                textAlign: 'left',
                marginTop: 2 + 'px',
                marginBottom: 2 + 'px',
            }
        },
        strongStyle(){
    	    return{
    	        color: '#6b3075',
            }
        },
        linkStyle(){
            return{
                textAlign: 'left',
                marginLeft: 8 + 'px',
                color: '#6b3075',
                textDecoration: 'none',
                fontFamily: "'Viga', sans-serif",
                transition: 0.2 + 's ease',
            }
        },
        signedInUser(){
    	    return this.$store.state.signedInUser
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

            console.log(e.key)

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

            if(e.key === 'h' || e.key === 'H'){
                if(this.hideMenu === true){
                    this.hideMenu = false;
                } else if(this.hideMenu === false){
                    this.hideMenu = true;
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
  padding: 4px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

.router-link-exact-active{
    text-decoration: underline !important;
}



.nav-link:hover{
    color: #e28b3d !important;
}
</style>
