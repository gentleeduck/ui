import { pgEnum } from 'drizzle-orm/pg-core'

export const MEMBERSHIP_STATUS_VALUES = ['active', 'invited', 'suspended'] as const
export const ROLE_SCOPE_VALUES = ['tenant', 'system'] as const
export const SESSION_STATUS_VALUES = ['active', 'revoked', 'rotated', 'expired'] as const
export const INVITE_STATUS_VALUES = ['pending', 'accepted', 'revoked', 'expired'] as const
export const TOKEN_PURPOSE_VALUES = ['email_verify', 'password_reset', 'login_otp', 'mfa_challenge'] as const
export const TOKEN_STATUS_VALUES = ['active', 'revoked', 'expired', 'rotated', 'used'] as const
export const IDENTITY_PROVIDER_VALUES = ['password', 'google', 'github', 'email_otp'] as const
export const AUDIT_ACTOR_TYPE_VALUES = ['user', 'api_key', 'system'] as const
export const API_KEY_KIND_VALUES = ['public', 'secret'] as const
export const API_KEY_SCOPE_VALUES = ['anon', 'server', 'admin'] as const
export const FILE_STATUS_VALUES = ['pending', 'uploaded', 'committed', 'quarantined', 'deleted'] as const
export const FILE_PURPOSE_VALUES = ['avatar', 'doc'] as const
export const FILE_UPLOAD_KIND_POST = ['post', 'multipart', 'put'] as const

export const fileStatus = pgEnum('file_status', FILE_STATUS_VALUES)
export const filePurpose = pgEnum('file_purpose', FILE_PURPOSE_VALUES)
export const membershipStatus = pgEnum('membership_status', MEMBERSHIP_STATUS_VALUES)
export const roleScope = pgEnum('role_scope', ROLE_SCOPE_VALUES)
export const sessionStatus = pgEnum('session_status', SESSION_STATUS_VALUES)
export const inviteStatus = pgEnum('invite_status', INVITE_STATUS_VALUES)
export const tokenPurpose = pgEnum('token_purpose', TOKEN_PURPOSE_VALUES)
export const tokenStatus = pgEnum('token_status', TOKEN_STATUS_VALUES)
export const identityProvider = pgEnum('identity_provider', IDENTITY_PROVIDER_VALUES)
export const auditActorType = pgEnum('audit_actor_type', AUDIT_ACTOR_TYPE_VALUES)
export const apiKeyKind = pgEnum('api_key_kind', API_KEY_KIND_VALUES)
export const apiKeyScope = pgEnum('api_key_scope', API_KEY_SCOPE_VALUES)
export const fileUploadKind = pgEnum('file_upload_kind', FILE_UPLOAD_KIND_POST)
