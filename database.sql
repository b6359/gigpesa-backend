CREATE TABLE `gigpesac_gigpesa`.`tasks` (
  `id` VARCHAR(55) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(1500) NOT NULL,
  `offer_url` VARCHAR(1000) NULL DEFAULT NULL,
  `expiration_date` DATETIME NULL DEFAULT NULL,
  `country_codes` VARCHAR(55) NULL DEFAULT NULL,
  `default_payout` VARCHAR(55) NULL DEFAULT NULL,
  `category` VARCHAR(55) NULL DEFAULT NULL,
  `device_type` VARCHAR(55) NULL DEFAULT NULL,
  `status` VARCHAR(55) NULL DEFAULT NULL,
  `taskscol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `gigpesac_gigpesa`.`tasks` 
DROP COLUMN `taskscol`;

ALTER TABLE `gigpesac_gigpesa`.`tasks` 
ADD COLUMN `createdAt` DATETIME NULL DEFAULT NULL AFTER `id`,
ADD COLUMN `updatedAt` DATETIME NULL DEFAULT NULL AFTER `createdAt`,
CHANGE COLUMN `status` `status` VARCHAR(55) NULL DEFAULT NULL AFTER `offer_url`,
CHANGE COLUMN `id` `id` VARCHAR(55) NOT NULL AFTER `device_type`;


CREATE TABLE `gigpesac_gigpesa`.`task_submission` (
  `id` VARCHAR(55) NOT NULL,
  `user_id` VARCHAR(55) NOT NULL,
  `task_id` VARCHAR(55) NOT NULL,
  `proof` VARCHAR(1000) NULL DEFAULT NULL,
  `status` VARCHAR(255) NOT NULL,
  `earnings` VARCHAR(255) NULL DEFAULT NULL,
  `submitted_at` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `gigpesac_gigpesa`.`referrals` (
  `id` VARCHAR(55) NOT NULL,
  `referrer_id` VARCHAR(55) NOT NULL,
  `referred_user_id` VARCHAR(55) NOT NULL,
  `earning` VARCHAR(255) NOT NULL,
  `level` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `gigpesac_gigpesa`.`withdrawals` (
  `id` VARCHAR(55) NOT NULL,
  `user_id` VARCHAR(55) NOT NULL,
  `amount` DECIMAL(10,2) NULL DEFAULT 0.00,
  `method` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `requested_at` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `gigpesac_gigpesa`.`notifications` (
  `id` VARCHAR(55) NOT NULL,
  `user_id` VARCHAR(55) NOT NULL,
  `message` VARCHAR(1500) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `visibility` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `isRead` TINYINT(1) DEFAULT 0
  PRIMARY KEY (`id`));


ALTER TABLE `gigpesac_gigpesa`.`referrals` 
ADD INDEX `referrer_id_index` (`referrer_id` ASC) VISIBLE,
ADD INDEX `referred_user_id_index` (`referred_user_id` ASC) VISIBLE;
;

ALTER TABLE `gigpesac_gigpesa`.`task_submission` 
ADD COLUMN `device_type` VARCHAR(255) NULL DEFAULT NULL AFTER `updatedAt`;
