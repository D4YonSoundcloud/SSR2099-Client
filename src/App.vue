<template>
  <div id="app">
      <div id="nav">
          <router-link to="/" style="margin-left: 8px">home</router-link>
          <router-link to="/local" style="margin-left: 8px">local</router-link>
          <router-link to="/multiplayer" style="margin-left: 8px">online</router-link>
      </div>
      <router-view/>
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
    methods:{
      goToMultiplayer(){
        console.log('going to multiplayer')
        this.$router.push('/multiplayer')
      }
    },
    mounted(){
        document.addEventListener('keydown', (e) => {
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
