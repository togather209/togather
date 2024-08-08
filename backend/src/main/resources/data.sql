INSERT INTO member (email, password, nickname, name, profile_img, type)
VALUES ('user1@example.com', '$2a$10$MuuqnYmMS9RilaCk7uPrWOzZ1lER3giYR2T2ZQxOAlqrOEWjmUVVC', 'user1', 'User One', 'https://trip-bucket-0515.s3.ap-northeast-2.amazonaws.com/|3f79a057-07ea-4bb0-86c0-aee64316c508.jpg',
        0),
       ('user2@example.com', '$2a$10$MuuqnYmMS9RilaCk7uPrWOzZ1lER3giYR2T2ZQxOAlqrOEWjmUVVC', 'user2', 'User Two', 'https://trip-bucket-0515.s3.ap-northeast-2.amazonaws.com/|3f79a057-07ea-4bb0-86c0-aee64316c508.jpg',
        0),
       ('user3@example.com', '$2a$10$MuuqnYmMS9RilaCk7uPrWOzZ1lER3giYR2T2ZQxOAlqrOEWjmUVVC', 'user3', 'User Three',
        NULL, 0);

INSERT INTO team (code, title, description, team_img)
VALUES ('TEAM_A', 'Description for Team A', 'Description for Team A', NULL),
       ('TEAM_B', 'Description for Team B', 'Description for Team B', NULL);


INSERT INTO plan (team_id, member_id, title, description, start_date, end_date, status)
VALUES (1, 1, 'Plan A', 'Description for Plan A', '2024-08-01 10:00:00', '2024-08-02 10:00:00', 1),
       (1, 2, 'Plan B', 'Description for Plan B', '2024-08-02 11:00:00', '2024-08-03 11:00:00', 0);

INSERT INTO receipt (plan_id, member_id, bookmark_id, business_name, payment_date, total_price, color)
VALUES (1, 1, NULL, 'Business A', '2024-08-01 10:00:00', 10000, 0),
       (2, 2, NULL, 'Business B', '2024-08-02 11:00:00', 15000, 1);

INSERT INTO item (receipt_id, name, unit_price, count)
VALUES (1, 'Item A', 5000, 2),
       (1, 'Item B', 3000, 1),
       (2, 'Item C', 7000, 2),
       (2, 'Item D', 6000, 1);

INSERT INTO item_member (item_id, member_id)
VALUES (1, 1), -- User 1 is associated with Item A
       (1, 2), -- User 2 is associated with Item A
       (2, 1), -- User 1 is associated with Item B
       (3, 2), -- User 2 is associated with Item C
       (3, 3), -- User 3 is associated with Item C
       (4, 2); -- User 2 is associated with Item D

INSERT INTO bookmark (plan_id, place_id, place_img, place_name, place_addr, date, item_order)
VALUES (1, 1, 'null', 'Place A', 'Address A', '2024-08-01', 1),
       (1, 2, 'null', 'Place B', 'Address B', '2024-08-02', 2),
       (1, 3, 'null', 'Place C', 'Address C', '2024-08-01', 2);

INSERT INTO team_member (member_id, team_id, role)
VALUES (1, 1, 1), -- User 1 is a member of Team A with role 1
       (2, 1, 2), -- User 2 is a member of Team A with role 2
       (3, 2, 1); -- User 3 is a member of Team B with role 1