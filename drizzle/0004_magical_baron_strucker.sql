ALTER TABLE `users` DROP INDEX `users_openId_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `firebaseUid` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_firebaseUid_unique` UNIQUE(`firebaseUid`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `openId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;