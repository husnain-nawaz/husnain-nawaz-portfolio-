-- ==============================================================================
-- Husnain Nawaz Portfolio & CMS - Production MySQL Database Schema
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB 10.3+ (Hostinger, cPanel, VPS)
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Table: admins
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `role` VARCHAR(32) NOT NULL DEFAULT 'superadmin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: profile_settings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profile_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL DEFAULT 'Husnain Nawaz',
  `title` VARCHAR(255) NOT NULL DEFAULT 'Full-Stack Developer & UI/UX Engineer',
  `bio` TEXT NOT NULL,
  `about_long` LONGTEXT NULL,
  `email` VARCHAR(128) NOT NULL DEFAULT 'chhusnain2345@gmail.com',
  `phone` VARCHAR(64) NOT NULL DEFAULT '+92 309 9694193',
  `location` VARCHAR(128) NOT NULL DEFAULT 'Lahore, Pakistan',
  `avatar_url` VARCHAR(512) NULL,
  `github_url` VARCHAR(255) DEFAULT 'https://github.com/husnain-nawaz',
  `linkedin_url` VARCHAR(255) DEFAULT 'https://linkedin.com/in/husnain-nawaz',
  `twitter_url` VARCHAR(255) DEFAULT '',
  `whatsapp_url` VARCHAR(255) DEFAULT 'https://wa.me/923099694193',
  `resume_url` VARCHAR(512) DEFAULT '#',
  `years_experience` INT DEFAULT 3,
  `projects_completed` INT DEFAULT 24,
  `happy_clients` INT DEFAULT 18,
  `meta_title` VARCHAR(255) DEFAULT 'Husnain Nawaz – Full-Stack Developer & UI/UX Engineer',
  `meta_description` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: projects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `challenge` TEXT NULL,
  `solution` TEXT NULL,
  `results` TEXT NULL,
  `category` VARCHAR(64) NOT NULL DEFAULT 'Full-Stack',
  `tags` VARCHAR(512) NOT NULL DEFAULT 'React, Node.js',
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `order_index` INT NOT NULL DEFAULT 0,
  `image_url` VARCHAR(512) NOT NULL,
  `live_url` VARCHAR(512) NULL,
  `github_url` VARCHAR(512) NULL,
  `client_name` VARCHAR(128) NULL,
  `completion_date` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_featured` (`featured`),
  INDEX `idx_projects_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: blogs (Full Rank Math & SEO Fields)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(512) NOT NULL,
  `category` VARCHAR(64) NOT NULL DEFAULT 'Engineering',
  `tags` VARCHAR(512) NOT NULL DEFAULT 'Web Development, SEO',
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `read_time` VARCHAR(32) NOT NULL DEFAULT '5 min read',
  
  -- SEO & Rank Math specific fields
  `focus_keyword` VARCHAR(128) NULL,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `canonical_url` VARCHAR(512) NULL,
  `rank_math_score` INT UNSIGNED DEFAULT 85,
  `schema_type` VARCHAR(64) DEFAULT 'BlogPosting',
  `is_indexable` TINYINT(1) DEFAULT 1,
  
  `views_count` INT UNSIGNED DEFAULT 0,
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_blogs_slug` (`slug`),
  INDEX `idx_blogs_status` (`status`),
  INDEX `idx_blogs_published` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: skills
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(64) NOT NULL,
  `category` VARCHAR(64) NOT NULL, -- 'Languages & Frameworks', 'Platforms & Systems', 'Daily Dev Tools', 'Design & Architecture'
  `proficiency` INT UNSIGNED NOT NULL DEFAULT 90, -- percentage 0-100
  `icon_name` VARCHAR(64) DEFAULT 'Code',
  `experience_years` VARCHAR(32) DEFAULT '2+ years',
  `order_index` INT NOT NULL DEFAULT 0,
  INDEX `idx_skills_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: experiences
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role` VARCHAR(128) NOT NULL,
  `company` VARCHAR(128) NOT NULL,
  `location` VARCHAR(128) DEFAULT 'Lahore, Pakistan',
  `period` VARCHAR(64) NOT NULL,
  `type` ENUM('work', 'education', 'certification') NOT NULL DEFAULT 'work',
  `description` TEXT NOT NULL,
  `bullets_json` TEXT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  INDEX `idx_experiences_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: contact_messages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_messages_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 8. Seed Initial Data (Only if tables are empty)
-- -----------------------------------------------------------------------------

INSERT IGNORE INTO `admins` (`id`, `username`, `password_hash`, `email`, `role`) 
VALUES (1, 'admin', '$2a$10$T8Z4m1a/pS1T3M7O5/eZtuzZ9XhL3oG.Q.6YgQJ9kX5W0XqG2G7F6', 'chhusnain2345@gmail.com', 'superadmin');
-- Note: The above hash is for 'husnain@admin2026!'

INSERT IGNORE INTO `profile_settings` (`id`, `name`, `title`, `bio`, `about_long`, `email`, `phone`, `location`)
VALUES (1, 'Husnain Nawaz', 'Jr. Full-Stack Developer & UI/UX Engineer', 'Versatile Computer Science graduate with hands-on professional experience building modern web applications.', 'I am a full-stack engineer and designer based in Lahore, Pakistan.', 'chhusnain2345@gmail.com', '+92 309 9694193', 'Lahore, Pakistan');
