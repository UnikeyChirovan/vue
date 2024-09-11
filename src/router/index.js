import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../axiosInterceptor';
import admin from './admin';
import home from './home';
import about from './about';
import contact from './contact';
import maps from './maps';
import settings from './settings';
import stories from './stories';
import profile from './profile';

const routes = [
  ...admin,
  ...home,
  ...about,
  ...contact,
  ...maps,
  ...settings,
  ...stories,
  ...profile,
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'home' });
  } else if (authStore.isLoggedIn && authStore.accessToken) {
    try {
      await api.get('/auth/check-session', {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
      next();
    } catch (error) {
      authStore.logout();
      next({ name: 'home' });
    }
  } else {
    next();
  }
});


export default router;
