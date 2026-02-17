CREATE TABLE `audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`businessName` varchar(255) NOT NULL,
	`businessLocation` varchar(255) NOT NULL,
	`industry` varchar(128) NOT NULL,
	`placeId` varchar(255),
	`avgLeadValue` float DEFAULT 150,
	`growthGoal` varchar(64),
	`tier` enum('free','starter','professional','enterprise') NOT NULL DEFAULT 'free',
	`status` enum('pending','scanning','analyzing','complete','failed') NOT NULL DEFAULT 'pending',
	`overallScore` float,
	`aiVisibilityScore` float,
	`mapsPresenceScore` float,
	`reviewScore` float,
	`photoScore` float,
	`seoScore` float,
	`competitorGapScore` float,
	`estimatedMonthlyLoss` float,
	`businessData` json,
	`competitorData` json,
	`aiAnalysis` json,
	`recommendations` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`auditId` int,
	`role` enum('system','user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photoScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`auditId` int,
	`imageUrl` text NOT NULL,
	`overallScore` float,
	`clarityScore` float,
	`brandingScore` float,
	`atmosphereScore` float,
	`aiDiscoverabilityScore` float,
	`analysis` json,
	`suggestions` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photoScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`auditId` int NOT NULL,
	`reportType` enum('free_preview','full_audit','competitor_analysis','implementation_plan') NOT NULL DEFAULT 'free_preview',
	`pdfUrl` text,
	`reportData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scanResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`niche` varchar(128) NOT NULL,
	`territory` varchar(255) NOT NULL,
	`totalFound` int DEFAULT 0,
	`results` json,
	`status` enum('pending','scanning','complete','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scanResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','starter','professional','enterprise') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `companyName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `companyIndustry` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `companyLocation` varchar(255);