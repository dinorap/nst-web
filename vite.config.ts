import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Landing page for the FastST license server.
// `outDir` is set to ../static/landing so `vite build` writes directly into the
// folder that FastAPI mounts at "/" (see ../../main.py → FileResponse("static/landing/index.html"))
// and "/assets" (app.mount("/assets", StaticFiles(directory="static/landing/assets"))).
// `base: "./"` keeps hashed asset URLs in the built index.html relative, which is
// what FastAPI's /assets/... mount expects.
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    base: './',
    build: {
      outDir: path.resolve(__dirname, '../static/landing'),
      emptyOutDir: true,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});