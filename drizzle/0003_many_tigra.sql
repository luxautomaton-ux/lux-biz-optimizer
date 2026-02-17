ALTER TABLE `audits` ADD `chatgptScore` float;--> statement-breakpoint
ALTER TABLE `audits` ADD `geminiScore` float;--> statement-breakpoint
ALTER TABLE `audits` ADD `perplexityScore` float;--> statement-breakpoint
ALTER TABLE `audits` ADD `chatgptIssues` json;--> statement-breakpoint
ALTER TABLE `audits` ADD `geminiIssues` json;--> statement-breakpoint
ALTER TABLE `audits` ADD `perplexityIssues` json;--> statement-breakpoint
ALTER TABLE `audits` ADD `moneyLeaks` json;--> statement-breakpoint
ALTER TABLE `scanResults` ADD `companyProfileId` int;