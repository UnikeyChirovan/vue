import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        inject: {
          inject: '<script>window.location.href = "/home";</script>',
        },
      },
    }),
  ],
  server: {
    port: 8080,
  },
});
