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
        path: 'stories/create/:lastIndex?',
        name: 'admin-stories-create',
        component: () => import('../pages/admin/stories/create.vue'),
      },
      {
        path: 'stories/:id/edit',
        name: 'admin-stories-edit',
        component: () => import('../pages/admin/stories/edit.vue'),
      },
      // Quản lý Background
      {
        path: 'images',
        name: 'admin-images',
        component: () => import('../pages/admin/images/index.vue'),
      },
      {
        path: 'images/create',
        name: 'admin-images-create',
        component: () => import('../pages/admin/images/create.vue'),
      },
      {
        path: 'images/:id/edit',
        name: 'admin-images-edit',
        component: () => import('../pages/admin/images/edit.vue'),
      },
      // Quản lý contacts
      {
        path: 'contacts',
        name: 'admin-contacts',
        component: () => import('../pages/admin/contacts/index.vue'),
      },
      {
        path: 'contacts/:id/reply',
        name: 'admin-contacts-reply',
        component: () => import('../pages/admin/contacts/reply.vue'),
      },
      // Quản lý blacklist
      {
        path: 'blacklists',
        name: 'admin-blacklists',
        component: () => import('../pages/admin/blacklists/index.vue'),
      },
      // {
      //   path: 'contacts/:id/reply',
      //   name: 'admin-contacts-reply',
      //   component: () => import('../pages/admin/contacts/reply.vue'),
      // },
      // Quản lý thông tin thiết bị
      {
        path: 'device-infos',
        name: 'admin-device-infos',
        component: () => import('../pages/admin/devices/index.vue'),
      },
      // {
      //   path: 'contacts/:id/reply',
      //   name: 'admin-contacts-reply',
      //   component: () => import('../pages/admin/contacts/reply.vue'),
      // },
      // Quản lý request log
      {
        path: 'requests',
        name: 'admin-requests',
        component: () => import('../pages/admin/requests/index.vue'),
      },
      // {
      //   path: 'contacts/:id/reply',
      //   name: 'admin-contacts-reply',
      //   component: () => import('../pages/admin/contacts/reply.vue'),
      // },
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
