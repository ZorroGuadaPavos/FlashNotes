import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'



// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(),react(), tsconfigPaths(), svgr()],
})

