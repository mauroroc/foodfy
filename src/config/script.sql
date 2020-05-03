DROP DATABASE IF EXISTS "foodfy";
CREATE DATABASE "foodfy";

CREATE TABLE "files" (
    id serial PRIMARY KEY,
    name text NOT NULL,
    path text NOT NULL);

CREATE TABLE "chefs" (
	id serial PRIMARY KEY,
	name text NOT NULL,
    created_at timestamp(6) DEFAULT NOW(),
    file_id integer);

ALTER TABLE "chefs"
ADD CONSTRAINT "chefs_file_id_fkey" 
FOREIGN KEY ("file_id") REFERENCES "files" ("id");

CREATE TABLE "users" (
    id serial PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    reset_token text,
    reset_token_expires text,
    is_admin boolean,
    created_at timestamp(6) DEFAULT NOW(),
    updated_at timestamp(6) DEFAULT NOW()
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session"
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE "recipes" (
    id serial PRIMARY KEY,
    title text,
    ingredients text[],
    preparation text[],
    information text,
    chef_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp(6) DEFAULT NOW(),
    updated_at timestamp(6) DEFAULT NOW()
);

ALTER TABLE "recipes"
ADD CONSTRAINT "recipes_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "recipes"
ADD CONSTRAINT "recipes_chef_id_fkey" 
FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id") ON DELETE CASCADE;

CREATE TABLE "recipe_files" (
	id serial PRIMARY KEY,
	recipe_id integer,
    file_id integer);

ALTER TABLE "recipe_files"
ADD CONSTRAINT "recipe_files_recipe_id_fkey" 
FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;

ALTER TABLE "recipe_files"
ADD CONSTRAINT "recipe_files_file_id_fkey" 
FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;

CREATE FUNCTION updated_changed() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at := current_date;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_updated_changed
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE PROCEDURE updated_changed();