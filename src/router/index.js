import { createRouter, createWebHistory } from 'vue-router';
import admin from './admin';
import home from './home';
import about from './about';
import contact from './contact';
import maps from './maps';
import settings from './settings';
import stories from './stories';

const routes = [
  ...admin,
  ...home,
  ...about,
  ...contact,
  ...maps,
  ...settings,
  ...stories,
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
