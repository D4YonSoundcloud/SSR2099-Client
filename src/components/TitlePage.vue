<template>
    <div class="title-container" :style="mainTitleContainerStyle">
        <div :style="titleStyle">
            <div :style="titleSoundCloudStyle"></div>
            <div :style="titleStardumStyle"></div>
            <div :style="titleRoyaleStyle" class="floating-text"></div>
        </div>
        <div class="online-btn" :style="buttonStyle" id="time-trials" @click="goToTimeTrial()">
            <h1 class="blinking-h1" :style="h1Style"> TIME-TRIALS </h1>
        </div>
        <div class="online-btn" :style="buttonStyle" id="online-pvp" @click="goToMultiplayer()">
            <h1 class="blinking-h1" :style="h1Style"> ONLINE PVP </h1>
        </div>
        <div class="online-btn" :style="buttonStyle" id="profile" @click="goToUserProfile()" v-if="userLoggedIn === true">
            <h1 class="blinking-h1" :style="h1Style"> PROFILE </h1>
        </div>
        <div class="online-btn" :style="buttonStyle" id="log-in" @click="goToLoginWithGoogle()">
            <h1 class="blinking-h1" :style="h1Style" v-if="userLoading === false">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="white" d="M12,20L15.46,14H15.45C15.79,13.4 16,12.73 16,12C16,10.8 15.46,9.73 14.62,9H19.41C19.79,9.93 20,10.94 20,12A8,8 0 0,1 12,20M4,12C4,10.54 4.39,9.18 5.07,8L8.54,14H8.55C9.24,15.19 10.5,16 12,16C12.45,16 12.88,15.91 13.29,15.77L10.89,19.91C7,19.37 4,16.04 4,12M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,4C14.96,4 17.54,5.61 18.92,8H12C10.06,8 8.45,9.38 8.08,11.21L5.7,7.08C7.16,5.21 9.44,4 12,4M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                {{ userLoggedIn ? 'LOG-OUT' : 'LOG-IN' }}
            </h1>

            <!--loading animation, taken from loading.io/css/-->
            <div v-else class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
        </div>
    </div>
</template>

