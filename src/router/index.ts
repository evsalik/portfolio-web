import { createRouter, createWebHistory } from 'vue-router';
import IntroPage from '../components/IntroPage.vue';
import RoomModel from '../components/RoomModel.vue';

const routes = [
  { path: '/', component: IntroPage },
  { path: '/room-tour', component: RoomModel },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
