DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

/* GRANT ALL ON SCHEMA public TO postgres; */
/* GRANT ALL ON SCHEMA public TO public; */

CREATE TYPE guest_status AS ENUM (
    'confirmed',
    'checked-in',
    'checked-out',
    'forgotten'
);

CREATE TYPE reservation_state AS ENUM (
    'confirmed',
    'active',
    'past',
    'cancelled'
);

CREATE TABLE room_definition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR
);

CREATE TABLE guest (
    id SERIAL PRIMARY KEY,
    hotel_profile_id INTEGER,
    data_protection_profile_id INTEGER,
    encrypted_email BYTEA UNIQUE,
    webid VARCHAR(100) UNIQUE,
    status guest_status NOT NULL
);

CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    room_definition_id INTEGER NOT NULL,
    state reservation_state NOT NULL,
    date_from TIMESTAMP NOT NULL,
    date_to TIMESTAMP NOT NULL
);

CREATE TABLE profile_information (
    owner_id INTEGER NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    nationality VARCHAR(20) NOT NULL,
    id_document VARCHAR(20) NOT NULL,
    id_document_expiry DATE NOT NULL
);

CREATE TABLE hotel_profile (
    id SERIAL PRIMARY KEY
)
INHERITS (profile_information);

CREATE TABLE data_protection_profile (
    id SERIAL PRIMARY KEY,
    profile_expiry DATE NOT NULL
)
INHERITS (profile_information);

ALTER TABLE guest 
    ADD FOREIGN KEY (hotel_profile_id) REFERENCES hotel_profile (id),
    ADD FOREIGN KEY (data_protection_profile_id) REFERENCES data_protection_profile (id);

ALTER TABLE reservation 
    ADD FOREIGN KEY (owner_id) REFERENCES guest (id),
    ADD FOREIGN KEY (room_definition_id) REFERENCES room_definition (id);

ALTER TABLE profile_information 
    ADD FOREIGN KEY (owner_id) REFERENCES guest (id);