import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',                  // Allows access from external servers
    port: parseInt(process.env.PORT) || 5173  // Uses env PORT or defaults to 5173
  }
});
