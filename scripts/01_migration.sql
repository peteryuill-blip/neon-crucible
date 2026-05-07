-- =============================================================================
-- CRUCIBLE MIGRATION — Step 1 of upload pipeline
-- =============================================================================
-- Run this ONCE before the first upload.
-- Adds:
--   1. New "Crucible" phase row (separate from NE — does not affect Big Bang etc.)
--   2. New columns on `works` table for Crucible-specific metadata
--
-- Safe to re-run: uses INSERT IGNORE and conditional column adds.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Add the Crucible phase
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO phases (code, title, year, description, emotionalTemperature, color, sortOrder)
VALUES (
  'Crucible',
  'The Crucible Year',
  '2025-2026',
  'A one-year intensive practice undertaken in Bangkok beginning December 2025. Large-format ink on East Asian rice paper. Every gesture irreversible. Every work catalogued. The wager is whether the conviction held since early adulthood is real.',
  'committed',
  '#00FFCC',
  100
);

-- -----------------------------------------------------------------------------
-- 2. Add Crucible-specific columns to works table
-- -----------------------------------------------------------------------------
-- Uses IGNORE to skip if column already exists (safe to re-run)

SET @db = DATABASE();

-- tCode
SET @col = 'tCode';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN tCode VARCHAR(16) NULL UNIQUE',
  'SELECT "tCode already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- sovereignId
SET @col = 'sovereignId';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN sovereignId VARCHAR(16) NULL',
  'SELECT "sovereignId already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- surface
SET @col = 'surface';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN surface VARCHAR(8) NULL',
  'SELECT "surface already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- surfaceName
SET @col = 'surfaceName';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN surfaceName VARCHAR(128) NULL',
  'SELECT "surfaceName already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ink
SET @col = 'ink';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN ink VARCHAR(255) NULL',
  'SELECT "ink already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- disposition
SET @col = 'disposition';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN disposition VARCHAR(8) NULL',
  'SELECT "disposition already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- hours
SET @col = 'hours';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN hours DECIMAL(4,1) NULL',
  'SELECT "hours already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- rating
SET @col = 'rating';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN rating INT NULL',
  'SELECT "rating already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- weekNumber
SET @col = 'weekNumber';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN weekNumber INT NULL',
  'SELECT "weekNumber already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- orientation
SET @col = 'orientation';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN orientation VARCHAR(16) NULL',
  'SELECT "orientation already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- technicalObservation
SET @col = 'technicalObservation';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN technicalObservation TEXT NULL',
  'SELECT "technicalObservation already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- discoveryNote
SET @col = 'discoveryNote';
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='works' AND COLUMN_NAME=@col) = 0,
  'ALTER TABLE works ADD COLUMN discoveryNote TEXT NULL',
  'SELECT "discoveryNote already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- -----------------------------------------------------------------------------
-- 3. Verify the migration
-- -----------------------------------------------------------------------------
SELECT 'Phase added/exists:' AS status;
SELECT id, code, title, year FROM phases WHERE code = 'Crucible';

SELECT 'New columns on works:' AS status;
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'works'
  AND COLUMN_NAME IN ('tCode', 'sovereignId', 'surface', 'surfaceName', 'ink', 'disposition', 'hours', 'rating', 'weekNumber', 'orientation', 'technicalObservation', 'discoveryNote')
ORDER BY ORDINAL_POSITION;
