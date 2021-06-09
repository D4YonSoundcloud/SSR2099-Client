import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerLivesStore: 50,
    enemyLivesStore: 50,
    signedInUser: {}
  },
  mutations: {
    CHANGE_ENEMY_LIVES(state,payload){
      state.enemyLivesStore = payload
    },
    CHANGE_PLAYER_LIVES(state,payload){
      state.playerLivesStore = payload
    },
    SIGN_IN_USER(state,payload){
      console.log(payload)

      state.signedInUser.userId = payload.userId
      state.signedInUser.googleUserName = payload.userGoogleName
      state.signedInUser['time-trial-I'] = payload['time-trial-I']
      state.signedInUser['time-trial-II'] = payload['time-trial-II']
      state.signedInUser['time-trial-III'] = payload['time-trial-III']
      state.signedInUser['time-trial-IV'] = payload['time-trial-IV']
      state.signedInUser['time-trial-V'] = payload['time-trial-V']
      state.signedInUser['time-trial-VI'] = payload['time-trial-VI']
      state.signedInUser['time-trial-VII'] = payload['time-trial-VII']
      state.signedInUser['time-trial-VIII'] = payload['time-trial-VIII']
      state.signedInUser['time-trial-IX'] = payload['time-trial-IX']
      state.signedInUser['time-trial-X'] = payload['time-trial-X']
      state.signedInUser['time-trial-all'] = payload['time-trial-all']
      state.signedInUser['pvpStats'] = payload['pvpStats']

      console.log(state.signedInUser)
    },
    SIGN_OUT_USER(state,payload){
      state.signedInUser = {};
    },
    UPDATE_USER_TIMES(state, payload){
      console.log(payload);
      state.signedInUser = payload
    }
  },
  actions: {
    getChangeEnemyLives({commit}, payload){
      commit('CHANGE_ENEMY_LIVES', payload)
    },
    getChangePlayerLives({commit}, payload){
      commit('CHANGE_PLAYER_LIVES', payload)
    },
    getSignInUser({commit}, payload){
      commit('SIGN_IN_USER', payload)
    },
    getSignOutUser({commit}, payload){
      commit('SIGN_OUT_USER', payload)
    },
    getUpdateUserTimes({commit}, payload){
      commit('UPDATE_USER_TIMES', payload)
    }
  },
  modules: {
  },
  plugins: [createPersistedState()],
})
