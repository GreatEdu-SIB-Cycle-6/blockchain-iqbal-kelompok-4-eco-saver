import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), nodePolyfills()],
//   define: {
//     "process.env": {},
//   },
// });

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return
      }
      warn(warning)
    }}
  },
  plugins: [react()],
  
});
