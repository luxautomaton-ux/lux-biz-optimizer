CREATE TABLE `partnerCommissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` int NOT NULL,
	`referralId` int,
	`referredUserId` int,
	`period` varchar(7) NOT NULL,
	`grossRevenue` float NOT NULL DEFAULT 0,
	`commissionRate` float NOT NULL,
	`commissionAmount` float NOT NULL DEFAULT 0,
	`description` text,
	`status` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partnerCommissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerPayouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` int NOT NULL,
	`amount` float NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'usd',
	`stripePayoutId` varchar(255),
	`stripeTransferId` varchar(255),
	`periodStart` varchar(7) NOT NULL,
	`periodEnd` varchar(7) NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`failureReason` text,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partnerPayouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerReferrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`referralCode` varchar(64) NOT NULL,
	`revenueShareExpiresAt` timestamp NOT NULL,
	`totalRevenue` float NOT NULL DEFAULT 0,
	`totalCommission` float NOT NULL DEFAULT 0,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerReferrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`phone` varchar(32),
	`website` varchar(512),
	`logoUrl` text,
	`description` text,
	`industry` varchar(128),
	`commissionRate` float NOT NULL DEFAULT 20,
	`revenueShareMonths` int NOT NULL DEFAULT 12,
	`stripeAccountId` varchar(255),
	`stripeOnboarded` int NOT NULL DEFAULT 0,
	`status` enum('pending','approved','active','suspended','rejected') NOT NULL DEFAULT 'pending',
	`totalEarnings` float NOT NULL DEFAULT 0,
	`totalPaidOut` float NOT NULL DEFAULT 0,
	`totalCustomers` int NOT NULL DEFAULT 0,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
