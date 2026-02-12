ALTER TABLE `works` MODIFY COLUMN `dimensions` varchar(128);--> statement-breakpoint
ALTER TABLE `works` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `works` ADD `medium` varchar(255);--> statement-breakpoint
ALTER TABLE `works` ADD `year` varchar(16);--> statement-breakpoint
ALTER TABLE `works` ADD `curatorialHook` text;--> statement-breakpoint
ALTER TABLE `works` ADD `conceptTags` json;--> statement-breakpoint
ALTER TABLE `works` ADD CONSTRAINT `works_slug_unique` UNIQUE(`slug`);