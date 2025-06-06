import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ArcoResolver,
  ElementPlusResolver,
} from "unplugin-vue-components/resolvers";
import { vitePluginForArco } from "@arco-plugins/vite-vue";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver(), ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
        ElementPlusResolver(),
      ],
    }),
    vitePluginForArco({
      style: "css",
    }),
    compression({ algorithm: "gzip", deleteOriginFile: false }),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
  base: process.env.NODE_ENV === "production" ? "/common-tools/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        404: resolve(__dirname, "404.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
