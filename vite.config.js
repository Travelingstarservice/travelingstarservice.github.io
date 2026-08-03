import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        services: 'services.html',
        aiStudio: 'ai-studio.html',
        payments: 'payments.html',
        admin: 'admin.html',
        adminLogin: 'admin-login.html',
        contact: 'contact.html'
      }
    }
  }
})
