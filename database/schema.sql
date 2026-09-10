CREATE TYPE user_role AS ENUM (
  'USER',
  'ADMIN'
);

CREATE TYPE skill_type AS ENUM (
  'OFFERED',
  'WANTED'
);

CREATE TYPE request_status AS ENUM (
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED'
);

CREATE TYPE exchange_status AS ENUM (
  'ACTIVE',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE proficiency AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(80) NOT NULL,
  avatar_url TEXT,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ(6)
);

CREATE TABLE password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ(6) NOT NULL,
  used_at TIMESTAMPTZ(6),
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX password_reset_tokens_user_id_idx
  ON password_reset_tokens(user_id);

CREATE INDEX password_reset_tokens_expires_at_idx
  ON password_reset_tokens(expires_at);

CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  description TEXT
);

CREATE TABLE user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  type skill_type NOT NULL,
  proficiency proficiency NOT NULL,

  UNIQUE(user_id, skill_id, type, proficiency)
);

CREATE TABLE exchange_requests (
  id TEXT PRIMARY KEY,

  sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  receiver_id TEXT REFERENCES users(id) ON DELETE SET NULL,

  sender_username TEXT NOT NULL,
  receiver_username TEXT NOT NULL,

  sender_skill_id TEXT REFERENCES skills(id) ON DELETE SET NULL,
  sender_skill_name TEXT NOT NULL,
  sender_proficiency proficiency NOT NULL,

  receiver_skill_id TEXT REFERENCES skills(id) ON DELETE SET NULL,
  receiver_skill_name TEXT NOT NULL,
  receiver_proficiency proficiency NOT NULL,

  status request_status NOT NULL DEFAULT 'PENDING',

  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX exchange_requests_sender_id_idx
  ON exchange_requests(sender_id);

CREATE INDEX exchange_requests_receiver_id_idx
  ON exchange_requests(receiver_id);

CREATE INDEX exchange_requests_status_idx
  ON exchange_requests(status);

CREATE TABLE exchanges (
  id TEXT PRIMARY KEY,

  request_id TEXT UNIQUE NOT NULL
    REFERENCES exchange_requests(id) ON DELETE NO ACTION,

  user_a_id TEXT NOT NULL
    REFERENCES users(id) ON DELETE NO ACTION,

  user_b_id TEXT NOT NULL
    REFERENCES users(id) ON DELETE NO ACTION,

  skill_a_id TEXT NOT NULL
    REFERENCES skills(id) ON DELETE NO ACTION,

  skill_b_id TEXT NOT NULL
    REFERENCES skills(id) ON DELETE NO ACTION,

  status exchange_status NOT NULL DEFAULT 'ACTIVE',

  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ(6)
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,

  exchange_id TEXT NOT NULL
    REFERENCES exchanges(id) ON DELETE CASCADE,

  sender_id TEXT NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,

  content TEXT NOT NULL,

  read_at TIMESTAMPTZ(6),

  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_exchange_id_idx
  ON messages(exchange_id);

CREATE INDEX messages_sender_id_idx
  ON messages(sender_id);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY,

  exchange_id TEXT NOT NULL
    REFERENCES exchanges(id) ON DELETE CASCADE,

  reviewer_id TEXT NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,

  reviewee_id TEXT NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL
    CHECK (rating BETWEEN 1 AND 5),

  comment TEXT,

  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

  UNIQUE(exchange_id, reviewer_id)
);