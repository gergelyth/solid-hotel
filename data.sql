BEGIN;

SET CONSTRAINTS ALL DEFERRED;

INSERT INTO room_definition (name, description) 
VALUES 
    ('5A', 'Queen-sized bed, ocean-view.'),
    ('78Q', 'Twin bed, equipped with a flat screen TV with international TV channels.'),
    ('209U', 'King-sized bed, spacious wardrobe. Own bathrooms with a bathtub.'),
    ('9R', 'Equipped with a shower, balcony overlooking the gardens. Room is air-conditioned.'),
    ('23A', NULL);

INSERT INTO guest (hotel_profile_id, data_protection_profile_id, encrypted_email, webid, status)
VALUES
    (NULL, NULL, bytea('alice@jackson.com'), 'https://alice.example/profile#me', 'confirmed'),
    (NULL, NULL, bytea('sarah@johnson.com'), 'https://sarah.example/profile#me', 'confirmed'),
    (1, 1, NULL, NULL, 'checked-in'),
    -- question if they should have status confirmed or checked-in since they are both
    (2, NULL, NULL, NULL, 'checked-in'),
    -- email and WebID not anonymized because they have a confirmed reservation as well
    -- also if they should be confirmed or checked-out
    (NULL, 2, bytea('john@smith.com'), 'https://john.example/profile#me', 'checked-out'),
    (NULL, 3, NULL, NULL, 'checked-out'),
    (NULL, NULL, NULL, NULL, 'forgotten');

INSERT INTO reservation (owner_id, room_definition_id, state, date_from, date_to)
VALUES
    (1, 2, 'confirmed', LOCALTIMESTAMP + interval '1 month', LOCALTIMESTAMP + interval '1 month 2 days'),
    (5, 2, 'confirmed', LOCALTIMESTAMP + interval '2 month 22 days', LOCALTIMESTAMP + interval '2 month 25 days'),
    (2, 3, 'confirmed', LOCALTIMESTAMP + interval '1 month 12 days', LOCALTIMESTAMP + interval '1 month 17 days'),
    (4, 5, 'confirmed', LOCALTIMESTAMP + interval '5 months', LOCALTIMESTAMP + interval '5 months 7 days'),
    (1, 1, 'cancelled', LOCALTIMESTAMP + interval '2 month 5 days', LOCALTIMESTAMP + interval '2 month 15 days'),
    (3, 4, 'cancelled', LOCALTIMESTAMP - interval '3 days', LOCALTIMESTAMP + interval '3 days'),
    (7, 2, 'cancelled', LOCALTIMESTAMP - interval '3 month 5 days', LOCALTIMESTAMP - interval '3 month 2 days'),
    (3, 1, 'active', LOCALTIMESTAMP - interval '2 days', LOCALTIMESTAMP + interval '3 days'),
    (4, 4, 'active', LOCALTIMESTAMP - interval '6 days', LOCALTIMESTAMP + interval '4 days'),
    (5, 3, 'past', LOCALTIMESTAMP - interval '1 month 5 days', LOCALTIMESTAMP - interval '1 month 2 days'),
    (6, 1, 'past', LOCALTIMESTAMP - interval '15 days', LOCALTIMESTAMP - interval '11 days'),
    (3, 4, 'past', LOCALTIMESTAMP - interval '3 years 1 month', LOCALTIMESTAMP - interval '3 years 15 days'),
    (7, 2, 'past', LOCALTIMESTAMP - interval '5 years 1 month', LOCALTIMESTAMP - interval '5 years 23 days');

INSERT INTO hotel_profile (owner_id, first_name, last_name, email, phone_number, nationality, id_document, id_document_expiry)
VALUES
    (3, 'Bob', 'Ford', 'bob@ford.com', '+40111222333', 'English', 'AA 784 GOE', '2027-10-17'),
    (4, 'Mark', 'Williams', 'mark@williams.com', '+40222333444', 'Spanish', 'BB 939 OAL', '2028-03-11');

INSERT INTO data_protection_profile (owner_id, first_name, last_name, email, phone_number, nationality, id_document, id_document_expiry, profile_expiry)
VALUES
    (3, 'Bob', 'Ford', 'bob@ford.com', '+40111222333', 'English', 'AA 784 GOE', '2027-10-17', CURRENT_DATE + interval '2 years'),
    (5, 'John', 'Smith', 'john@smith.com', '+40123456789', 'English', 'ER 102 DJA', '2029-11-07', CURRENT_DATE + interval '4 years 11 months'),
    (6, 'Jessica', 'Brown', 'jessica@brown.com', '+40333444555', 'Danish', 'CC 293 PAK', '2030-01-24', CURRENT_DATE + interval '4 years 11 months 15 days');

COMMIT;