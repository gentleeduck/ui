type TestSQL1 = `
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_email CHECK (email LIKE '%@%'),
  CONSTRAINT fk_profile
    FOREIGN KEY (id)
    REFERENCES public.profiles (user_id)
    ON DELETE CASCADE
);
`

interface users {
  id: string // UUID
  email: string // VARCHAR
  password_hash: string
  created_at: string // ISO timestamp
  is_active: boolean
}
