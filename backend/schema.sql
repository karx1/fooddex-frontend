-- Fooddex Database Schema
-- This schema matches the dbdiagrams.io specification

-- Foods Table
CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY,
  rarity INTEGER NOT NULL,
  origin VARCHAR NOT NULL,
  foodname VARCHAR NOT NULL,
  description TEXT NOT NULL
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE
);

-- Captures Table
CREATE TABLE IF NOT EXISTS captures (
  id TEXT PRIMARY KEY,
  food TEXT NOT NULL,
  date DATETIME NOT NULL,
  user TEXT NOT NULL,
  FOREIGN KEY (food) REFERENCES foods(id) ON DELETE CASCADE,
  FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
);

-- Favorites Table (junction table)
CREATE TABLE IF NOT EXISTS favorites (
  user TEXT NOT NULL,
  food TEXT NOT NULL,
  PRIMARY KEY (user, food),
  FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (food) REFERENCES foods(id) ON DELETE CASCADE
);

-- Constellations Table
CREATE TABLE IF NOT EXISTS constellations (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL,
  FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
);

-- Constellation Items Table (junction table)
CREATE TABLE IF NOT EXISTS constellation_items (
  food TEXT NOT NULL,
  constellation TEXT NOT NULL,
  PRIMARY KEY (food, constellation),
  FOREIGN KEY (food) REFERENCES foods(id) ON DELETE CASCADE,
  FOREIGN KEY (constellation) REFERENCES constellations(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_captures_user ON captures(user);
CREATE INDEX IF NOT EXISTS idx_captures_food ON captures(food);
CREATE INDEX IF NOT EXISTS idx_captures_date ON captures(date);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user);
CREATE INDEX IF NOT EXISTS idx_favorites_food ON favorites(food);
CREATE INDEX IF NOT EXISTS idx_constellations_user ON constellations(user);
CREATE INDEX IF NOT EXISTS idx_constellation_items_constellation ON constellation_items(constellation);
CREATE INDEX IF NOT EXISTS idx_constellation_items_food ON constellation_items(food);
