BEGIN;

SET CONSTRAINTS ALL DEFERRED;

INSERT INTO room_definition (name, description) 
VALUES 
    ('5A', 'Queen-sized bed, ocean-view.'),
    ('78Q', 'Twin bed, equipped with a flat screen TV with international TV channels.'),
    ('209U', 'King-sized bed, spacious wardrobe. Own bathrooms with a bathtub.'),
    ('9R', 'Equipped with a shower, balcony overlooking the gardens. Room is air-conditioned.');

INSERT INTO guest (hotel_profile_id, data_protection_profile_id, encrypted_email, webid, status)
VALUES
    (NULL, NULL, bytea('john@smith.com'), 'https://john.example/profile#me', 'checked-out');

INSERT INTO reservation (owner_id, room_definition_id, state, date_from, date_to)
VALUES
    (1, 4, 'past', LOCALTIMESTAMP - interval '1 month 5 days', LOCALTIMESTAMP - interval '1 month 2 days');

INSERT INTO hotel_profile (owner_id, first_name, last_name, email, phone_number, nationality, id_document, id_document_expiry)
VALUES
    (1, 'John', 'Smith', 'john@smith.com', '+40123456789', 'English', 'ER 102 DJA', '2029-11-07');

INSERT INTO data_protection_profile (owner_id, first_name, last_name, email, phone_number, nationality, id_document, id_document_expiry, profile_expiry)
VALUES
    (1, 'John', 'Smith', 'john@smith.com', '+40123456789', 'English', 'ER 102 DJA', '2029-11-07', CURRENT_DATE + interval '4 years 11 months');

COMMIT;