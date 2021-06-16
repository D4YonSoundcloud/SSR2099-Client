<template>
    <div class="title-container" :style="mainTitleContainerStyle">
        <div class="stats-container" :style="statsMainContainerStyle">
            <!-- PVP stats + name container -->
            <div class="pvp-stats-container" :style="pvpStatsContainerStyle">
                <h1 :style="h1Style"> {{signedInUserName.toUpperCase()}}</h1>
                <div class="pvp-stats" :style="winLossContainerStyle">
                    <div class="win-loss-box" :style="winLossBoxStyle">
                        <h2 :style="h2Style">W: {{userWins}}</h2>
                    </div>
                    <div class="win-loss-box" :style="winLossBoxStyle">
                        <h2 :style="h2Style">L: {{userLosses}}</h2>
                    </div>
                </div>
            </div>


            <div class="times-stats-container" :style="timeStatsContainerStyle">
                <!-- Time trial I Stats-->
                <div @click="showStatDetails('time-trial-I')" :style="detailViewTimeTrial['time-trial-I'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-I'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL I -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-I'].bestTime === null ? '...' : signedInUser['time-trial-I'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-I'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-I')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-I'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial II Stats-->
                <div @click="showStatDetails('time-trial-II')" :style="detailViewTimeTrial['time-trial-II'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-II'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL II -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-II'].bestTime === null ? '...' : signedInUser['time-trial-II'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-II'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-II')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-II'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial III Stats-->
                <div @click="showStatDetails('time-trial-III')" :style="detailViewTimeTrial['time-trial-III'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-III'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL III -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-III'].bestTime === null ? '...' : signedInUser['time-trial-III'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-III'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-III')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-III'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial IV Stats-->
                <div  @click="showStatDetails('time-trial-IV')" :style="detailViewTimeTrial['time-trial-IV'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-IV'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL IV -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-IV'].bestTime === null ? '...' : signedInUser['time-trial-IV'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-IV'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-IV')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-IV'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial V Stats-->
                <div @click="showStatDetails('time-trial-V')" :style="detailViewTimeTrial['time-trial-V'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-V'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL V -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-V'].bestTime === null ? '...' : signedInUser['time-trial-V'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-V'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-V')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-V'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial VI Stats-->
                <div :style="detailViewTimeTrial['time-trial-VI'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-VI'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL VI -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-VI'].bestTime === null ? '...' : signedInUser['time-trial-VI'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-VI'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-VI')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container" @click="showStatDetails('time-trial-VI')">
                            <svg v-if="detailViewTimeTrial['time-trial-VI'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial VII Stats-->
                <div  @click="showStatDetails('time-trial-VII')" :style="detailViewTimeTrial['time-trial-VII'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-VII'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL VII -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-VII'].bestTime === null ? '...' : signedInUser['time-trial-VII'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-VII'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-VII')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-VII'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial VIII Stats-->
                <div  @click="showStatDetails('time-trial-VIII')" :style="detailViewTimeTrial['time-trial-VIII'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-VIII'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL VIII -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-VIII'].bestTime === null ? '...' : signedInUser['time-trial-VIII'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-VIII'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-VIII')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-VIII'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial IX Stats-->
                <div  @click="showStatDetails('time-trial-IX')" :style="detailViewTimeTrial['time-trial-IX'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-IX'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL IX -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-IX'].bestTime === null ? '...' : signedInUser['time-trial-IX'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-IX'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-IX')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-IX'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial X Stats-->
                <div  @click="showStatDetails('time-trial-X')" :style="detailViewTimeTrial['time-trial-X'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-X'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL X -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-X'].bestTime === null ? '...' : signedInUser['time-trial-X'].bestTime.time + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-X'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-X')">
                            <p :style="timePreviewPStyle">{{time.time}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-X'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Time trial All Stats-->
                <div  @click="showStatDetails('time-trial-all')" :style="detailViewTimeTrial['time-trial-all'] ? timeStatsDetailsStyle : timeStatsStyle">
                    <div :style="detailViewTimeTrial['time-trial-all'] ? timeTitleDetailedStyle : timeTitleStyle">
                        <p :style="pStyle">TIME TRIAL ALL -
                            <strong :style="strongStyle">
                                {{signedInUser['time-trial-all'].bestTime === null ? '...' : signedInUser['time-trial-all'].bestTime.time.toFixed(2) + 's'}}
                            </strong>
                        </p>
                    </div>
                    <div :style="detailViewTimeTrial['time-trial-all'] ? timePreviewDetailedStyle : timePreviewStyle">
                        <div :style="timePreviewContainerStyle" v-for="(time, index) in signedInUserPreview('time-trial-all')">
                            <p :style="timePreviewPStyle">{{time.time.toFixed(2)}}</p>
                            <p :style="timePreviewPDateStyle">{{datetime.fromMillis(time.date).toLocaleString({month: 'numeric', day: 'numeric'})}}</p>
                        </div>
                        <div :style="timePreviewShowDetailsStyle" class="details-container">
                            <svg v-if="detailViewTimeTrial['time-trial-all'] === false" style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path :fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                            <svg v-else style="width:24px;height:24px;transform-origin: center;transform:rotateX(180deg)" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { DateTime } from 'luxon'

	export default {
		name: "TitlePage",
		data(){
			return{
			    datetime: DateTime,
                detailViewTimeTrial:{
			        'time-trial-I': false,
			        'time-trial-II': false,
			        'time-trial-III': false,
			        'time-trial-IV': false,
			        'time-trial-V': false,
			        'time-trial-VI': false,
			        'time-trial-VII': false,
			        'time-trial-VIII': false,
			        'time-trial-IX': false,
			        'time-trial-X': false,
			        'time-trial-all': false,
                },
                currentColor: 'white',
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
					fontFamily: "'Orbitron', sans-serif",
				}
			},
            h1Style(){
                return{
                    marginTop: 25 + '%',
                    height: 10 + '%',
                    width: 100 + '%',
                    color: 'white',

                }
            },
			h2Style(){
				return{
					width: 100 + '%',
					color: 'white',
				}
			},
			statsMainContainerStyle(){
				return{
                    width: 95 + '%',
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
					justifyContent: 'start',
					alignItems: 'center',
                    borderRight: '1px solid white',
				}
			},
            winLossContainerStyle(){
				return{
					width: 90 + '%',
					height: 25 + '%',
					display: 'flex',
					flexFlow: 'row',
					justifyContent: 'start',
					alignItems: 'center',
                }
			},
			winLossBoxStyle(){
			    return{
			    	width: 50 + '%',
                    height: 100 + '%',
				    display: 'flex',
				    flexFlow: 'row',
				    justifyContent: 'start',
				    alignItems: 'center',
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
                    height: 10 + '%',
                    cursor: 'pointer',
					display: 'flex',
					flexFlow: 'row',
					justifyContent: 'start',
					alignItems: 'center',
                    textAlign: 'center',
                    transition: 0.2 + 's ease',
                    marginLeft: 32 + 'px',
                    transformOrigin: 'top',
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
            timeTitleDetailedStyle(){
			    return{
			        width: 25 + '%',
                    height: 10 + '%',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
            timePreviewStyle(){
			    return{
			        width: 75 + '%',
                    height: 100 + '%',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'start',
                    alignItems: 'start',
                }
            },
            timePreviewDetailedStyle(){
                return{
                    width: 75 + '%',
                    height: 10 + '%',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'start',
                    alignItems: 'start',
                }
            },
            timePreviewContainerStyle(){
                return{
                    width: 9 + '%',
                    height: 100 + '%',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            },
            timePreviewShowDetailsStyle(){
                return{
                    width: 10 + '%',
                    height: 100 + '%',
                    color: 'white',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 0.2 + 's ease'
                }
            },
            timeStatsDetailsStyle(){
                return{
                    width: 100 + '%',
                    height: 100 + '%',
                    display: 'flex',
                    flexFlow: 'row',
                    justifyContent: 'start',
                    alignItems: 'start',
                    textAlign: 'center',
                    marginLeft: 32 + 'px',
                    transition: 0.2 + 's ease',
                    borderBottomRightRadius: 5 + 'px',
                    borderRight: '1px solid white',
                    borderBottom: '1px solid white',
                    transformOrigin: 'top',
                }
            },
            strongStyle(){
				return{
					color: 'gold',
                    alignText: 'center',
                    textShadow: '0 0 7px gold'
                }
            },
            pStyle(){
				return{
                    alignText: 'center',
                }
            },
            timePreviewPStyle(){
			    return{
			        color: 'white',
                    width: 100 + '%',
                    paddingBottom: 2 + 'px',
                }
            },
            timePreviewPDateStyle(){
                return{
                    color: 'white',
                    width: 100 + '%',
                }
            },
            signedInUser(){
				return this.$store.state.signedInUser
            },
            userWins(){
			    return this.$store.state.signedInUser.pvpStats.wins
            },
            userLosses(){
	            return this.$store.state.signedInUser.pvpStats.losses
            },
            userExperience(){
				return this.$store.state.signedInUser.pvpStats.experience
            },
            signedInUserName(){
			    return this.$store.state.signedInUser['userGoogleName']
            }
		},
		methods:{
            signedInUserPreview(timeTrial){
                if(this.signedInUser[timeTrial].times.length === 0){
                    return {}
                }
                if(this.signedInUser[timeTrial].times.length < 10){
                    let previewArray = [...this.signedInUser[timeTrial].times]
                    return previewArray.reverse()
                }
                let previewArray = [...this.signedInUser[timeTrial].times]
                return previewArray.slice(1).slice(-10).reverse()
            },
            showStatDetails(timeTrialGiven){
                for(let timeTrial in this.detailViewTimeTrial){
                    if(timeTrial === timeTrialGiven){
                        if(this.detailViewTimeTrial[timeTrial] === true){
                            this.detailViewTimeTrial[timeTrial] = false
                        } else {
                            this.detailViewTimeTrial[timeTrial] = true
                        }
                    } else {
                        this.detailViewTimeTrial[timeTrial] = false;
                    }
                }
            }
		},
		created(){
			console.log(this.signedInUser, this.signedInUserName)
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