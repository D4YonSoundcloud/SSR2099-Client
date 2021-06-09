<template>
    <div class="board-container" :style="boardContainerStyle">
        <div class="room-select-container" v-if="multiplayerReady === false" :style="roomSelectContainerStyle">

            <div v-if="showJoinSelect" :class="showCreateSelect ? 'room-type-container' : ''" @click="goToSelectedType('showCreateSelect')"
                 :style="showCreateSelect ? roomTypeContainerStyle : roomTypeContainerSoloStyle">
                <h1 class="room-select-h1" :style="h1Style">JOIN</h1>
                <div class="room-input-container" v-if="showJoinRoomInput">
                    <input type="text" :style="inputStyle" v-model="roomId" placeholder="enter match id">
                    <div class="room-input-buttons-container">
                    </div>
                </div>
                <button class="room-button" :style="buttonStyle" v-if="showJoinRoomInput" @click="goToCharacterSelect()"> ARTIST SELECT </button>
                <button class="room-button" :style="buttonStyle" v-if="showJoinRoomInput" @click="goToHome()"> CANCEL </button>
            </div>

            <div v-if="showCreateSelect" :class="showJoinSelect ? 'room-type-container' : ''" @click="goToSelectedType('showJoinSelect')"
                 :style="showJoinSelect ? roomTypeContainerStyle : roomTypeContainerSoloStyle">
                <h1 class="room-select-h1" v-if="showJoinSelect" :style="h1Style">CREATE+</h1>
                <div class="room-id" v-if="showRoomId">
                    <h1 :style="h1Style"> Your Match ID </h1>
                    <p :style="pStyle">{{ roomId }}</p>
                </div>
                <button class="room-button" :style="buttonStyle" v-if="showRoomId" @click="goToCharacterSelect()">
                    ARTIST SELECT
                </button>
                <button class="room-button" :style="buttonStyle" v-if="showRoomId" @click="goToHome()"> CANCEL </button>
            </div>

            <div v-if="showCharacterSelect" :class="showJoinSelect ? 'room-type-container' : ''"
                 :style="showJoinSelect ? roomTypeContainerStyle : roomTypeContainerSoloStyle">
                <h1 class="room-select-h1" v-if="showCharacterSelect" :style="h1Style">Artist Select - ({{roomId}})</h1>
                <div class="character-select" :style="characterSelectContainerStyle">
                    <div class="room-type-container" :style="selectedCharacter === 'D4Y' ? characterSelectedStyle : characterSelectStyle" @click="selectCharacter('D4Y')"> <p>D4Y</p> </div>
                    <div class="room-type-container" :style="selectedCharacter === 'KABBAGE' ? characterSelectedStyle : characterSelectStyle" @click="selectCharacter('KABBAGE')"> <p>Kabbage</p> </div>
                    <div class="room-type-container" :style="selectedCharacter === 'GOOB' ? characterSelectedStyle : characterSelectStyle" @click="selectCharacter('GOOB')"> <p>Goob</p> </div>
                    <div class="room-type-container" :style="selectedCharacter === 'TATHARDES' ? characterSelectedStyle : characterSelectStyle" @click="selectCharacter('TATHARDES')"> <p>Tathardes</p> </div>
                    <div class="room-type-container" :style="selectedCharacter === 'YUNG LAZLO' ? characterSelectedStyle : characterSelectStyle" @click="selectCharacter('YUNG LAZLO')"> <p>Yung Lazlo</p> </div>
                    <div class="room-type-container" :style="selectedCharacter === 'NESS' ? characterSelectedStyle : characterSelectStyle" @click="selectCharacter('NESS')"> <p>NESS</p> </div>
                </div>
                <div class="map-select" :style="mapSelectContainerStyle">
                    <div class="map-container" v-if="showJoinSelect === false" :style="selectedMap === 'classic' ? mapSelectedStyle : mapSelectStyle" @click="selectMap('classic')"> classic </div>
                    <div class="map-container" v-if="showJoinSelect === false" :style="selectedMap === 'contained' ? mapSelectedStyle : mapSelectStyle" @click="selectMap('contained')"> contained </div>
                    <div class="map-container" v-if="showJoinSelect === false" :style="selectedMap === 'big dot' ? mapSelectedStyle : mapSelectStyle" @click="selectMap('big dot')"> big dot</div>
                </div>

                <button class="room-button" :style="buttonStyle" v-if="showCharacterSelect" @click="joinMatch()"> JOIN </button>
                <button class="room-button" :style="buttonStyle" v-if="showCharacterSelect" @click="goToHome()"> CANCEL </button>
            </div>

        </div>
        <BoardMultiplayer v-if="multiplayerReady === true" :roomId="roomId" :selectedCharacter="selectedCharacter" :selectedMap="selectedMap" :characterId="characterId"></BoardMultiplayer>
    </div>
