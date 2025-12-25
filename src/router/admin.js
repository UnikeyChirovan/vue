const admin = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../layouts/admin.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      // Dashboard
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../pages/admin/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản Lý NewsLetters
      {
        path: 'news',
        name: 'admin-news',
        component: () => import('../pages/admin/news/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'news/create',
        name: 'admin-news-create',
        component: () => import('../pages/admin/news/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'news/:id/edit',
        name: 'admin-news-edit',
        component: () => import('../pages/admin/news/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản Lý Users
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../pages/admin/users/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'users/create',
        name: 'admin-users-create',
        component: () => import('../pages/admin/users/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'users/:id/edit',
        name: 'admin-users-edit',
        component: () => import('../pages/admin/users/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản Lý Gởi Mail Đăng Ký
      {
        path: 'infos',
        name: 'admin-infos',
        component: () => import('../pages/admin/infos/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'infos/create',
        name: 'admin-infos-create',
        component: () => import('../pages/admin/infos/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý Email đã đăng ký
      {
        path: 'mails',
        name: 'admin-mails',
        component: () => import('../pages/admin/mails/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý stories
      {
        path: 'stories',
        name: 'admin-stories',
        component: () => import('../pages/admin/stories/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'stories/create/:lastIndex?',
        name: 'admin-stories-create',
        component: () => import('../pages/admin/stories/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'stories/:id/edit',
        name: 'admin-stories-edit',
        component: () => import('../pages/admin/stories/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý contents
      {
        path: 'contents',
        name: 'admin-contents',
        component: () => import('../pages/admin/contents/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'contents/create/:lastIndex?',
        name: 'admin-contents-create',
        component: () => import('../pages/admin/contents/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'contents/:id/edit',
        name: 'admin-contents-edit',
        component: () => import('../pages/admin/contents/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý tên công ty
      {
        path: 'company',
        name: 'admin-company',
        component: () => import('../pages/admin/company/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'company/create/:lastIndex?',
        name: 'admin-company-create',
        component: () => import('../pages/admin/company/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'company/:id/edit',
        name: 'admin-company-edit',
        component: () => import('../pages/admin/company/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // HeroSlide
      {
        path: 'hero-slide/create/:lastIndex?',
        name: 'admin-hero-slide-create',
        component: () => import('../pages/admin/company/heroSlide/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'hero-slide/:id/edit',
        name: 'admin-hero-slide-edit',
        component: () => import('../pages/admin/company/heroSlide/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // FutureProject
      {
        path: 'future-project/create/:lastIndex?',
        name: 'admin-future-project-create',
        component: () =>
          import('../pages/admin/company/futureProject/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'future-project/:id/edit',
        name: 'admin-future-project-edit',
        component: () =>
          import('../pages/admin/company/futureProject/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Feature
      {
        path: 'feature/create/:lastIndex?',
        name: 'admin-feature-create',
        component: () => import('../pages/admin/company/feature/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'feature/:id/edit',
        name: 'admin-feature-edit',
        component: () => import('../pages/admin/company/feature/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý danh mục
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('../pages/admin/categories/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'categories/create/:lastIndex?',
        name: 'admin-categories-create',
        component: () => import('../pages/admin/categories/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'categories/:id/edit',
        name: 'admin-categories-edit',
        component: () => import('../pages/admin/categories/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý Background
      {
        path: 'images',
        name: 'admin-images',
        component: () => import('../pages/admin/images/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'images/create',
        name: 'admin-images-create',
        component: () => import('../pages/admin/images/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'images/:id/edit',
        name: 'admin-images-edit',
        component: () => import('../pages/admin/images/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý hình ảnh
      {
        path: 'images-manager',
        name: 'admin-images-manager',
        component: () => import('../pages/admin/images-manager/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'images-manager/create',
        name: 'admin-images-manager-create',
        component: () => import('../pages/admin/images-manager/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'images-manager/:id/edit',
        name: 'admin-images-manager-edit',
        component: () => import('../pages/admin/images-manager/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý Video
      {
        path: 'videos',
        name: 'admin-videos',
        component: () => import('../pages/admin/videos/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'videos/create',
        name: 'admin-videos-create',
        component: () => import('../pages/admin/videos/create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'videos/:id/edit',
        name: 'admin-videos-edit',
        component: () => import('../pages/admin/videos/edit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý contacts
      {
        path: 'contacts',
        name: 'admin-contacts',
        component: () => import('../pages/admin/contacts/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'contacts/:id/reply',
        name: 'admin-contacts-reply',
        component: () => import('../pages/admin/contacts/reply.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý blacklist
      {
        path: 'blacklists',
        name: 'admin-blacklists',
        component: () => import('../pages/admin/blacklists/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý thông tin thiết bị
      {
        path: 'device-infos',
        name: 'admin-device-infos',
        component: () => import('../pages/admin/devices/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý request log
      {
        path: 'requests',
        name: 'admin-requests',
        component: () => import('../pages/admin/requests/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // Quản lý settings
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../pages/admin/settings/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'support-statistics',
        name: 'admin-support-statistics',
        component: () => import('../pages/admin/support/SupportStatistics.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'music-albums',
        name: 'admin-music-albums',
        component: () => import('../pages/admin/music-albums/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },

      // Quản lý Music Tracks
      {
        path: 'music-tracks',
        name: 'admin-music-tracks',
        component: () => import('../pages/admin/music-tracks/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
];

export default admin;
