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
    ],
  },
];
export default profile;