</template>

<script>
    import BoardMultiplayer from "./BoardMultiplayer";

	export default {
		name: "RoomSelect",
        components:{
		    BoardMultiplayer
        },
        data(){
		    return {
		    	generatedRoomId: '',
                showJoinSelect: true,
                showCreateSelect: true,
                showCharacterSelect: false,
                showRoomId: false,
                showJoinRoomInput: false,
                roomId: this.makeId(5),
                transitionTime: 0.2,
                selectedCharacter: '',
                characterId: this.makeId(5),
                multiplayerReady: false,
                selectedMap: 'classic',
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
            goToSelectedType(containerToClose){
	        	console.log('nothing is happening')
                this[containerToClose] = false;
	        	if(containerToClose === 'showJoinSelect') {
	        		return this.showRoomId = true;
                } else if (containerToClose === 'showCreateSelect') {
	        		return this.showJoinRoomInput = true;
                }
            },
            goToCharacterSelect(){
                this.showJoinSelect = false;
                this.showCreateSelect = false;
                this.showRoomId = false;
                this.showJoinRoomInput = false;

                this.showCharacterSelect = true;
            },
            joinMatch(){
	        	this.multiplayerReady = true;
	        	console.log('you are joining a match', this.selectedCharacter, this.characterId)
            },
            goToHome(){
                setTimeout(() => {
	                this.showCreateSelect = true;
	                this.showJoinSelect = true;
	                this.showRoomId = false;
	                this.showJoinRoomInput = false;
	                this.showCharacterSelect = false;
	                this.selectedCharacter = '';
	                console.log('this is happening')
                }, 50)
            },
            selectCharacter(character){
	        	this.selectedCharacter = character;
            },
            selectMap(map){
	            this.selectedMap = map;
            }
        },
		computed:{
			inputStyle(){
				return {
					height: 40 + 'px',
					padding: 6 + 'px',
					margin: 12 + 'px',
					outline: 'none',
					width: 50 + '%',
					borderRadius: 5 + 'px',
					backgroundColor: '#320c3e',
					border: 'none',
					color: 'white',
				}
			},
			buttonStyle(){
				return {
					cursor: 'pointer',
					outline: 'none',
					color: 'white',
					backgroundColor: 'orange',
					border: 'none',
					padding: 8 + 'px',
					fontSize: 1 + 'em',
					width: 50 + '%',
					marginLeft: 25 + '%',
					borderRadius: 5 + 'px',
					marginTop: 6 + 'px',
					marginBottom: 6 + 'px',
					transition: this.transitionTime + 's ease',
					fontFamily: "'Viga', sans-serif",
                    boxShadow: '0px 0px 7px 1px orange'
				}
			},
			pStyle(){
				return {
					marginTop: 6 + 'px',
					marginBottom: 6 + 'px',
					width: 100 + '%',
				}
			},
			h1Style(){
				return {
					fontFamily: "'Viga', sans-serif",
					cursor: 'pointer',
                    transition: this.transitionTime + 's ease',
				}
			},
			boardContainerStyle(){
				return {
					paddingTop: 5 + '%',
					height: 100 + 'vh',
					width: 100 + 'vw',
					display: 'flex',
					justifyContent: 'center',
					alignContent: 'center',
					backgroundColor: '#26033c',
				}
			},
			roomSelectContainerStyle(){
				return {
					padding: 1.25 + '%',
					height: 500 + 'px',
					minWidth: 660 + 'px',
					display: 'flex',
					justifyContent: 'space-between',
					alignContent: 'center',
					flexFlow: 'row',
					borderRadius: 10 + 'px',
					boxShadow:  'rgb(38 3 49) 0px -16px 20px 0px, inset rgb(31 0 41) 0px -20px 20px 0px',
					color: 'white',
                    transition: this.transitionTime + 's ease',
				}
			},
			roomTypeContainerStyle(){
				return {
					cursor: 'default',
					padding: 2.5 + '%',
					height: 99.5 + '%',
					width: 50 + '%',
					display: 'flex',
					justifyContent: 'center',
					alignContent: 'center',
					flexFlow: 'column',
					borderRadius: 2 + 'px',
					transition: this.transitionTime + 's ease',
					transformOrigin: 'center',
				}
			},
			roomTypeContainerSoloStyle(){
				return {
					cursor: 'default',
					padding: 2.5 + '%',
					height: 99.5 + '%',
					width: 99.5 + '%',
					display: 'flex',
					justifyContent: 'center',
					alignContent: 'center',
					flexFlow: 'column',
					borderRadius: 2 + 'px',
					transition: this.transitionTime + 's ease',
					transformOrigin: 'center',
				}
			},
            mapSelectContainerStyle(){
                return {
                    cursor: 'default',
                    padding: 8 + 'px',
                    height: 30 + '%',
                    width: 100 + '%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexFlow: 'row',
                    borderRadius: 2 + 'px',
                }
            },
            mapSelectStyle(){
                return {
                    cursor: 'pointer',
                    padding: 8 + 'px',
                    height: 50 + 'px',
                    width: 100 + 'px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexFlow: 'row',
                    borderRadius: 2 + 'px',
                    outline: 1 + 'px solid purple',
                    margin: 8 + 'px',
                    transformOrigin: 'center',
                }
            },
            mapSelectedStyle(){
                return {
                    cursor: 'pointer',
                    padding: 8 + 'px',
                    height: 50 + 'px',
                    width: 100 + 'px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexFlow: 'row',
                    borderRadius: 2 + 'px',
                    outline: 2 + 'px solid #b4b4b4',
                    margin: 8 + 'px',
                    transform: 'scale(1.025)',
                    transformOrigin: 'center',
                    transition: this.transitionTime + 's ease',
                }
            },
			characterSelectContainerStyle(){
				return {
					cursor: 'default',
					padding: 8 + 'px',
					height: 40 + '%',
					width: 100 + '%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexFlow: 'row',
					borderRadius: 2 + 'px',
				}
			},
			characterSelectStyle(){
				return {
					cursor: 'pointer',
					padding: 8 + 'px',
					height: 100 + 'px',
					width: 100 + 'px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexFlow: 'row',
					borderRadius: 2 + 'px',
					outline: 1 + 'px solid purple',
					margin: 8 + 'px',
					transformOrigin: 'center',
                    transition: this.transitionTime + 's ease',
				}
			},
			characterSelectedStyle(){
				return {
					cursor: 'pointer',
					padding: 8 + 'px',
					height: 100 + 'px',
					width: 100 + 'px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexFlow: 'row',
					borderRadius: 2 + 'px',
					outline: 2 + 'px solid #b4b4b4',
					margin: 8 + 'px',
					transform: 'scale(1.025)',
					transformOrigin: 'center',
					transition: this.transitionTime + 's ease',
				}
			}
		},
	}
</script>

<style scoped>
    .board-container{
        background: linear-gradient(180deg, #3b055a, #190221, #260631, #000000);
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
        transition: 0.2s ease;
    }

    .room-select-container{
        background: linear-gradient(359deg, #0d0015, #500b67, #360446, #30033c);
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
        transition: 0.2s ease;
    }

    .room-type-container:hover{
        transform: scale(1.025);
        box-shadow: 0 0 1px 1px #b4b4b4;
    }
    .room-select-h1:hover{
        border-bottom: 1px solid orange;
        border-top: 1px solid orange;
    }
    .room-button:hover{
        display: initial;
        transform: scale(1.025);
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