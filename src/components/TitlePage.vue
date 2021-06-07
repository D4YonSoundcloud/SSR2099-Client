<template>
    <div class="title-container" :style="mainTitleContainerStyle">
        <div :style="titleStyle">
            <div :style="titleSoundCloudStyle"></div>
            <div :style="titleStardumStyle"></div>
            <div :style="titleRoyaleStyle" class="floating-text"></div>
        </div>
        <div class="local-btn" :style="buttonStyle" @click="goToLocal()">
            <h1 class="blinking-h1" :style="h1Style"> LOCAL </h1>
        </div>
        <div class="online-btn" :style="buttonStyle" @click="goToMultiplayer()">
            <h1 class="blinking-h1" :style="h1Style"> ONLINE </h1>
        </div>
        <div class="online-btn" :style="buttonStyle" @click="goToTimeTrial()">
            <h1 class="blinking-h1" :style="h1Style"> TIME-TRIALS </h1>
        </div>
        <div class="online-btn" :style="buttonStyle" @click="goToLoginWithGoogle()">
            <h1 class="blinking-h1" :style="h1Style"> {{ userLoggedIn ? 'LOG-OUT' : 'LOG-IN' }} </h1>
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
                developmentURL: 'https://stark-thicket-52069.herokuapp.com/',
                userLoggedIn: false,
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
			        fontFamily: "'Viga', sans-serif",
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
            goToLoginWithGoogle(){
				console.log('signing in with google AUTH')

                if(this.userLoggedIn === true){
                	console.log('logging out the user')

                	return this.$gAuth.signOut().then(() => {
		                this.$store.dispatch('getSignOutUser')
                		this.userLoggedIn = false;
                    })
                }

                this.$gAuth.signIn()
                    .then(googleUser => {
                        let userInfo = {
                	    	loginType: 'google',
                            user: googleUser,
                            userId: googleUser.Aa,
                            userGoogleName: googleUser.At.Ve
                        }

                        axios.post(`${this.localhostURL}/login`, userInfo)
                            .then( response => {
                        	    console.log('response from server', response.data)
                                this.$store.dispatch('getSignInUser', response.data)
	                            this.userLoggedIn = true;
	                            this.$router.push('/')
                            })
	                        .catch(error => {
		                        console.log('error logging in', error);
	                        })
                    })
                    .catch(error => {
                    	console.log('error signed in', error)

                        this.$gAuth.signOut().then(() => {
                                console.log('the user has logged out')
                        })
                        .catch(err => {
                            console.log('error signout', err)
                        })
                    })
            }
        },
        created(){
			if(Object.keys(this.signedInUser).length !== 0){
				this.userLoggedIn = true;
            }
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

.local-btn:hover{
    transform: translateX(20px);
}

.online-btn:hover{
    transform: translateX(20px);
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
</style>