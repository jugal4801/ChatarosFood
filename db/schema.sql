CREATE TABLE IF NOT EXISTS orders (
  id                 BIGSERIAL PRIMARY KEY,
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','paid','collected','cancelled','expired')),
  customer_name      TEXT NOT NULL,
  mobile             TEXT NOT NULL,
  email              TEXT NOT NULL,
  notes              TEXT,
  collection_date    DATE NOT NULL,
  collection_time    TEXT NOT NULL,
  total_pence        INTEGER NOT NULL,
  currency           TEXT NOT NULL DEFAULT 'gbp',
  stripe_session_id  TEXT UNIQUE,
  stripe_payment_intent TEXT,
  paid_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  unit_pence  INTEGER NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS stripe_events (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_collection_idx ON orders(collection_date);
