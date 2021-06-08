<template>
    <div class="title-container" :style="mainTitleContainerStyle">
        <div class="stats-container" :style="statsMainContainerStyle">
            <div class="pvp-stats-container" :style="pvpStatsContainerStyle">

            </div>
            <div class="times-stats-container" :style="timeStatsContainerStyle">
                <div :style="timeStatsStyle">
                    <div :style="timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL I - <strong :style="strongStyle">{{signedInUser['time-trial-I'].bestTime === null ? 0 : signedInUser['time-trial-I'].bestTime.time}}s </strong></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "TitlePage",
		data(){
			return{
			}
		},
		computed:{
			mainTitleContainerStyle(){
				return {
					width: 100 + 'vw',
					height: 100 + 'vh',
					display: 'flex',
					flexFlow: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: "'Viga', sans-serif",
				}
			},
			statsMainContainerStyle(){
				return{
                    width: 75 + '%',
                    height: 85 + '%',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
			pvpStatsContainerStyle(){
				return{
					width: 20 + '%',
					height: 100 + '%',
					display: 'flex',
					flexFlow: 'column',
					justifyContent: 'center',
					alignItems: 'center',
                    borderRight: '1px solid white',
				}
			},
			timeStatsContainerStyle(){
				return{
					width: 90 + '%',
					height: 100 + '%',
					display: 'flex',
					flexFlow: 'column',
					justifyContent: 'start',
					alignItems: 'start',
				}
			},
            timeStatsStyle(){
				return{
					width: 100 + '%',
                    height: 8.5 + '%',
					display: 'flex',
					flexFlow: 'row',
					justifyContent: 'start',
					alignItems: 'center',
                    textAlign: 'center',
                }
            },
            timeTitleStyle(){
			    return{
			    	width: 25 + '%',
                    height: 100 + '%',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
            strongStyle(){
				return{
					color: 'gold',
                    alignText: 'center',
                }
            },
            pStyle(){
				return{
                    alignText: 'center',
                }
            },
            signedInUser(){
				return this.$store.state.signedInUser
            }
		},
		methods:{
		},
		created(){
			console.log(this.signedInUser)
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