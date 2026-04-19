declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      readonly PUBLIC_URL: string
      readonly MODE: 'development' | 'production'
      readonly CHAT_MODEL: 'gemini-2.0-flash-lite' | 'openrouter/auto'
      readonly GOOGLE_GENERATIVE_AI_API_KEY: string
      readonly OPENROUTER_API_KEY: string
      readonly V0_URL: string
      readonly V0_EDIT_SECRET: string
      readonly DEPLOYMENT_PROTECTION_BYPASS: 'true' | 'false'
    }
  }
}

export {}
