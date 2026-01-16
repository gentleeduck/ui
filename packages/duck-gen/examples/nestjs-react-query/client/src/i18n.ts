import type { DuckgenMessageDictionary } from '../../generated/duck-gen-messages'

export type AuthMessages = DuckgenMessageDictionary<'auth'>
export type AuthMessageKey = keyof AuthMessages
export type Locale = 'en' | 'es'

const en = {
  'auth.signin.success': 'Signed in successfully.',
  'auth.signin.invalid_credentials': 'Invalid username or password.',
  'auth.signin.locked': 'Account is locked.',
} satisfies AuthMessages

const es = {
  'auth.signin.success': 'Inicio de sesión exitoso.',
  'auth.signin.invalid_credentials': 'Usuario o contraseña inválidos.',
  'auth.signin.locked': 'La cuenta está bloqueada.',
} satisfies AuthMessages

const dictionaries: Record<Locale, AuthMessages> = {
  en,
  es,
}

export function t(locale: Locale, key: AuthMessageKey): string {
  return dictionaries[locale][key]
}
