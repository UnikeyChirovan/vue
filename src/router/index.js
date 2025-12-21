import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
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
import supportRoutes from './support';

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
  ...supportRoutes,
  ...PasswordReset,
  ...PasswordResetRequest,
  ...PrivacyPolicy,
  ...TermsOfService,
  ...FAQ,
  // Route 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
  },
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
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 1. Kiểm tra dữ liệu cơ bản đã load chưa
  const isDataLoaded = localStorage.getItem('Before') === 'ok';

  if (!isDataLoaded && to.name !== 'home') {
    return next({ name: 'home' });
  }

  // 2. Kiểm tra xác thực
  const isAuthenticated = authStore.isLoggedIn && authStore.user;

  // Nếu route yêu cầu đăng nhập mà user chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      name: 'home',
      query: { redirect: to.fullPath },
    });
  }

  // 3. Kiểm tra quyền Admin (department_id = 1)
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      return next({ name: 'home' });
    }

    // Kiểm tra department_id từ user object
    if (!authStore.user || authStore.user.department_id !== 1) {
      return next({ name: 'home' });
    }
  }

  // 4. Kiểm tra quyền Manager (department_id = 3 hoặc 1)
  if (to.meta.requiresManager) {
    if (!isAuthenticated) {
      return next({ name: 'home' });
    }

    // Kiểm tra department_id: 1 (admin) hoặc 3 (manager)
    const departmentId = authStore.user?.department_id;
    if (departmentId !== 1 && departmentId !== 3) {
      return next({ name: 'home' });
    }
  }

  // Cho phép truy cập
  next();
});

// Global error handler
router.onError((error) => {
  router.push({ name: 'home' });
});

export default router;
