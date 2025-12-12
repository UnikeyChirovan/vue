const admin = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../layouts/admin.vue'),
    meta: { requiresAuth: true },
    children: [
      // Dashboard
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../pages/admin/index.vue'),
      },
      // Quản Lý NewsLetters
      {
        path: 'news',
        name: 'admin-news',
        component: () => import('../pages/admin/news/index.vue'),
      },
      {
        path: 'news/create',
        name: 'admin-news-create',
        component: () => import('../pages/admin/news/create.vue'),
      },
      {
        path: 'news/:id/edit',
        name: 'admin-news-edit',
        component: () => import('../pages/admin/news/edit.vue'),
      },
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
      // Quản Lý Gởi Mail Đăng Ký
      {
        path: 'infos',
        name: 'admin-infos',
        component: () => import('../pages/admin/infos/index.vue'),
      },
      {
        path: 'infos/create',
        name: 'admin-infos-create',
        component: () => import('../pages/admin/infos/create.vue'),
      },
      // Quản lý Email đã đăng ký
      {
        path: 'mails',
        name: 'admin-mails',
        component: () => import('../pages/admin/mails/index.vue'),
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
      // Quản lý contents
      {
        path: 'contents',
        name: 'admin-contents',
        component: () => import('../pages/admin/contents/index.vue'),
      },
      {
        path: 'contents/create/:lastIndex?',
        name: 'admin-contents-create',
        component: () => import('../pages/admin/contents/create.vue'),
      },
      {
        path: 'contents/:id/edit',
        name: 'admin-contents-edit',
        component: () => import('../pages/admin/contents/edit.vue'),
      },
      // Quản lý tên công ty
      {
        path: 'company',
        name: 'admin-company',
        component: () => import('../pages/admin/company/index.vue'),
      },
      {
        path: 'company/create/:lastIndex?',
        name: 'admin-company-create',
        component: () => import('../pages/admin/company/create.vue'),
      },
      {
        path: 'company/:id/edit',
        name: 'admin-company-edit',
        component: () => import('../pages/admin/company/edit.vue'),
      },

      // HeroSlide
      {
        path: 'hero-slide/create/:lastIndex?',
        name: 'admin-hero-slide-create',
        component: () => import('../pages/admin/company/heroSlide/create.vue'),
      },
      {
        path: 'hero-slide/:id/edit',
        name: 'admin-hero-slide-edit',
        component: () => import('../pages/admin/company/heroSlide/edit.vue'),
      },

      // FutureProject
      {
        path: 'future-project/create/:lastIndex?',
        name: 'admin-future-project-create',
        component: () =>
          import('../pages/admin/company/futureProject/create.vue'),
      },
      {
        path: 'future-project/:id/edit',
        name: 'admin-future-project-edit',
        component: () =>
          import('../pages/admin/company/futureProject/edit.vue'),
      },

      // Feature
      {
        path: 'feature/create/:lastIndex?',
        name: 'admin-feature-create',
        component: () => import('../pages/admin/company/feature/create.vue'),
      },
      {
        path: 'feature/:id/edit',
        name: 'admin-feature-edit',
        component: () => import('../pages/admin/company/feature/edit.vue'),
      },
      // Quản lý danh mục
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('../pages/admin/categories/index.vue'),
      },
      {
        path: 'categories/create/:lastIndex?',
        name: 'admin-categories-create',
        component: () => import('../pages/admin/categories/create.vue'),
      },
      {
        path: 'categories/:id/edit',
        name: 'admin-categories-edit',
        component: () => import('../pages/admin/categories/edit.vue'),
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
      // Quản lý hình ảnh
      {
        path: 'images-manager',
        name: 'admin-images-manager',
        component: () => import('../pages/admin/images-manager/index.vue'),
      },
      {
        path: 'images-manager/create',
        name: 'admin-images-manager-create',
        component: () => import('../pages/admin/images-manager/create.vue'),
      },
      {
        path: 'images-manager/:id/edit',
        name: 'admin-images-manager-edit',
        component: () => import('../pages/admin/images-manager/edit.vue'),
      },
      // Quản lý Video
      {
        path: 'videos',
        name: 'admin-videos',
        component: () => import('../pages/admin/videos/index.vue'),
      },
      {
        path: 'videos/create',
        name: 'admin-videos-create',
        component: () => import('../pages/admin/videos/create.vue'),
      },
      {
        path: 'videos/:id/edit',
        name: 'admin-videos-edit',
        component: () => import('../pages/admin/videos/edit.vue'),
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
      {
        path: 'support-statistics',
        name: 'admin-support-statistics',
        component: () => import('../pages/admin/support/SupportStatistics.vue'),
      },
    ],
  },
];
export default admin;
