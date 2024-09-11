const stories = [
  {
    path: '/stories',
    name: 'stories',
    component: () => import('../pages/stories/index.vue'),
    meta: { requiresAuth: true },
  },
];
export default stories;
