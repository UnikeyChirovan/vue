import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
// import api from '../services/axiosInterceptor';
import admin from './admin';
import home from './home';
import about from './about';
import contact from './contact';
import maps from './maps';
import settings from './settings';
import stories from './stories';
import profile from './profile';
import PasswordReset from './passwordreset';
import PasswordResetRequest from './PasswordResetRequest';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import FAQ from './faq';
import animators from './animator';

const routes = [
  ...admin,
  ...home,
  ...about,
  ...contact,
  ...maps,
  ...animators,
  ...settings,
  ...stories,
  ...profile,
  ...PasswordReset,
  ...PasswordResetRequest,
  ...PrivacyPolicy,
  ...TermsOfService,
  ...FAQ,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; 
    } else {
      return { top: 0 }; 
    }
  }
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  // truy cập vào mà chưa load dữ liệu
  if (!localStorage.getItem('Before') && to.path !== '/') {
    return next({ path: '/' });
  }
// truy cập mà chưa đăng nhập
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
