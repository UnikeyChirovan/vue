const profile = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../layouts/profile.vue'),
    meta: { requiresAuth: true },
        children: [
      // Quản Lý Users
      {
        path: 'info',
        name: 'profile-info',
        component: () => import('../pages/profile/users/index.vue'),
      },
      {
        path: 'edit',
        name: 'profile-edit',
        component: () => import('../pages/profile/edits/index.vue'),
      },
      // Quản lý settings
      {
        path: 'settings',
        name: 'profile-settings',
        component: () => import('../pages/profile/settings/index.vue'),
      },
      // profile của người khác
      {
        path: ':id',
        name: 'profile-info-guest',
        component: () => import('../pages/profile/guest/index.vue'),
      },
      {
        path: '/not-found/:id',
        name: 'not-found',
        component: () => import('../pages/profile/notfound/index.vue'),
      },
    ],
  },
];
export default profile;
