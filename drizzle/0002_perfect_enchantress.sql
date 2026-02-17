CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyProfileId` int,
	`auditId` int,
	`serviceType` enum('full_audit','description_rewrite','review_strategy','competitor_deep_dive','ad_campaign','seo_optimization','monitoring_annual','ai_agent_fix') NOT NULL,
	`serviceName` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`status` enum('in_cart','purchased','in_progress','completed') NOT NULL DEFAULT 'in_cart',
	`fixResults` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companyProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`industry` varchar(128) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` text,
	`logoKey` varchar(512),
	`website` varchar(512),
	`phone` varchar(32),
	`email` varchar(320),
	`address` text,
	`services` json,
	`targetAudience` text,
	`avgLeadValue` float DEFAULT 150,
	`growthGoal` varchar(64) DEFAULT 'Phone Leads',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companyProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `photoScores`;--> statement-breakpoint
ALTER TABLE `audits` ADD `companyProfileId` int;--> statement-breakpoint
ALTER TABLE `audits` ADD `latitude` float;--> statement-breakpoint
ALTER TABLE `audits` ADD `longitude` float;--> statement-breakpoint
ALTER TABLE `chatMessages` ADD `companyProfileId` int;--> statement-breakpoint
ALTER TABLE `reports` ADD `companyProfileId` int;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `companyName`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `companyIndustry`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `companyLocation`;