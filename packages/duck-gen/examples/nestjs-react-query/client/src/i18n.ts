import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { DuckgenMessageDictionary } from '../../generated/duck-gen-messages'

export type AuthMessages = DuckgenMessageDictionary<'auth'>
export type AuthMessageKey = keyof AuthMessages
export type Locale = 'en' | 'es'

const en: AuthMessages = {
  AUTH_SIGNIN_SUCCESS: 'Signed in successfully.',
  AUTH_SIGNIN_INVALID_CREDENTIALS: 'Invalid username or password.',
  AUTH_SIGNIN_LOCKED: 'Account is locked.',
}

const es: AuthMessages = {
  AUTH_SIGNIN_SUCCESS: 'Inicio de sesion exitoso.',
  AUTH_SIGNIN_INVALID_CREDENTIALS: 'Usuario o contrasena invalida.',
  AUTH_SIGNIN_LOCKED: 'La cuenta esta bloqueada.',
}

const resources = {
  en: { auth: en },
  es: { auth: es },
} satisfies Record<Locale, { auth: AuthMessages }>

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  ns: ['auth'],
  defaultNS: 'auth',
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
