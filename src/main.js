import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import LogRocket from 'logrocket';

LogRocket.init('vnrpbi/soundcloud-stardum-royale');

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
