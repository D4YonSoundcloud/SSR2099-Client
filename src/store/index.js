import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerLivesStore: 50,
    enemyLivesStore: 50,
  },
  mutations: {
    CHANGE_ENEMY_LIVES(state,payload){
      state.enemyLivesStore = payload
    },
    CHANGE_PLAYER_LIVES(state,payload){
      state.playerLivesStore = payload
    },
  },
  actions: {
    getChangeEnemyLives({commit}, payload){
      commit('CHANGE_ENEMY_LIVES', payload)
    },
    getChangePlayerLives({commit}, payload){
      commit('CHANGE_PLAYER_LIVES', payload)
    }
  },
  modules: {
  }
})
