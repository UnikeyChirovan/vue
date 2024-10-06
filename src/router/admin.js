const admin = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../layouts/admin.vue'),
    meta: { requiresAuth: true },
    children: [
      // Quản Lý Users
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../pages/admin/users/index.vue'),
      },
      {
        path: 'users/create',
        name: 'admin-users-create',
        component: () => import('../pages/admin/users/create.vue'),
      },
      {
        path: 'users/:id/edit',
        name: 'admin-users-edit',
        component: () => import('../pages/admin/users/edit.vue'),
      },
      // Quản lý stories
      {
        path: 'stories',
        name: 'admin-stories',
        component: () => import('../pages/admin/stories/index.vue'),
      },
      {
        path: 'stories/create',
        name: 'admin-stories-create',
        component: () => import('../pages/admin/stories/create.vue'),
      },
      {
        path: 'stories/:id/edit',
        name: 'admin-stories-edit',
        component: () => import('../pages/admin/stories/edit.vue'),
      },
      // Quản lý settings
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../pages/admin/settings/index.vue'),
      },
    ],
  },
];
export default admin;
