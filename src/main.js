import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import GAuth from 'vue-google-oauth2'

const gauthOption = {
  clientId: `${process.env.VUE_APP_CLIENT_ID}`,
  scope: 'profile email',
  prompt: 'select_account'
}

let clientId = `${process.env.VUE_APP_CLIENT_ID}`

console.log(clientId, 'this is the app client ID')

Vue.use(GAuth, gauthOption)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
