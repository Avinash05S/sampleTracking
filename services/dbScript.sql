-- -- use sample_tracking;
-- -- CREATE TABLE User (
-- --     id CHAR(36) PRIMARY KEY,
-- --     name VARCHAR(255) NOT NULL,
-- --     password VARCHAR(255) NOT NULL,
-- --     email VARCHAR(255) NOT NULL,
-- --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- --     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- -- );
-- -- CREATE TABLE Tracking (
-- --     tracking_id CHAR(36) PRIMARY KEY,
-- --     title VARCHAR(255) NOT NULL,
-- --     description VARCHAR(255) NULL,
-- --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- --     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- -- );
-- -- CREATE TABLE node (
-- --     node_id CHAR(36) PRIMARY KEY,
-- --     title VARCHAR(255) NOT NULL,
-- --     default_id BIT DEFAULT 0,
-- --     tracking_id CHAR(36) NOT NULL,
-- --     incharge_id CHAR(36) NOT NULL,
-- --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- --     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- --     FOREIGN KEY (tracking_id)
-- --         REFERENCES Tracking (tracking_id) ON DELETE CASCADE,
-- --     FOREIGN KEY (incharge_id)
-- --         REFERENCES User (user_id) ON DELETE CASCADE
-- -- );
-- -- CREATE TABLE form_data (
-- --     form_id CHAR(36) PRIMARY KEY,
-- --     label VARCHAR(100) NOT NULL,
-- --     data_type VARCHAR(100) NOT NULL,
-- --     lookup_id CHAR(36) NOT NULL,
-- --     node_id CHAR(36) NOT NULL,
-- --     required BOOLEAN NOT NULL DEFAULT FALSE,
-- --     is_form BOOLEAN NOT NULL DEFAULT FALSE,
-- --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- --     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- --     FOREIGN KEY (node_id)
-- --         REFERENCES node (node_id)
-- --         ON DELETE CASCADE
-- -- );
-- -- CREATE TABLE connections (
-- --     connection_id CHAR(36) PRIMARY KEY,
-- --     tracking_id CHAR(36) NOT NULL,
-- --     source_node CHAR(36) NOT NULL,
-- --     target_node CHAR(36) NOT NULL,
-- --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- --     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- --     FOREIGN KEY (source_node)
-- --         REFERENCES node (node_id)
-- --         ON DELETE CASCADE,
-- --     FOREIGN KEY (target_node)
-- --         REFERENCES node (node_id)
-- --         ON DELETE CASCADE
-- -- );	
-- -- Alter table connections add column tracking_id char(36) not null after connection_id;
-- -- SHOW TABLES;
-- -- select * from tracking;
-- -- insert into user (user_id, name, password,email) values ('3314594a-d7ea-4ebb-b0c7-a0c03b59a3ae','Deepak','12345678','deepak@gmail.com');
-- -- insert into user (user_id, name, password,email) values ('67f83cbd-7287-40fd-9062-e123fd39903f','Kumar','kumar123','kumar@gmail.com');
-- alter table node change is_default default_id char(36) not null;

CREATE TABLE
    `user` (
        `user_id` char(36) NOT NULL,
        `name` varchar(255) NOT NULL,
        `password` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`user_id`)
    );

CREATE TABLE
    `tracking` (
        `tracking_id` char(36) NOT NULL,
        `title` varchar(255) NOT NULL,
        `description` varchar(255) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`tracking_id`)
    );

CREATE TABLE
    `node` (
        `node_id` char(36) NOT NULL,
        `title` varchar(255) NOT NULL,
        `default_id` char(36) DEFAULT NULL,
        `input_id` char(36) DEFAULT NULL,
        `tracking_id` char(36) NOT NULL,
        `incharge_id` char(36) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`node_id`),
        KEY `tracking_id` (`tracking_id`),
        KEY `incharge_id` (`incharge_id`),
        CONSTRAINT `node_ibfk_1` FOREIGN KEY (`tracking_id`) REFERENCES `tracking` (`tracking_id`),
        CONSTRAINT `node_ibfk_2` FOREIGN KEY (`incharge_id`) REFERENCES `user` (`user_id`)
    );

CREATE TABLE
    `form_data` (
        `form_id` char(36) NOT NULL,
        `label` varchar(100) NOT NULL,
        `data_type` varchar(100) NOT NULL,
        `lookup_id` char(36) DEFAULT NULL,
        `node_id` char(36) NOT NULL,
        `required` tinyint (1) NOT NULL DEFAULT '0',
        `is_form` tinyint (1) NOT NULL DEFAULT '0',
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`form_id`),
        KEY `node_id` (`node_id`),
        CONSTRAINT `form_data_ibfk_1` FOREIGN KEY (`node_id`) REFERENCES `node` (`node_id`) ON DELETE CASCADE
    );

CREATE TABLE
    `connections` (
        `connection_id` char(36) NOT NULL,
        `tracking_id` char(36) NOT NULL,
        `source_node` char(36) NOT NULL,
        `target_node` char(36) NOT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`connection_id`),
        KEY `source_node` (`source_node`),
        KEY `target_node` (`target_node`),
        CONSTRAINT `connections_ibfk_1` FOREIGN KEY (`source_node`) REFERENCES `node` (`node_id`) ON DELETE CASCADE,
        CONSTRAINT `connections_ibfk_2` FOREIGN KEY (`target_node`) REFERENCES `node` (`node_id`) ON DELETE CASCADE
    );