import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  modules: ['@nuxt/content'],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpires: process.env.JWT_EXPIRES || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    alwaysSendEmails: process.env.ALWAYS_SEND_EMAILS || '',
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN || '',
    safeidClientId: process.env.SAFEID_CLIENT_ID || '',
    safeidClientSecret: process.env.SAFEID_CLIENT_SECRET || '',
    safeidRedirectUri: process.env.SAFEID_REDIRECT_URI || '',
    activationTokenSecret: process.env.JWT_SECRET || '',
    activationBaseUrl: process.env.ACTIVATION_BASE_URL || '',
    public: {
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  },

  css: ['~/assets/css/main.css'],

  alias: {
    '~prisma/client': fileURLToPath(new URL('./generated/prisma', import.meta.url))
  },

  ssr: false,

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap' }
      ]
    }
  },

  sourcemap: { server: true, client: true },

  vite: {
    build: { sourcemap: true }
  }
})