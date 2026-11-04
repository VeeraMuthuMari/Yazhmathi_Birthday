import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { templateCompilerOptions } from "@tresjs/core";
import tailwindcss from "@tailwindcss/vite";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue({ ...templateCompilerOptions }), tailwindcss(), vueDevTools()],
  server: {
    host: "0.0.0.0",
    port: 8888,
    strictPort: true,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three";
          if (id.includes("/node_modules/@tresjs/")) return "tres-core";
          if (id.includes("/node_modules/@vueuse/core/")) return "vueuse-core";
        },
      },
    },
  },
});
