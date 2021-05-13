import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Board from "../components/Board";
import BoardMultiplayer from "../components/BoardMultiplayer";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Board',
    component: Board
  },
  {
    path: '/multiplayer',
    name: 'Multiplayer',
    component: BoardMultiplayer
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
