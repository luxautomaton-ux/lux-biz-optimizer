CREATE TABLE `accountDeletionRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reason` text,
	`status` enum('pending','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
	`scheduledDeletionAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accountDeletionRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agentActivityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyProfileId` int,
	`auditId` int,
	`actionType` enum('audit_generated','description_rewrite','seo_optimization','review_strategy','competitor_analysis','error_detected','auto_fix_applied','auto_fix_failed','ticket_responded','ticket_escalated','report_generated','scan_completed','lead_analysis','api_health_check','profile_optimization') NOT NULL,
	`toolUsed` varchar(128),
	`status` enum('started','in_progress','completed','failed') NOT NULL DEFAULT 'started',
	`details` json,
	`errorMessage` text,
	`durationMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agentActivityLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('billing','technical','audit_issue','account','feature_request','other') NOT NULL DEFAULT 'other',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','waiting_user','escalated','resolved','closed') NOT NULL DEFAULT 'open',
	`assignedTo` enum('ai_agent','admin') NOT NULL DEFAULT 'ai_agent',
	`escalatedAt` timestamp,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticketMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`senderId` int,
	`senderType` enum('user','ai_agent','admin') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticketMessages_id` PRIMARY KEY(`id`)
);
