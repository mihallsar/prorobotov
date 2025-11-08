CREATE TABLE `useful_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`category` text NOT NULL,
	`icon_url` text,
	`order` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
