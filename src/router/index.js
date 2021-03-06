import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Board from "../components/Board";
import BoardMultiplayer from "../components/BoardMultiplayer";
import RoomSelect from "../components/RoomSelect";
import TitlePage from "../components/TitlePage";
import TimeTrials from "../components/TimeTrials";
import UserProfile from "../components/UserProfile";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TitlePage,
  },
  {
    path: '/local',
    name: 'Board',
    component: Board
  },
  {
    path: '/multiplayer',
    name: 'Multiplayer',
    component: RoomSelect
  },
  {
    path: '/time-trials',
    name: 'Time-Trials',
    component: TimeTrials,
  },
  {
    path: '/userProfile',
    name: 'User Profile',
    component: UserProfile
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
