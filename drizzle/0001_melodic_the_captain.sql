CREATE TABLE `archive_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`fileType` varchar(16),
	`fileSize` varchar(32),
	`fileUrl` text,
	`fileKey` varchar(512),
	`description` text,
	`category` varchar(64),
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `archive_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `essays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`description` text,
	`content` text,
	`category` varchar(64),
	`phaseId` int,
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `essays_id` PRIMARY KEY(`id`),
	CONSTRAINT `essays_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `metaquestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`isAnswered` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metaquestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `phases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(16) NOT NULL,
	`title` varchar(255) NOT NULL,
	`year` varchar(16) NOT NULL,
	`description` text,
	`emotionalTemperature` text,
	`color` varchar(32),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `phases_id` PRIMARY KEY(`id`),
	CONSTRAINT `phases_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `works` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`phaseId` int,
	`dateCreated` varchar(32),
	`technique` varchar(128),
	`dimensions` varchar(64),
	`colorPalette` varchar(128),
	`emotionalRegister` varchar(64),
	`imageUrl` text,
	`imageKey` varchar(512),
	`thumbnailUrl` text,
	`journalExcerpt` text,
	`neonReading` text,
	`seriesName` varchar(128),
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `works_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `essays` ADD CONSTRAINT `essays_phaseId_phases_id_fk` FOREIGN KEY (`phaseId`) REFERENCES `phases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `works` ADD CONSTRAINT `works_phaseId_phases_id_fk` FOREIGN KEY (`phaseId`) REFERENCES `phases`(`id`) ON DELETE no action ON UPDATE no action;