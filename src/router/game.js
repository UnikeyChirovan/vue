const game = [
  {
    path: '/game',
    component: () => import('../pages/game/index.vue'), // Layout wrapper
    meta: { requiresAuth: true },
    children: [
      {
        path: '', // /game
        name: 'game-hub',
        component: () => import('../pages/game/GameHub.vue'),
        meta: {
          requiresAuth: true,
          title: 'Spirit Legends - Hub',
        },
      },
      {
        path: 'play',
        name: 'game-player',
        component: () => import('../pages/game/GamePlayer.vue'),
        meta: {
          requiresAuth: true,
          title: 'Spirit Legends - Chơi Game',
        },
      },
    ],
  },
];

export default game;