<script>
	const axios = require('axios');

	export default {
		name: "TitlePage",
        data(){
			return{
				localhostURL: 'http://localhost:4000',
                developmentURL: 'https://stark-thicket-52069.herokuapp.com',
                userLoggedIn: false,
                userLoading: false,
                pages:['time-trials','online-pvp','log-in'],
                selectedPage: '',
                selectedPageIndex: 0,
                menuFocusSound: new Audio(require('../assets/menu-in.wav')),
				introSongPlaying: false,
				introSongLooping: false,
                lastDirectionPressed: '',
            }
        },
        computed:{
			titleStyle(){
			    return {
			    	width: 500 + 'px',
                    height: 400 + 'px',
                }
            },
			mainTitleContainerStyle(){
				return {
					width: 100 + 'vw',
					height: 100 + 'vh',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
	        buttonStyle(){
		        return {
			        width: 300 + 'px',
			        height: 50 + 'px',
			        display: 'flex',
			        flexFlow: 'row',
			        justifyContent: 'center',
			        alignItems: 'center',
			        cursor: 'pointer',
			        color: 'white',
			        marginTop: 2.5 + '%',
			        borderRadius: '1.25%',
			        boxShadow: '0 0 10px 0 #bf05bf',
		        }
	        },
	        h1Style(){
		        return {
			        width: 100 + '%',
			        height: 100 + '%',
			        fontFamily: "'Orbitron', sans-serif",
			        cursor: 'pointer',
		        }
	        },
	        titleSoundCloudStyle(){
			    return {
			    	width: 500 + 'px',
			    	height: 200 + 'px',
			    	backgroundColor: 'rgba(0,0,0,0)',
                    backgroundImage: `url(${require('../assets/INTRO-sprite-soundcloud.png')})`,
                    zIndex: 10,
				    filter: 'drop-shadow(rgb(130, 4, 136) 0px 0px 10px)',
                    position: 'relative',
                }
            },
            titleStardumStyle(){
	            return {
		            width: 500 + 'px',
		            height: 200 + 'px',
		            backgroundColor: 'rgba(0,0,0,0)',
		            backgroundImage: `url(${require('../assets/INTRO-sprite-stardum.png')})`,
                    zIndex: 1,
                    transform: 'translateY(-110px) scale(0.85)',
		            filter: 'drop-shadow(rgb(120, 4, 136) 0px 0px 10px)'
	            }
            },
	        titleRoyaleStyle(){
		        return {
			        width: 500 + 'px',
			        height: 200 + 'px',
			        backgroundColor: 'rgba(0,0,0,0)',
			        backgroundImage: `url(${require('../assets/INTRO-sprite-royale.png')})`,
			        zIndex: 1,
			        transform: 'translateX(120px) translateY(-210px) scale(0.55)',
			        filter: 'drop-shadow(rgb(306, 209, 65) 0px 0px 50px)',
		        }
	        },
            signedInUser(){
				return this.$store.state.signedInUser
            }
        },
        methods:{
			goToLocal(){
                this.$router.push('/local')
            },
            goToMultiplayer(){
                this.$router.push('/multiplayer')
            },
            goToTimeTrial(){
			    this.$router.push('/time-trials')
            },
	        goToUserProfile(){
			    this.$router.push('/userProfile')
            },
            goToLoginWithGoogle(){
				console.log('signing in with google AUTH')

                if(this.userLoggedIn === true){
                	return this.$gAuth.signOut().then(() => {
		                this.$store.dispatch('getSignOutUser')
                		this.userLoggedIn = false;
                    })
                }

                this.$gAuth.signIn().then(googleUser => {
                	this.userLoading = true;

	                let userInfo = {
		                loginType: 'google',
		                user: googleUser,
		                userId: googleUser.Aa,
		                userGoogleName: googleUser.Aa.Ve
	                }

	                axios.post(`${this.developmentURL}/login`, userInfo).then( response => {
		                this.$store.dispatch('getSignInUser', response.data)
		                this.userLoggedIn = true;
		                this.userLoading = false;
		                this.pages = ['time-trials','online-pvp','profile','log-in']
		                this.$router.push('/')
	                }).catch(error => {
		                console.log('error logging in', error);
	                })
                }).catch(error => {
                    console.log('error signed in', error)

                    this.$gAuth.signOut().then(() => {
                        console.log('the user has logged out')
                    }).catch(err => {
                            console.log('error signout', err)
                    })
                })
            },
            // THIS IS A MESS, I NEED TO COME BACK AND FIX THIS
	        handleKeyDownListenerTitlePage(e){
				console.log(e.key)

                if(e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                	const newAudio = this.menuFocusSound.cloneNode();
	                newAudio.volume = Math.random() * 0.3;
	                newAudio.play()

                	if (this.selectedPageIndex === this.pages.length) {
                		console.log(this.pages[this.selectedPageIndex - 1], 'this is happening')

		                document.getElementById(this.pages[this.selectedPageIndex - 1]).classList.remove('focused-button')
                		this.selectedPageIndex = 0;
		                this.goToSelectedPage(this.selectedPageIndex, 'down')
                    } else {
                		if(this.lastDirectionPressed === 'up'){
                		    console.log('this one is happening')
			                this.goToSelectedPage(this.selectedPageIndex + 1, 'down')
                        } else {
		                    this.goToSelectedPage(this.selectedPageIndex, 'down')
                        }
                    }

                } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
	                const newAudio = this.menuFocusSound.cloneNode();
	                newAudio.volume = Math.random() * 0.3;
	                newAudio.play()

	                if (this.selectedPageIndex === 0) {

	                	if(document.getElementById(this.pages[1]).classList.contains('focused-button')){
                            this.selectedPageIndex = 0
			                return this.goToSelectedPage(this.selectedPageIndex, 'up', false)
                        }

	                	if(document.getElementById(this.pages[0]).classList.contains('focused-button')){
		                    document.getElementById(this.pages[0]).classList.remove('focused-button')
                        }

		                this.selectedPageIndex = this.pages.length - 1;
		                this.goToSelectedPage(this.selectedPageIndex, 'up', true)
	                } else {
	                	if(this.lastDirectionPressed === 'down'){
	                		console.log('the last direction pressed was down')
			                this.goToSelectedPage(this.selectedPageIndex - 2, 'up', false, true)
                        } else {
		                    this.goToSelectedPage(this.selectedPageIndex, 'up', false)
                        }
	                	console.log('going up')
	                }
                }

            },
            goToSelectedPage(pageIndex, direction, goToTop, fromOppositeDirection){
				console.log(pageIndex)

	            this.selectedPage = this.pages[pageIndex]
	            document.getElementById(this.pages[pageIndex]).classList.add('focused-button')
                console.log(this.pages[pageIndex], document.getElementById(this.pages[pageIndex]).classList)

	            if(direction === 'up') {
		            if (goToTop === false) {
                        document.getElementById(this.pages[pageIndex + 1]).classList.remove('focused-button')
		            }
	            }

                if(pageIndex !== 0) {
                    document.getElementById(this.pages[pageIndex - 1]).classList.remove('focused-button')
                }

                if(direction === 'up'){
	                this.selectedPageIndex = pageIndex - 1;
                } else {
                	if(pageIndex === 0) {
		                document.getElementById(this.pages[0]).classList.remove('focused-button')
                    }
                    this.selectedPageIndex = pageIndex + 1;
                }

                if(this.selectedPageIndex === -1) this.selectedPageIndex = 0;

	            this.lastDirectionPressed = direction

	            console.log(this.selectedPage, this.pages, this.selectedPageIndex)
            }
        },
        created(){
			if(Object.keys(this.signedInUser).length !== 0){
				this.userLoggedIn = true;
				this.pages = ['time-trials','online-pvp','profile','log-in']
            }

			document.addEventListener('keydown', this.handleKeyDownListenerTitlePage)
        }
	}
</script>

<style scoped>
.title-container{
    background: linear-gradient(180deg, #3b055a, #190221, #260631, #000000);
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
    transition: 0.2s ease;
}

.local-btn{
    background: linear-gradient(320deg, #8a18d0, #bd3ce7, #550a6d, #9248a5);
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
    transition: 0.2s ease;
}

.online-btn{
    background: linear-gradient(320deg, #8a18d0, #bd3ce7, #550a6d, #9248a5);
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
    transition: 0.2s ease;
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

.focused-button{
    transform: scale(1.15)
}

.local-btn:hover{
    transform: translateX(20px);
}

.online-btn:hover{
    transform: translateX(20px);
    box-shadow: rgb(107 18 107) -5px 0px 9px 1px !important;
}

.floating-text{
    animation: float 4s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateX(120px) translateY(-210px) scale(0.55);
    }
    50% {
        transform: translateX(120px) translateY(-220px) scale(0.55);
    }
    100% {
        transform: translateX(120px) translateY(-210px) scale(0.55);
    }
}

/*loading animation*/
.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(24px, 0);
    }
}
</style>