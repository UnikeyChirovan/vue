const profile = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/profile/index.vue'),
    meta: { requiresAuth: true },
  },
];
export default profile;
