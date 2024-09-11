const settings = [
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../pages/settings/index.vue'),
    meta: { requiresAuth: true },
  },
];
export default settings;
