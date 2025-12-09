const supportRoutes = [
  {
    path: '/support-dashboard',
    name: 'support-dashboard',
    component: () => import('../pages/support/SupportDashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresManager: true, // Chỉ manager/admin
    },
  },
];

export default supportRoutes;
