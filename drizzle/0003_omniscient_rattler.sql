CREATE TABLE `press_clippings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`source` varchar(128) NOT NULL,
	`author` varchar(128),
	`date` varchar(32),
	`excerpt` text,
	`fullText` text,
	`url` text,
	`imageUrl` text,
	`phaseId` int,
	`category` varchar(64),
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `press_clippings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `press_clippings` ADD CONSTRAINT `press_clippings_phaseId_phases_id_fk` FOREIGN KEY (`phaseId`) REFERENCES `phases`(`id`) ON DELETE no action ON UPDATE no action;