CREATE TYPE user_role AS ENUM ('USER','ADMIN');
CREATE TYPE skill_type AS ENUM ('OFFERED','WANTED');
CREATE TYPE request_status AS ENUM ('PENDING','ACCEPTED','REJECTED');
CREATE TYPE exchange_status AS ENUM ('ACTIVE','COMPLETED','CANCELLED');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  type skill_type NOT NULL,
  UNIQUE(user_id, skill_id, type)
);

CREATE TABLE exchange_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_skill_id TEXT NOT NULL REFERENCES skills(id),
  wanted_skill_id TEXT NOT NULL REFERENCES skills(id),
  status request_status NOT NULL DEFAULT 'PENDING',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exchanges (
  id TEXT PRIMARY KEY,
  request_id TEXT UNIQUE NOT NULL REFERENCES exchange_requests(id),
  user_a_id TEXT NOT NULL REFERENCES users(id),
  user_b_id TEXT NOT NULL REFERENCES users(id),
  offered_skill_id TEXT NOT NULL REFERENCES skills(id),
  wanted_skill_id TEXT NOT NULL REFERENCES skills(id),
  status exchange_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  exchange_id TEXT NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exchange_id, reviewer_id)
);