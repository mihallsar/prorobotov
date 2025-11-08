CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	`is_deleted` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `diy_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`difficulty` text NOT NULL,
	`image_url` text,
	`materials` text,
	`steps` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text,
	`order` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`summary` text,
	`image_url` text,
	`video_url` text,
	`source_url` text,
	`source_name` text,
	`published_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`is_auto_generated` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `news_sources_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`is_active` integer DEFAULT true,
	`last_fetched_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `robot_catalog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`price` text,
	`official_website` text,
	`image_url` text,
	`specifications` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
